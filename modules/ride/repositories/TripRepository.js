const models = require('../../../db/models');
const LocationRepository = require('../repositories/LocationRepository');
const GMAPService = require('../../../services/GmapService');
const { Trip, User, Company, sequelize} = models;
const cloudinary = require('../../../services/CloudinaryService');
const {getPagination, formatPagination} = require('../../../utils/helpers');
const { toUpper } = require('lodash');

const TripStatuses = ['NOT_STARTED', 'ACCEPTED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED', 'REJECTED', 'EN_ROUTE', 'DELIVERED'];

/**
 * 
 * @param {*} data 
 * @param {*} user_id 
 * @returns 
 */
exports.tripRequest = async function(data, user_id) {
    data.user_id = user_id;
    const tripDistance = await GMAPService.getDistance(
        [`${data.origin.latitude},${data.origin.longitude}`],
        [`${data.destination.latitude},${data.destination.longitude}`]
    );

    data.amount = await LocationRepository.calculateTripAmount(tripDistance, data.company_id);
    data.distance = tripDistance.distance.text;
    data.time_estimate = tripDistance.duration.text;

    if (data.pickup_date) {
        data.pickup_date = data.pickup_date + " " + data.pickup_time;
    } else {
        const today = new Date();
        const d = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
        data.pickup_date = d + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    }

    if(data.image) {
        let images = [];
        for (const image of data.image) {
            console.log(image);
            let upload = await cloudinary.uploader
                .upload(image.path)
                .then(result => {
                    return result;
                })
                .catch(err => {
                    throw new Error(err.message);
                });
            images.push(upload.secure_url)
        }
        data.images = images;
    }
    data.invoice_number = toUpper((Math.random() + 1).toString(36).substr(2, 10))
    return await Trip.create({...data});
}

exports.getTrips = async(data = {}, page = 1, perPage=15) => {
    let searchData = {};
    if(data.company_id) {
        searchData = {...searchData, company_id: data.company_id}
    }

    if(data.user_id) {
        searchData = {...searchData, user_id: data.user_id}
    }

    if(data.rider_id) {
        searchData = {...searchData, rider_id: data.rider_id}
    }

    if(data.status) {
        const obj = {...TripStatuses};
        const tripStatus = Object.keys(obj).find(key => obj[key] === toUpper(data.status));
        searchData = {...searchData, status: tripStatus}
    }

    let {limit, offset} = getPagination(page, perPage)
    let trips =  await Trip.findAndCountAll({
        where: searchData,
        order: [
            ['createdAt', 'DESC'],
            ['pickup_date', 'DESC']
        ],
        include: [
            { model: User, as: 'user', attributes: ['firstName', 'lastName','email', 'phone', 'imageUrl']},
            { model: User, as: 'rider', attributes: ['firstName', 'lastName','email', 'phone', 'imageUrl'], include: [
                {model: Company}
            ]},
        ],
        limit,
        offset,
       
    });
    return {trips: trips.rows,...formatPagination(trips, perPage, page)};
}

exports.getCountByStatus = async function(data={}) {
    let searchData = {};

    if(data.company_id) {
        searchData = {...searchData, company_id: data.company_id}
    }

    if(data.user_id) {
        searchData = {...searchData, user_id: data.user_id}
    }

    if(data.rider_id) {
        searchData = {...searchData, rider_id: data.rider_id}
    }

    let trips = await Trip.findAll({
        where: searchData,
        group: ['status'],
        attributes: ['status', [sequelize.fn('COUNT', 'status'), 'totalCount']],
      });
      
    let result = Object.fromEntries(Object.entries(trips)
        .map(([ key, val ]) => [TripStatuses[val.dataValues.status], val.dataValues.totalCount])
    );
    result.total = await Trip.count({
        where: searchData,
    });
    return result
}

/**
 * 
 * @param {*} id 
 * @returns {Object}
 */
exports.getTrip = async function (id) {
     const trip = await Trip.findOne({
        where: {id},
        include: [
            { model: User, as: 'user', attributes: ['firstName', 'lastName','email', 'phone', 'imageUrl']},
            { model: User, as: 'rider', attributes: ['firstName', 'lastName','email', 'phone', 'imageUrl']},
            { model: Company}
        ],
    });
    if(!trip) {
        throw new Error('Trip does not exist');
    }
    return trip;
}

exports.getTripByInvoice = async function (invoice_number) {
    const trip = await Trip.findOne({
       where: {invoice_number},
       include: [
           { model: User, as: 'user', attributes: ['firstName', 'lastName','email', 'phone', 'imageUrl']},
           { model: User, as: 'rider', attributes: ['firstName', 'lastName','email', 'phone', 'imageUrl']},
           { model: Company}
       ],
   });
   if(!trip) {
       throw new Error('Trip does not exist');
   }
   return trip;
}

exports.updateTrip = async function(data, id) {
    if(data.status) {
        const obj = {...TripStatuses};
        data.status = Object.keys(obj).find(key => obj[key] === toUpper(data.status));
    }
    return await Trip.update({ ...data }, { where: { id } });
}
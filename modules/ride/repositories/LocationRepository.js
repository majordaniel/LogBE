const models = require('../../../db/models');
const RedisService = require('../../../services/RedisService');
const LocationService = require('../../../services/LocationService');
const GMAPService = require('../../../services/GmapService');
const { Vehicle, Role, User, Location } = models;
const _ = require('lodash');

/**
 * 
 * @param {*} data 
 * @returns 
 */
exports.getClosestRider = async (data) => {
    const role = await Role.findOne({ where: { name: 'rider' } });
    let riderQueryParam = {role_id: role.id, isOnline: true};
    if (data.carrier) {
        riderQueryParam = {...riderQueryParam, vehicle_id: data.carrier};
    }
    const onlineRiders = await User.findAll({ where: riderQueryParam, include: "Company"});
    const userLocation = `${data.latitude}, ${data.longitude}`;
    let ridersLocation = [];
    for (const element of onlineRiders) {
        const riderLocation = await LocationService.getLocation(element.id);
        if (riderLocation.latitude && riderLocation.longitude) {
            let position = await GMAPService.getDistance([userLocation], [`${riderLocation.latitude}, ${riderLocation.longitude}`])
            position.company_id = element.company_id;
            position.rider_id = element.id;
            position.Company = element.Company;
            ridersLocation.push(position);
        }
    }
    ridersLocation = _.sortBy(ridersLocation, ['distance.value'])
    const logisticPartners = _.groupBy(ridersLocation, 'company_id')
    return logisticPartners;

}

/**
 * Gets Logistic companies and driver around trip origin
 * 
 * @param {*} data 
 * @returns 
 */
exports.getLogisticPartners = async (data) => {
    const origin = `${data.origin.latitude}, ${data.origin.longitude}`;
    const destination = `${data.destination.latitude}, ${data.destination.longitude}`
    const tripDistance = await GMAPService.getDistance([origin], [destination]);
    let partners = await this.getClosestRider(data.origin);

    let result = [];
    Object.values(partners).forEach(async (partner) => {
        let data = partner[0];
        data.amount = await this.calculateTripAmount(tripDistance, data.company_id);
        data.amount = Math.round(data.amount/100, 2);
        result.push(data);
    })
    return result;
}

/**
 * Calculate trip ammount in kobo
 * 
 * @param {*} data 
 * @param {*} company_id 
 * @returns 
 */
exports.calculateTripAmount = async (data, company_id) => {
    const amountPerKm = 95;
    const baseAmount = 1000;
    let estimate = Math.round(amountPerKm * (parseFloat(data.distance.value) / 1000 - 1), 2);
    return baseAmount + estimate * 100;
}

/**
 * Add user locations
 * 
 * @param {*} data 
 * @param {*} user_id 
 * @returns 
 */
exports.addLocation = async (data, user_id) => {
    data.user_id = user_id;
    return await Location.create({...data});
}

/**
 * Update User Location
 * 
 * @param {*} data 
 * @param {*} id 
 * @param {*} user_id 
 * @returns 
 */
exports.updateLocation = async (data, id, user_id) => {
    if (data.isDefault) {
        await Location.update({isDefault: false}, {where: {user_id: user_id, isDefault: true }});
    }
    return await Location.update({ ...data }, { where: { id } });
}

/**
 * 
 * @param {string} user_id 
 * @returns 
 */
exports.getLocations = async (user_id) => {
    return await Location.findAll({where: {user_id: user_id}});
}
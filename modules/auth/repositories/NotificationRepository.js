const models = require('../../../db/models');
const { User, Notification, Trip } = models;
const ExpoService = require('../../../services/ExpoService');
const {getPagination, formatPagination} = require('../../../utils/helpers');

exports.notify = async (data) => {
    return await Notification.create({...data});
}


/**
 * 
 * @param {*} page 
 * @param {*} perPage 
 * @returns 
 */
 exports.listNotifications = async(data={}, page=1, perPage=15) => {
    let searchData = {};

    if (data.user_id) {
        searchData = { ...searchData, 'user_id': data.user_id }
    }

    let {limit, offset} = getPagination(page, perPage)
    const query = {
        where: searchData,
    }

    let notifications =  await Notification.findAndCountAll({
        ...query,
        limit,
        offset,
    });
    return {notifications: notifications.rows,...formatPagination(notifications, perPage, page)};
}

exports.tripNotification = async(initiator_id, trip_id, title, message) => {
    const trip = await Trip.findOne({
        where: {id: trip_id}
    });

    let toNotify = null;
    if (trip.dataValues.user_id === initiator_id) {
        toNotify = trip.dataValues.rider_id;
    } else {
        toNotify = trip.dataValues.user_id;
    }

    const user = await User.findOne({
        where: {id: toNotify},
        attributes: ['expoToken']
    });
    
    await ExpoService.sendNotification(user.dataValues.expoToken, title, message, trip)
}
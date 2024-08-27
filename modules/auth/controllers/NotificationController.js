const UserRepository = require('../repositories/UserRepository');
const CompanyRepository = require('../repositories/CompanyRepository');
const NotificationRepository = require('../repositories/NotificationRepository');

const models = require('../../../db/models');
const { Vehicle, Role } = models;
const { successResponse,
    generateToken,
    errorResponse
} = require('../../../utils/helpers');

exports.getNotification = async(req, res) => {
    try {
        const {perPage, page} = req.query;
        let {id} = req.user;
        const notifications = await NotificationRepository.listNotifications({user_id: id}, page, perPage)
        return successResponse(res, 200, 'success', notifications)
    } catch (error) {
        return errorResponse(res, 400, error.message);  
    }
    
}

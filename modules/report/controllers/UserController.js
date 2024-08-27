const UserRepository = require('../../auth/repositories/UserRepository');
const CompanyRepository = require('../../auth/repositories/CompanyRepository');
const { successResponse,
    generateToken,
    errorResponse
} = require('../../../utils/helpers');



exports.listAdminUsers = async (req, res) => {
    try {
        const { search, page, perPage } = req.query;
        const users = await UserRepository.listUsers({ role: 'admin', name: search }, page, perPage);
        return successResponse(res, 200, 'admin users', users);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

exports.listUsers = async (req, res) => {
    try {
        const { search, page, perPage } = req.query;
        const users = await UserRepository.listUsers({ role: 'user', name: search }, page, perPage);
        return successResponse(res, 200, 'users', users);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}
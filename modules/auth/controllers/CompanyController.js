const UserRepository = require('../repositories/UserRepository');
const CompanyRepository = require('../repositories/CompanyRepository');
const models = require('../../../db/models');
const { Vehicle, Role } = models;
const { successResponse,
    generateToken,
    errorResponse
} = require('../../../utils/helpers');


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 exports.login = async (req, res) => {
    let data = req.body;
    try {
        let user = await UserRepository.authenticate(data);
        const role = await Role.findOne({where: {name: 'company_admin'} });
        if (user.role_id !== role.id) {
            return errorResponse(res, 401, 'User not authorised');
        }
        const tokenPayload = {
            id: user.id,
            phone: user.phone,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role_id: user.role_id,
            company_id: user.company_id
        };
        const token = await generateToken(tokenPayload);
        user = user.toJSON();
        return successResponse(res, 200, 'You have been logged in successfully', {
            user,
            token,
          });
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.createRider = async(req, res) => {
    let data = req.body;
    try {
        if (!await Vehicle.findByPk(data.vehicle_id)) {
            return errorResponse(res, 400, 'Vehicle does not exist');
        }
        data.company_id = req.user.company_id;
        let rider = await UserRepository.createUser(data, 'rider');
        rider = rider.toJSON();
        return successResponse(res, 200, 'Rider created successfully', {
            rider,
        });
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getRiders = async(req, res) => {
    try {
        let users = await CompanyRepository.getRiders(req.user.company_id);
        return successResponse(res, 200, 'success', users);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getCompany = async(req, res) => {
    const {id } = req.params;
    try {
        let company = await CompanyRepository.getCompany(id);
        return successResponse(res, 200, 'success', company);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

exports.updateCompany = async(req, res) => {
    const {id} = req.params;
    let data = req.body;
    try {
        let company = await CompanyRepository.updateCompany(data, id);
        return successResponse(res, 200, 'updated company successful');
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

exports.deleteCompany = async(req, res) => {
    const {id} = req.params;
    try {
        let company = await CompanyRepository.deleteCompany(id);
        return successResponse(res, 204, 'company deleted');
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

exports.addUser = async (req, res) => {
    let data = req.body;
    try {
        data.company_id = req.user.company_id;
        let user = await UserRepository.createUser(data, 'company_admin');
        return successResponse(res, 200, 'user created successful', user);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

exports.listUsers = async(req, res) => {
    try {
        const {perPage, page} = req.query;
        const data = {role: 'company_admin', company_id: req.user.company_id};
        const users = await UserRepository.listUsers(data, page, perPage);
        return successResponse(res, 200, 'company users', users);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}
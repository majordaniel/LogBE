const UserRepository = require('../repositories/UserRepository');
const CompanyRepository = require('../repositories/CompanyRepository');
const models = require('../../../db/models');
const { Otp, Role } = models;
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
        const role = await Role.findOne({where: {name: 'admin'} });
        if (user.role_id !== role.id) {
            return errorResponse(res, 401, 'User not authorised');
        }
        const tokenPayload = {
            id: user.id,
            phone: user.phone,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role_id: user.role_id
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

exports.createCompany = async(req, res) => {
    let data = req.body;
    const userObject = {
        firstName: data.admin_first_name,
        lastName: data.admin_last_name,
        phone: data.admin_phone,
        password: data.admin_password,
        email: data.email,
    }
    
    try {
        let user = await UserRepository.createUser(userObject, 'company_admin');
        const company = await CompanyRepository.createCompany(data, user.id);
        await UserRepository.updateUser({company_id: company.id}, user.id);

        return successResponse(res, 200, 'company created successful', company);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

exports.addUser = async (req, res) => {
    let data = req.body;
    try {
        let user = await UserRepository.createUser(data, 'admin');
        return successResponse(res, 200, 'user created successful', user);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

exports.updateUser = async (req, res) => {
    let data = req.body;
    let {id} = req.params;
    try {
        let user = await UserRepository.updateUser(data, id);
        return successResponse(res, 200, 'user updated successful');
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

exports.deleteUser = async (req, res) => {
    let {id} = req.params;
    try {
        user = await UserRepository.deleteUser(id);
        return successResponse(res, 200, 'user deleted');
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}


exports.listUsers = async(req, res) => {
    try {
        const {perPage, page} = req.query;
        const users = await UserRepository.listUsers({role: 'admin'}, page, perPage);
        return successResponse(res, 200, 'admin users', users);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

exports.showUser = async(req, res) => {
    try {
        let {id} = req.params;
        const user = await UserRepository.getUser(id);
        return successResponse(res, 200, 'success', user);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}
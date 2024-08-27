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
        const role = await Role.findOne({where: {name: 'rider'} });
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

exports.getCompanyDetails = async (req, res) => {
    const {id} = req.user;
    try {
        let user = await UserRepository.getUser(id);
        const company = await CompanyRepository.getCompany(user.company_id)
        return successResponse(res, 200, 'success', company);
    } catch (error) {
        return errorResponse(res, 400, error.message);  
    }
}
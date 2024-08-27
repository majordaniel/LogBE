const dotenv = require('dotenv');

const { errorResponse, verifyToken, checkDuplicateUser } = require('../utils/helpers');
const models = require('../db/models');
const { User, Role } = models;

dotenv.config();

/**
 *
 *
 * @export
 * @param {object} req
 * @param {object} res
 * @param {void} next
 * @returns {void}
 */
exports.checkAuthorizedUser = async function (req, res, next) {
  try {
    const token = req.headers.authorization || req.headers['x-access-token'];
    if (!token) {
      return errorResponse(res, 401, 'Please provide a JWT token');
    }
    req.user = await verifyToken(token, process.env.SECRET_KEY);
    if (!req.user) {
      return errorResponse(
        res,
        401,
        'Token is invalid, please provide a valid token',
      );
    }

    next();
  } catch (error) {
    return errorResponse(res, 401, error.message);
  }
}

/**
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {void}
 */
exports.checkVerifedUser = async function (req, res, next) {
  const user = await User.findOne({ where: { id: req.user.id } });
  if (!user.isVerified) {
    return errorResponse(res, 400, 'Enter the Code sent to you to continue');
  }
  next();
}

exports.adminOnly = async function (req, res, next) {
  if (true === await roleValidate(req, res, 'admin')) {
    next();
  }
}

exports.riderOnly = async function (req, res, next) {
  if (true === await roleValidate(req, res, 'rider')) {
    next();
  }
}

exports.companyOnly = async function (req, res, next) {
  if (true === await roleValidate(req, res, 'company_admin')) {
    next();
  }
}


/**
 * 
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} roleName 
 * @returns 
 */
const roleValidate = async(req, res, roleName) => {
  const role = await Role.findOne({where: {name: roleName} });
  if (req.user.role_id !== role.id) {
    return errorResponse(res, 400, 'User is not Authorised to perform action');
  }
  return true;
}

exports.duplicateUserValidation = async (req, res, next) => {
    const { email, phone } = req.body;
    const isDuplicate = await checkDuplicateUser(phone, email);
    if (isDuplicate) {
      if (isDuplicate.phone === phone) {
        return errorResponse(
          res,
          409,
          'Sorry, this phone number has already been taken',
        );
      }
      if (isDuplicate.email === email) {
        return errorResponse(
          res,
          409,
          'Sorry, this email has already been taken',
        );
      }
    }
    return next();
  };
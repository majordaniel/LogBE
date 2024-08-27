const validator = require('../../../utils/validator.utils');
const {
  userSchema,
  userOtp,
  regUserSchema,
  userDetail,
  userInterests,
  resetPasswordSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  companySchema,
  riderSchema,
  updateCompanySchema,
} = require('../requests/validation-schema.utils');

/**
 * Input validator for a new user account
 * @param {Object} req - request body
 * @param {Object} res - response object
 * @param {Object} next - pass control to the next handler
 * @returns {Object} Validator helper function
 */
exports.validateNewUser = (req, res, next) => {
  validator(req.body, userSchema, res, next);
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {Object} Validator helper function
 */
exports.validateVerifyToken = (req, res, next) => {
  validator(req.body, userOtp, res, next);
};

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {Object} Validator helper function
 */
exports.validateReturningUser = (req, res, next) => {
  validator(req.body, regUserSchema, res, next);
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {Object} Validator helper function
 */
exports.validateUpdateUser = (req, res, next) => {
  validator(req.body, userDetail, res, next);
};

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Object} validator helper function
 */
exports.validateUserInterests = (req, res, next) => {
  validator(req.body, userInterests, res, next);
};

exports.validateChangePassword = (req, res, next) => {
    validator(req.body, changePasswordSchema, res, next);
};

exports.validatePasswordReset = (req, res, next) => {
  validator(req.body, resetPasswordSchema, res, next);
};

exports.validateForgotPassword = (req, res, next) => {
  validator(req.body, forgotPasswordSchema, res, next);
};

exports.validateCreateCompany = (req, res, next) => {
  validator(req.body, companySchema, res, next);
};

exports.validateUpdateCompany = (req, res, next) => {
  validator(req.body, updateCompanySchema, res, next);
};

exports.validateCreateRider = (req, res, next) => {
    validator(req.body, riderSchema, res, next);
};
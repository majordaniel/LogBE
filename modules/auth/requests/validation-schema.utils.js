const Joi = require('joi');

/**
 * This is the schema definition
 * for a Article.
 */
exports.userSchema = Joi.object().keys({
  firstName: Joi.string().trim().min(3).required(),
  lastName: Joi.string().trim().min(3).required(),
  email: Joi.string().lowercase().trim().email().required(),
  referal_code: Joi.string().allow('').optional(),
  phone: Joi.number().min(10).required(),
  password: Joi.string().min(6).required(),
});

exports.userOtp = Joi.object().keys({
  code: Joi.string().min(4).max(4).required(),
});

exports.regUserSchema = Joi.object().keys({
  phone: Joi.number().min(10).required(),
  password: Joi.string().min(6).required(),
});

exports.userDetail = Joi.object().keys({
  firstName: Joi.string().trim().min(3).optional(),
  lastName: Joi.string().trim().min(3).optional(),
  email: Joi.string().lowercase().trim().email().optional(),
  isActive: Joi.boolean().optional(),
  expoToken: Joi.string().trim().optional(),
}).required().min(1);

exports.userInterests = Joi.object().keys({
  interests: Joi.array().items(Joi.number().required()).required(),
});

exports.forgotPasswordSchema = Joi.object().keys({
    phone: Joi.number().min(10).required(),
});

exports.changePasswordSchema = Joi.object().keys({
    password: Joi.string().min(6).required(),
    new_password: Joi.string().min(6).required(),
});

exports.resetPasswordSchema = Joi.object().keys({
  token: Joi.string().alphanum().trim().required(),
  password: Joi.string().min(6).required(),
});

exports.companySchema = Joi.object().keys({
  name: Joi.string().trim().required(),
  address: Joi.string().required(),
  email: Joi.string().required(),
  // image: Joi.any().optional(),
  phone: Joi.number().min(10).required(),
  admin_first_name: Joi.string().required(),
  admin_last_name: Joi.string().required(),
  admin_phone: Joi.number().min(10).required(),
  admin_password: Joi.string().required()
});

exports.updateCompanySchema = Joi.object().keys({
  name: Joi.string().trim().optional(),
  address: Joi.string().optional(),
  // image: Joi.any().optional(),
  phone: Joi.number().min(10).optional(),
  email: Joi.string().lowercase().trim().email().optional(),
  isActive : Joi.boolean().optional()
});

exports.riderSchema = Joi.object().keys({
    firstName: Joi.string().trim().min(3).required(),
    lastName: Joi.string().trim().min(3).required(),
    email: Joi.string().lowercase().trim().email().required(),
    phone: Joi.number().min(10).required(),
    password: Joi.string().min(6).required(),
    vehicle_id: Joi.string().required()
});

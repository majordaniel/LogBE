const Joi = require('joi');
const { errorResponse } = require('./helpers');

/**
 * Input validator for a new user account
 * @param {Object} input - user input
 * @param {Object} schema - validation schema
 * @param {Object} res - Express response object
 * @param {Object} next - pass control to the next handler
 * @returns {Object} Error Response if validation fails
 */
const validator = (input, schema, res, next) => {
  const { error } = schema.validate(input, {
    abortEarly: false,
    language: {
      key: '{{key}} ',
    },
  });

  if (error) {
    const validationError = error.details.map(errorItem => errorItem.message);
    return errorResponse(res, 422, 'validation error', validationError);
  }

  next();
};

module.exports = validator;

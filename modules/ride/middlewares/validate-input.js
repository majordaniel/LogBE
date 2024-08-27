const validator = require('../../../utils/validator.utils');
const {
  priceEstimateSchema,
  tripRequestSchema,
  locationSchema,
  updateTripSchema,
  reviewCompanySchema,
  reviewRiderSchema
} = require('../requests/validation-schema.utils');

/**
 * Input validator for price estimate
 * @param {Object} req - request body
 * @param {Object} res - response object
 * @param {Object} next - pass control to the next handler
 * @returns {Object} Validator helper function
 */
exports.validatePriceEstimate = (req, res, next) => {
  validator(req.body, priceEstimateSchema, res, next);
};


/**
 * Input validator for trip request
 * @param {Object} req - request body
 * @param {Object} res - response object
 * @param {Object} next - pass control to the next handler
 * @returns {Object} Validator helper function
 */
 exports.validateTripRequest = (req, res, next) => {
    validator(req.body, tripRequestSchema, res, next);
  };

  /**
 * Input validator for Location request
 * @param {Object} req - request body
 * @param {Object} res - response object
 * @param {Object} next - pass control to the next handler
 * @returns {Object} Validator helper function
 */
exports.validateLocationRequest = (req, res, next) => {
    validator(req.body, locationSchema, res, next);
};

 /**
 * Input validator for Update Trip request
 * @param {Object} req - request body
 * @param {Object} res - response object
 * @param {Object} next - pass control to the next handler
 * @returns {Object} Validator helper function
 */
  exports.validateUpdateTrip = (req, res, next) => {
    validator(req.body, updateTripSchema, res, next);
};


 /**
 * Input validator for Rider Schema request
 * @param {Object} req - request body
 * @param {Object} res - response object
 * @param {Object} next - pass control to the next handler
 * @returns {Object} Validator helper function
 */
  exports.validateReviewRider = (req, res, next) => {
    validator(req.body, reviewRiderSchema, res, next);
};


 /**
 * Input validator for Review Company request
 * @param {Object} req - request body
 * @param {Object} res - response object
 * @param {Object} next - pass control to the next handler
 * @returns {Object} Validator helper function
 */
  exports.validateReviewCompany = (req, res, next) => {
    validator(req.body, reviewCompanySchema, res, next);
};
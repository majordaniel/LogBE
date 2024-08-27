const Joi = require('joi');

/**
 * This is the schema definition
 * for a Article.
 */
exports.priceEstimateSchema = Joi.object().keys({
  origin: Joi.object().required().keys({
      latitude: Joi.number().unsafe().min(0).max(90).required(),
      longitude: Joi.number().unsafe().min(-180).max(180).required()
  }),
  destination: Joi.object().required().keys({
    latitude: Joi.number().unsafe().min(0).max(90).required(),
    longitude: Joi.number().unsafe().min(-180).max(180).required()
  }),
  carrier: Joi.string().optional(),
});

exports.tripRequestSchema = Joi.object().keys({
    origin: Joi.object().required().keys({
        address: Joi.string().required(),
        name: Joi.string().required(),
        phone: Joi.number().min(10).required(),
        latitude: Joi.number().unsafe().min(0).max(90).required(),
        longitude: Joi.number().unsafe().min(-180).max(180).required(),
        saveAddress: Joi.boolean().optional()
    }),
    destination: Joi.object().required().keys({
        address: Joi.string().required(),
        name: Joi.string().required(),
        phone: Joi.number().min(10).required(),
        latitude: Joi.number().unsafe().min(0).max(90).required(),
        longitude: Joi.number().unsafe().min(-180).max(180).required(),
        saveAddress: Joi.boolean().optional()
    }),
    carrier: Joi.string().required(),
    weight: Joi.number().required(),
    comment: Joi.string().optional(),
    payment_method: Joi.string().required(),
    pickup_date: Joi.date().iso().optional(),
    pickup_time: Joi.string().optional(),
    company_id: Joi.string().required(),
    rider_id: Joi.string().required(),
});

exports.locationSchema = Joi.object().required().keys({
    address: Joi.string().required(),
    name: Joi.string().required(),
    phone: Joi.number().min(10).required(),
    latitude: Joi.number().unsafe().min(0).max(90).required(),
    longitude: Joi.number().unsafe().min(-180).max(180).required(),
    isDefault: Joi.boolean().optional()
});

exports.updateTripSchema = Joi.object().required().keys({
    rider_id: Joi.string().optional(),
    isPaid: Joi.boolean().optional(),
    delivery_date: Joi.date().iso().optional(),
    comment: Joi.string().optional(),
    completed_date: Joi.date().iso().optional(),
    status: Joi.string().valid(...['ACCEPTED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED', 'REJECTED', 'EN_ROUTE', 'DELIVERED']).optional(),
    // tp_comment: Joi.string().optional()
    // .when("status", {
    //     is: Joi.string().valid(...['CANCELLED']),
    //     then: Joi.required()
    // })
});

exports.reviewRiderSchema = Joi.object().required().keys({
    rider_id: Joi.string().uuid().required(),
    trip_id: Joi.string().uuid().required(),
    comment: Joi.string().optional(),
    rating: Joi.number().valid(...[1,2,3,4,5]).required()
});


exports.reviewCompanySchema = Joi.object().required().keys({
    company_id: Joi.string().uuid().required(),
    trip_id: Joi.string().uuid().required(),
    comment: Joi.string().optional(),
    rating: Joi.number().valid(...[1,2,3,4,5]).required()
});

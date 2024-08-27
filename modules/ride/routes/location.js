const { Router } = require('express');
const locationRouter = Router();

const LocationController = require('../controllers/LocationController');
const schema = require('../middlewares/validate-input');

locationRouter.get('/', LocationController.getLocations);
locationRouter.post('/estimate', schema.validatePriceEstimate, LocationController.getPriceEstimate);
locationRouter.post('/add', schema.validateLocationRequest, LocationController.addLocation);
locationRouter.post('/edit/:id', schema.validateLocationRequest, LocationController.editLocation);


module.exports = locationRouter;

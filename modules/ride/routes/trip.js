const { Router } = require('express');
const tripRouter = Router();

const TripController = require('../controllers/TripController');
const schema = require('../middlewares/validate-input');

tripRouter.post('/request', schema.validateTripRequest, TripController.tripRequest);
tripRouter.get('/history', TripController.getPastTrips);
tripRouter.get('/user/:id', TripController.userTrips);


// company trip routes
tripRouter.get('/company/:id', TripController.getCompanyTrips)
tripRouter.get('/request/:id', TripController.getTrip);
tripRouter.get('/invoice/:id', TripController.getTripByInvoice);
tripRouter.post('/request/:id', schema.validateUpdateTrip, TripController.updateTrip);
tripRouter.post('/request/:id/payment', TripController.requestPayment);
tripRouter.post('/request/:id/payment/complete', TripController.markAsPaid);



module.exports = tripRouter;

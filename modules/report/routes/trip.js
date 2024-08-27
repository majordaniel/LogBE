const { Router } = require('express');
const adminRouter = Router();

const RideController = require('../controllers/RideController');
const middleware = require('../../../middlewares/authorised-user');

//Protected Routes
adminRouter.use('/', middleware.checkAuthorizedUser);

adminRouter.get('/list', middleware.adminOnly, RideController.getAllTrip);
adminRouter.get('/stats', RideController.getTripStats);
adminRouter.get('/company/:id', RideController.getCompanyTrips);
adminRouter.get('/company/:id/stats', RideController.getCompanyTripStats);

adminRouter.get('/rider/:id', RideController.getRiderTrips);
adminRouter.get('/rider/:id/stats', RideController.getRiderTripStats);




module.exports = adminRouter;
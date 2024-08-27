const { Router } = require('express');
const tripRouter = Router();

const ReviewController = require('../controllers/ReviewController');
const schema = require('../middlewares/validate-input');

tripRouter.post('/rider', schema.validateReviewRider, ReviewController.reviewRider);
tripRouter.post('/company', schema.validateReviewCompany, ReviewController.reviewCompany);


module.exports = tripRouter;
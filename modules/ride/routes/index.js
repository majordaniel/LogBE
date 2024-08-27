const { Router } = require('express');

const router = Router();

const carrier = require('./carrier');
const location = require('./location');
const trip = require('./trip');
const review = require('./review');

const middleware = require('../../../middlewares/authorised-user');



router.use('/', middleware.checkAuthorizedUser)
router.use('/carrier', carrier);
router.use('/location', location);
router.use('/trip', trip);
router.use('/review', review);


module.exports = router;
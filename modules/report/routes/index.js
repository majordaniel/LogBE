const { Router } = require('express');

const adminRouter = require('./user');
const companyRouter = require('./company');
const tripRouter = require('./trip');




const router = Router();

// general route
router.use('/user', adminRouter);
router.use('/company', companyRouter);
router.use('/trip', tripRouter);



module.exports = router;

const { Router } = require('express');

const userRouter = require('./user');
const adminRouter = require('./admin');
const companyRouter = require('./company');
const riderRouter = require('./rider');
const router = Router();

// general route
router.use('/user', userRouter);
router.use('/admin', adminRouter);
router.use('/company', companyRouter);
router.use('/rider', riderRouter);



module.exports = router;

const { Router } = require('express');

const router = Router();
const authRoutes = require('../modules/auth/routes');
const rideRoutes = require('../modules/ride/routes');
const reportRoutes = require('../modules/report/routes');
const transRoutes = require('../modules/transaction/routes');



router.use('/auth', authRoutes);
router.use('/ride', rideRoutes);
router.use('/report', reportRoutes);
router.use('/transaction', transRoutes);



module.exports = router;

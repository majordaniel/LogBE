const { Router } = require('express');
const carrierRouter = Router();

const carrierController = require('../controllers/CarrierController');

carrierRouter.get('/', carrierController.listVehicles);


module.exports = carrierRouter;
const { Router } = require('express');
const adminRouter = Router();

const UserController = require('../controllers/UserController');
const middleware = require('../../../middlewares/authorised-user');

//Protected Routes
adminRouter.use('/', middleware.checkAuthorizedUser, middleware.adminOnly);

adminRouter.get('/admin', UserController.listAdminUsers);
adminRouter.get('/list', UserController.listUsers);

module.exports = adminRouter;
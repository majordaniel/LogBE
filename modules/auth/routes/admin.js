const { Router } = require('express');
const adminRouter = Router();

const AuthController = require('../controllers/UserController');
const AdminController = require('../controllers/AdminController');
const CompanyController = require('../controllers/CompanyController');

const schema = require('../middlewares/validate-input');
const middleware = require('../../../middlewares/authorised-user');

adminRouter.post('/login', schema.validateReturningUser, AdminController.login);
adminRouter.post('/password/forgot', schema.validateForgotPassword, AuthController.forgotPassword)
adminRouter.post('/password/reset', schema.validatePasswordReset, AuthController.resetPassword)

//Protected Routes
adminRouter.use('/', middleware.checkAuthorizedUser, middleware.adminOnly);

adminRouter.get('/authenticated', AuthController.authenticatedUser);
adminRouter.post('/profile', schema.validateUpdateUser, AuthController.updateUser);
adminRouter.post('/password/change', schema.validateChangePassword, AuthController.changePassword);
adminRouter.post('/onboard/company', schema.validateCreateCompany, AdminController.createCompany);

adminRouter.get('/users', AdminController.listUsers);
adminRouter.post('/users/add', schema.validateNewUser, AdminController.addUser);
adminRouter.get('/users/:id', AdminController.showUser);
adminRouter.post('/users/:id', schema.validateUpdateUser, AdminController.updateUser);
adminRouter.delete('/users/:id', AdminController.deleteUser);


adminRouter.post('/company/:id', schema.validateUpdateCompany, CompanyController.updateCompany);
adminRouter.delete('/company/:id', CompanyController.deleteCompany);
adminRouter.get('/company/:id', CompanyController.getCompany);


module.exports = adminRouter;
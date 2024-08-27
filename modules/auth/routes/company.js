const { Router } = require('express');
const companyRouter = Router();

const AuthController = require('../controllers/UserController');
const AdminController = require('../controllers/AdminController');
const CompanyController = require('../controllers/CompanyController');
const schema = require('../middlewares/validate-input');
const middleware = require('../../../middlewares/authorised-user');

companyRouter.post('/login', schema.validateReturningUser, CompanyController.login);
companyRouter.post('/password/forgot', schema.validateForgotPassword, AuthController.forgotPassword)
companyRouter.post('/password/reset', schema.validatePasswordReset, AuthController.resetPassword)

companyRouter.use('/', middleware.checkAuthorizedUser);

companyRouter.post('update/:id', schema.validateUpdateCompany, CompanyController.updateCompany);
companyRouter.delete('delete/:id', middleware.adminOnly, CompanyController.deleteCompany);
companyRouter.get('view/:id', CompanyController.getCompany);



companyRouter.use('/', middleware.companyOnly);
companyRouter.post('/verify', schema.validateVerifyToken, AuthController.verifyUser);
companyRouter.post('/resend/otp', AuthController.resendOtp);


companyRouter.use('/', middleware.checkVerifedUser);
companyRouter.get('/authenticated', AuthController.authenticatedUser);
companyRouter.post('/profile', schema.validateUpdateUser, AuthController.updateUser);
companyRouter.post('/password/change', schema.validateChangePassword, AuthController.changePassword);


// company admin users
companyRouter.get('/users', CompanyController.listUsers);
companyRouter.post('/users/add', schema.validateNewUser, CompanyController.addUser);
companyRouter.get('/users/:id', AdminController.showUser);
companyRouter.post('/users/:id', schema.validateUpdateUser, AdminController.updateUser);
companyRouter.delete('/users/:id', AdminController.deleteUser);

// company riders
companyRouter.post('/onboard/rider', schema.validateCreateRider, CompanyController.createRider);
companyRouter.get('/riders', CompanyController.getRiders);
companyRouter.get('/riders/:id', AdminController.showUser);
companyRouter.post('/riders/:id', schema.validateUpdateUser, AdminController.updateUser);
companyRouter.delete('/riders/:id', AdminController.deleteUser);



module.exports = companyRouter;
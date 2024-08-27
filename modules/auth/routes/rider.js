const { Router } = require('express');
const riderRouter = Router();

const AuthController = require('../controllers/UserController');
const RiderController = require('../controllers/RiderController');
const NotificationController = require('../controllers/NotificationController');

const schema = require('../middlewares/validate-input');
const middleware = require('../../../middlewares/authorised-user');

riderRouter.post('/login', schema.validateReturningUser, RiderController.login);
riderRouter.post('/password/forgot', schema.validateForgotPassword, AuthController.forgotPassword)
riderRouter.post('/password/reset', schema.validatePasswordReset, AuthController.resetPassword)

riderRouter.use('/', middleware.checkAuthorizedUser, middleware.riderOnly);

riderRouter.get('/notifications', NotificationController.getNotification);
riderRouter.post('/verify', schema.validateVerifyToken, AuthController.verifyUser);
riderRouter.post('/resend/otp', AuthController.resendOtp);


riderRouter.use('/', middleware.checkVerifedUser);
riderRouter.get('/authenticated', AuthController.authenticatedUser);
riderRouter.post('/profile', schema.validateUpdateUser, AuthController.updateUser);
riderRouter.post('/password/change', schema.validateChangePassword, AuthController.changePassword);
riderRouter.get('/company_detail', RiderController.getCompanyDetails);

module.exports = riderRouter;
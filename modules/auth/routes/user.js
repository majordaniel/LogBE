const { Router } = require('express');
const userRouter = Router();

const AuthController = require('../controllers/UserController');
const schema = require('../middlewares/validate-input');
const middleware = require('../../../middlewares/authorised-user');

// general route

userRouter.post(
    '/register',
    schema.validateNewUser,
    middleware.duplicateUserValidation,
    AuthController.register,
  );
userRouter.post('/login', schema.validateReturningUser, AuthController.login);
userRouter.post('/password/forgot', schema.validateForgotPassword, AuthController.forgotPassword)
userRouter.post('/password/reset', schema.validatePasswordReset, AuthController.resetPassword)


//protected routes
userRouter.use('/', middleware.checkAuthorizedUser);
userRouter.post(
    '/verify',
    schema.validateVerifyToken,
    AuthController.verifyUser,
  );
userRouter.get('/authenticated', AuthController.authenticatedUser);
userRouter.post('/profile', schema.validateUpdateUser, AuthController.updateUser);
userRouter.post('/password/change', schema.validateChangePassword, AuthController.changePassword);
userRouter.post('/resend/otp', AuthController.resendOtp);


module.exports = userRouter;

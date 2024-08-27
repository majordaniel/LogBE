const UserRepository = require('../repositories/UserRepository');
const models = require('../../../db/models');
const MailService = require('../../../services/MailService');
const {Otp, PasswordResets, User} = models;
const {
    successResponse,
    generateToken,
    errorResponse
} = require('../../../utils/helpers');

/**
 * Register User
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.register = async (req, res) => {
    let data = req.body;
    try {
        let user = await UserRepository.createUser(data);
        const tokenPayload = {
            id: user.id,
            phone: user.phone,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role_id: user.role_id
        };
        const token = await generateToken(tokenPayload);
        return successResponse(
            res,
            201,
            'Welcome your account has been successfully created.',
            {
                token
            }
        )
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

/**
 * Authenticate User Code
 * @param {object} req
 * @param {object} res
 * @returns {object} user object
 */
exports.verifyUser = async (req, res) => {
    const {id} = req.user;
    const {code} = req.body;

    const otp = await Otp.findOne({where: {user_id: id, token: code.toString()}});
    if (otp === null) {
        return errorResponse(res, 400, 'Invalid Verification Code');
    }
    await UserRepository.updateUser({isVerified: 1}, id);
    await otp.destroy();
    return successResponse(res, 200, 'Your Account has been activated');
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.login = async (req, res) => {
    let data = req.body;
    try {
        let user = await UserRepository.authenticate(data);
        const tokenPayload = {
            id: user.id,
            phone: user.phone,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role_id: user.role_id
        };

        // TODO Remove OTP
        let otp = await Otp.findOne({where: {user_id: user.id}});

        const token = await generateToken(tokenPayload);
        
        let t = await MailService.sendMail({
            to: user.email,
            subject: 'Account Verification',
            fileName: 'verification.pug',
            data: {
                name: user.first_name,
                token: otp.token
            }
        })
        user = user.toJSON();
        return successResponse(res, 200, 'You have been logged in successfully', {
            user,
            token
        });
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.updateUser = async (req, res) => {
    let data = req.body;
    const {id} = req.user;
    
    if (req.files) {
        const {image} = req.files;
        data.image = image;
    }
    
    try {
        await UserRepository.updateUser(data, id);
        return successResponse(res, 200, 'You successfully updated user details');
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.authenticatedUser = async (req, res) => {
    const {id} = req.user;
    let user = await UserRepository.getUser(id);
    if (user) {
        user = user.toJSON();
        return successResponse(res, 200, 'success', user);
    }
    return errorResponse(res, 404, 'User object not found');
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.changePassword = async (req, res) => {
    const {id} = req.user;
    const data = req.body;

    try {
        user = await UserRepository.changePassword(data, id);
        return successResponse(res, 200, 'Password change successful');
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

exports.resendOtp = async (req, res) => {
    const {id} = req.user;

    try {
        user = await UserRepository.resendToken(id);
        return successResponse(res, 200, 'Otp sent successful');
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.forgotPassword = async (req, res) => {
    const {phone} = req.body;
    try {
        // TODO Remove data
        await UserRepository.forgotPassword(phone);
        const user = await User.findOne({where: {phone}});
        const data = await PasswordResets.findOne({where: {user_id: user.id}});
        await MailService.sendMail({
            to: user.email,
            subject: 'Password Reset',
            fileName: 'passwordReset.pug',
            data: {
                name: user.first_name,
                token: data.token
            }
        })
        return successResponse(res, 200, 'Please enter the reset token sent to you to complete password reset');
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.resetPassword = async (req, res) => {
    const {token, password} = req.body;
    try {
        await UserRepository.resetPassword(token, password);
        return successResponse(res, 200, 'Password reset successful');
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}
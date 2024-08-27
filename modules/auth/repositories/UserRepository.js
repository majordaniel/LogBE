const models = require('../../../db/models');
const { User, Otp, PasswordResets, Role, Company, Wallet } = models;
const { comparePassword, hashPassword, generateOtp, checkDuplicateUser, getPagination, formatPagination } = require('../../../utils/helpers');
const cloudinary = require('../../../services/CloudinaryService');
const MailService = require('../../../services/MailService');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

/**
 *
 * @param {object} data
 * @returns {object} User
 */
exports.createUser = async (data, userRole = 'user') => {
    if (await checkDuplicateUser(data.phone)) {
        throw new Error('Phone has been used, try login');
    }
    const role = await Role.findOne({ where: { name: userRole } });
    data.role_id = role.id

    if (data.referal_code) {
        const ref = await User.findOne({
            where: {referal: data.referal_code}
        });
        
        if (ref) {
            data.referred_by = ref;
        }
    }

    const otp = generateOtp()
    const user = await User.create({ ...data });
    await Otp.create({ user_id: user.id, token: otp })
    await Wallet.create({user_id: user.id});
    if (user.email) {
        await MailService.sendMail({
            to: user.email,
            subject: 'Account Verification',
            fileName: 'verification.pug',
            data: {
                name: user.first_name,
                token: otp
            }
        })
    }
    
    return user;
}

/**
 *
 * @param {object} data
 * @param {integer} id
 * @returns {object} User
 */
exports.updateUser = async (data, id) => {
    if (data.password) {
        data.password = await hashPassword(data.password)
    }
    if (data.image) {
        let upload = await cloudinary.uploader
            .upload(data.image[0].path)
            .then(result => {
                return result;
            })
            .catch(err => {
                throw new Error(err.message);
            });
        data.imageUrl = upload.secure_url
    }
    return await User.update({ ...data }, { where: { id } });
}

/**
 * Authenticate User
 * @param {*} data
 * @returns
 */
exports.authenticate = async (data) => {
    let searchData = {};
    if (data.phone) {
        searchData = { ...searchData, phone: data.phone }
    } else {
        searchData = { ...searchData, email: data.email }
    }
    const user = await User.findOne({
        where: searchData,
    });

    if (user === null) {
        throw new Error('This User does not exist please try registering');
    }

    const validPassword = await comparePassword(user.password, data.password);
    if (!validPassword) {
        throw new Error('Incorrect Password');
    }
    return user
}

/**
 * return User Object
 * @param {*} id
 * @returns
 */
exports.getUser = async (id) => {
    return await User.findOne({
        where: { id },
        include: [
            {
                model: Role,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            {
                model: Company,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt']
                }
            }]
    });
}

/**
 *
 * @param {*} data
 * @param {*} id
 * @returns
 */
exports.changePassword = async (data, id) => {
    let user = await this.getUser(id);
    const validPassword = await comparePassword(user.password, data.password);
    if (!validPassword) {
        throw new Error('Incorrect Old Password');
    }
    return await this.updateUser({ password: data.new_password }, id);
}

/**
 *
 * @param {string} phone
 * @returns
 */
exports.getUserByPhone = async (phone) => {
    return await User.findOne({
        where: { phone },
    });
}

/**
 *
 * @param {string} phone
 * @returns
 * @throws {Error} User not found
 */
exports.forgotPassword = async (phone) => {
    const user = await this.getUserByPhone(phone);
    if (user === null) {
        throw new Error('User not found');
    }
    const token = generateOtp();
    return await PasswordResets.create({ user_id: user.id, token: token })
}

/**
 *
 * @param {string} token
 * @param {string} password
 * @returns
 * @throws {Error} Password reset token does not exist
 */
exports.resetPassword = async (token, password) => {
    const pass = await PasswordResets.findOne({
        where: { token }
    })
    if (pass === null) {
        throw new Error('Password reset token does not exist');
    }
    await this.updateUser({ password: password }, pass.user_id);
    await pass.destroy();
    return true;
}

exports.listUsers = async (data = {}, page=1, perPage=15) => {
    let searchData = {};
    if (data.role) {
        const role = await Role.findOne({ where: { name: data.role } });
        searchData = { ...searchData, 'role_id': role.id };
    }

    if (data.roleId) {
        searchData = {...searchData, 'role_id': roleId};
    }
    
    if (data.company_id) {
        searchData = { ...searchData, 'company_id': data.company_id }
    }

    if (data.name) {
        searchData ={...searchData, 'first_name': {[Op.iLike]: `%${data.name}%`} }
    }

    let { limit, offset } = getPagination(page, perPage)

    const query = {
        where: searchData,
        include: [{
            model: Role,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }]
    };
    let users = await User.findAndCountAll({
        ...query,
        limit,
        offset,
    });

    return {users: users.rows,...formatPagination(users, perPage, page)};
}

/**
 *
 * @param {*} id
 * @returns
 */
exports.deleteUser = async (id) => {
    const user = await User.findOne({ where: { id: id } });
    if (user === null) {
        throw new Error('User does not exist');
    }
    await user.destroy();
    return true;
}

exports.resendToken = async (id) => {
    const user = await User.findOne({where: {id}});

    if (user.isVerified) {
        throw new Error('User already verified');
    }

    const prevOtp = await Otp.findOne({where: { user_id: id}});
    if (prevOtp !== null) {
        await prevOtp.destroy();
    }
    const otp = generateOtp();
    await Otp.create({ user_id: id, token: otp })
    
    if (user.email) {
        await MailService.sendMail({
            to: user.email,
            subject: 'Account Verification',
            fileName: 'verification.pug',
            data: {
                name: user.first_name,
                token: otp
            }
        })
    }
}
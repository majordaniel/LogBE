const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op }  = require('sequelize');

const models = require('../db/models');

const { User } = models;

const SECRET_KEY = process.env.SECRET_KEY;

/**
 *
 *
 * @export
 * @param {*} payload
 * @param {string} [expiresIn='30days']
 * @returns {string} token
 */
exports.generateToken = async (payload, expiresIn = '30d') =>
  jwt.sign(payload, SECRET_KEY, { expiresIn });

/**
 *
 * @param {object} res response object
 * @param {number} statusCode
 * @param {string} message
 * @param {*} data
 * @returns {object} res
 */
exports.successResponse = (res, statusCode, message, data = {}) =>
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });

/**
 *
 * @param {object} res response object
 * @param {number} statusCode
 * @param {string} message
 * @param {*} errors
 * @returns {object} res
 */
exports.errorResponse = (res, statusCode, message, errors = {}) =>
  res.status(statusCode).json({
    status: 'error',
    message,
    errors,
  });

/**
 *
 * @param {object} res response object
 * @param {number} statusCode
 * @returns {object} res
 */
exports.serverError = (res, statusCode = 500) =>
  res.status(statusCode).json({
    status: 'error',
    message:
      'Your request could not be processed at this time. Kindly try again later.',
  });

/**
 * Check User duplication
 *
 * @param {String} phone
 * @param {String} email
 * @returns {Boolean} true if record exists
 * @returns {Boolean} false if record does not exist
 */
exports.checkDuplicateUser = async (phone, email) => {
    let search = [];
    if(phone) search.push({phone: phone})
    if(email) search.push({email: email})
  return User.findOne({
    where: {
      [Op.or]: search,
    },
  });
};

/**
 *
 *
 * @export
 * @param {string} password
 * @param {number} [salt=10]
 * @returns {string} hash
 */
exports.hashPassword = async (password, salt = 10) => {
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

/**
 * @description Compare Password
 *
 * @export
 * @param {string} hashedPassword
 * @param {string} password
 * @returns {boolean} true/false
 */
exports.comparePassword = async (hashedPassword, password) =>
  bcrypt.compareSync(password, hashedPassword);

/**
 *
 *
 * @param {object} obj
 * @param {array} keys
 * @returns {object} filteredObject
 */
exports.pick = (obj, keys) => {
  return keys
    .map(key => (key in obj ? { [key]: obj[key] } : {}))
    .reduce(
      (finalObject, arrayOfObjects) =>
        Object.assign(finalObject, arrayOfObjects),
      {},
    );
}

/**
 *
 *
 * @param {object} obj
 * @param {array} keys
 * @returns {object} filteredObject
 */
exports.excludeProperty = (obj, keys) => {
  const filteredKeys = Object.keys(obj).filter(key => !keys.includes(key));
  return this.pick(obj, filteredKeys);
}

/**
 *
 * @param {string} token
 * @returns {object/null} decoded tokens
 */
exports.verifyToken = async token => {
  return await jwt.verify(token, SECRET_KEY, (err, data) => {
    if (err) {
      return null;
    }
    return data;
  });
};

exports.generateOtp = () => {
    return ('' + Math.random()).substring(2, 6);
}

exports.getPagination = (page=1, size=15) => {
  const limit = size ? +size : 15;
  const offset = page ? (page * limit) - limit : 0;

  return { limit, offset };
};

/**
 * 
 * @param {array} data 
 * @param {int} perPage 
 * @param {int} current 
 * @returns 
 */
exports.formatPagination = (data, perPage, current) => {
  let nextPage = data.count/(perPage * current) > 1 ? current + 1 : null;
  return {
    total : data.count,
    perPage: perPage,
    current: current,
    nextPage: nextPage,
    prevPage: (current - 1) > 1 ? current -1 : 1,
    lastPage: Math.floor(data.count/perPage) + 1,
  }
}
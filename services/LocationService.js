const { object } = require('joi');
const RedisService = require('./RedisService');

exports.storeLocation = async function(user_id, data) {
    try {
        RedisService.hmset('location_'+user_id, data);        
    } catch (error) {
        return;
    }
}

exports.getLocation = async function(user_id) {
    return new Promise((resolve, reject) => {
        RedisService.hgetall('location_'+user_id, (err, object) => {
        if (err) {
            reject(err);
            } else {
            resolve(object);
            }
        });
    });
}
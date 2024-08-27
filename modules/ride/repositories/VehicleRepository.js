const models = require('../../../db/models');
const { Vehicle } = models;

/**
 * 
 * @returns 
 */
exports.getVehicles = async function() {
    return await Vehicle.findAll({});
}

/**
 * 
 * @param {*} data 
 * @returns 
 */
exports.createVehicle = async function (data) {
    let upload = await cloudinary.uploader
        .upload(data.image[0].path)
        .then(result => {
            return result;
        })
        .catch(err => {
            throw new Error(err.message);
        });
    data.imageUrl = upload.secure_url
    return await Vehicle.create({...data});
}

/**
 * 
 * @param {*} data 
 * @param {*} id 
 * @returns 
 */
exports.updateVehicle = async function (data, id) {
    if(data.image) {
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
    return await Vehicle.update({...data}, { where: { id } });
}

exports.deleteVehicle = async function (id) {
    const vehicle = await Vehicle.findOne({ where: { id } });
    if (vehicle === null) {
        throw new Error('Vehicle does not exist');
    }
    await vehicle.destroy();
    return true;
}
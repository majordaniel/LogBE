const VehicleRepository = require('../repositories/VehicleRepository');
const { successResponse,
    generateToken,
    errorResponse
} = require('../../../utils/helpers');

exports.listVehicles = async(req, res)  => {
    let carriers = await VehicleRepository.getVehicles();
    return successResponse(res, 200, 'carriers fetched', carriers);
}

exports.createVehicle = async (req, res) => {
    let data = req.body;
    try {
        const carrier = await VehicleRepository.createVehicle(data);
        return successResponse(res, 201, 'carrier added', carrier);
    } catch (error) {
        return errorResponse(res, 400, error.message, error);
    }
}


exports.editVehicle = async function (req, res) {
    const {id} = req.params;
    try {
        const location = await VehicleRepository.updateVehicle(req.body, location_id);
        return successResponse(res, 200, 'success');
    } catch (error) {
        return errorResponse(res, 400, error.message, error);
    }
}
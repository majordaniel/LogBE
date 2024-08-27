const LocationRepository = require('../repositories/LocationRepository');
const { successResponse,
    generateToken,
    errorResponse
} = require('../../../utils/helpers');

exports.getPriceEstimate = async function (req, res) {
    let data = req.body;
    try {
        const partners = await LocationRepository.getLogisticPartners(data);
        return successResponse(res, 200, 'logistic partners', partners);
    } catch (error) {
        return errorResponse(res, 400, error.message, error);
    }
}

exports.addLocation = async function (req, res) {
    let data = req.body;
    const {id} = req.user;
    try {
        const location = await LocationRepository.addLocation(data, id);
        return successResponse(res, 201, 'successfully added location', location);
    } catch (error) {
        return errorResponse(res, 400, error.message, error);
    }
}

exports.getLocations = async function (req, res) {
    const {id} = req.user;

    try {
        const locations = await LocationRepository.getLocations(id);
        return successResponse(res, 200, 'success', locations);
    } catch (error) {
        return errorResponse(res, 400, error.message, error);
    }
}

exports.editLocation = async function (req, res) {
    const {id} = req.user;
    const location_id = req.params.id;
    try {
        const location = await LocationRepository.updateLocation(req.body, location_id, id);
        return successResponse(res, 200, 'success');
    } catch (error) {
        return errorResponse(res, 400, error.message, error);
    }
}
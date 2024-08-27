const TripRepository = require('../../ride/repositories/TripRepository');
const { successResponse,
    generateToken,
    errorResponse
} = require('../../../utils/helpers');


exports.getAllTrip = async(req, res) => {
    try {
        const {perPage, page, status} = req.query;
        let data = {};
        if(status) {
            data = {...data, 'status': status}
        }
        const trips = await TripRepository.getTrips(data, page, perPage);
        return successResponse(res, 200, 'Trips', trips);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

exports.getCompanyTrips = async(req, res) => {
    const {id} = req.params;
    const {perPage, page, status} = req.query;
    
    try {
        let data = {'company_id':id};
        if(status) {
            data = {...data, 'status': status}
        }
        const trips = await TripRepository.getTrips(data, page, perPage);
        return successResponse(res, 200, 'company trips', trips);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}


exports.getRiderTrips = async(req, res) => {
    const {id} = req.params;
    const {perPage, page, status} = req.query;
    try {
        let data = {'rider_id':id};
        if(status) {
            data = {...data, 'status': status}
        }
        const trips = await TripRepository.getTrips(data, page, perPage);
        return successResponse(res, 200, 'trips', trips);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

exports.getTripStats = async(req, res) => {
    const trips = await TripRepository.getCountByStatus();
    return successResponse(res, 200, 'trip stats', trips);
}

exports.getRiderTripStats = async(req, res) => {
    let {id} = req.params;
    const trips = await TripRepository.getCountByStatus({rider_id:id});
    return successResponse(res, 200, 'trip stats', trips);
}


exports.getCompanyTripStats = async(req, res) => {
    let {id} = req.params;
    const trips = await TripRepository.getCountByStatus({company_id:id});
    return successResponse(res, 200, 'trip stats', trips);
}
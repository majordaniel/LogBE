const RiderReviewRepository = require('../repositories/RiderReviewRepository');
const CompanyReviewRepository = require('../repositories/CompanyReviewRepository');
const { successResponse,
    generateToken,
    errorResponse
} = require('../../../utils/helpers');

exports.reviewRider = async (req, res) => {
    let {id} = req.user;
    let data = req.body;

    try {
        const review = await RiderReviewRepository.addReview(data, id);
        return successResponse(res, 201, "review sent", review);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}


exports.reviewCompany = async (req, res) => {
    let {id} = req.user;
    let data = req.body;

    try {
        const review = await CompanyReviewRepository.addReview(data, id);
        return successResponse(res, 201, "review sent", review);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}
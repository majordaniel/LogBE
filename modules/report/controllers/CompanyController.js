const UserRepository = require('../../auth/repositories/UserRepository');
const CompanyRepository = require('../../auth/repositories/CompanyRepository');
const { successResponse,
    generateToken,
    errorResponse
} = require('../../../utils/helpers');



exports.listCompanies = async(req, res) => {
    try {
        let {page, limit} = req.query;
        let data = req.query;
        companies = await CompanyRepository.listCompanies(page, limit, data);
        return successResponse(res, 200, 'list of companies',companies);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

exports.getCompanyDetails = async(req, res) => {
    try {
        let {id} = req.params;
        companies = await CompanyRepository.getCompanyDetail(id);
        return successResponse(res, 200, 'details',companies);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}


exports.getCompanyReviews = async(req, res) => {
    try {
        let {id} = req.params;
        let {page, limit} = req.query;
        companies = await CompanyRepository.getCompanyReviews(id, page, limit);
        return successResponse(res, 200, 'details',companies);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

exports.listCompanyRiders = async(req, res) => {
    try {
        let {page, limit} = req.query;
        const company_id = req.params.id;
        const riders = await CompanyRepository.getRiders(company_id);
        return successResponse(res, 200, 'company riders', {
            riders,
        });
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}
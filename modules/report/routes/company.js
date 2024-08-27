const { Router } = require('express');
const adminRouter = Router();

const CompanyController = require('../controllers/CompanyController');
const middleware = require('../../../middlewares/authorised-user');

//Protected Routes
adminRouter.use('/', middleware.checkAuthorizedUser);

adminRouter.get('/list', CompanyController.listCompanies);
adminRouter.get('/:id/riders', middleware.adminOnly, CompanyController.listCompanyRiders);
adminRouter.get('/:id/details', CompanyController.getCompanyDetails);
adminRouter.get('/:id/reviews', CompanyController.getCompanyReviews);




module.exports = adminRouter;
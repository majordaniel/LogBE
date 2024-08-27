const models = require('../../../db/models');
const { User, Company, CompanyReview } = models;
const {getPagination, formatPagination} = require('../../../utils/helpers');

exports.addReview = async (data, user_id) => {
    data.user_id = user_id;
    let review = await CompanyReview.create({...data});
    this.calculateAverage(data.company_id);
    return review;
}

exports.getReviews = async (company_id, page=1, perPage=15) => {
    let {limit, offset} = getPagination(page, perPage);

    let reviews =  await CompanyReview.findAndCountAll({
        where: {company_id},
        include: [
            { model: User, as: 'user', attributes: ['firstName', 'lastName','email', 'phone']},
            { model: Company},
        ],
        limit,
        offset,
    });
    return {reviews: reviews.rows,...formatPagination(reviews, perPage, page)};
}

exports.calculateAverage = async (company_id) => {
    let review = await CompanyReview.findAll({
        where: {company_id},
        attributes: ['company_id', [models.sequelize.fn('AVG', models.sequelize.col('rating')), 'ratingAvg']],
        group: ['company_id'],
        order: [[models.sequelize.fn('AVG', models.sequelize.col('rating')), 'DESC']]
    })
    let avg = Object.values(review)[0].dataValues.ratingAvg;
    return await Company.update({rating: avg }, { where: { id: company_id } });
}
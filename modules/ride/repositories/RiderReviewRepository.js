const models = require('../../../db/models');
const { User, RiderReview } = models;
const {getPagination, formatPagination} = require('../../../utils/helpers');

exports.addReview = async (data, user_id) => {
    data.user_id = user_id;
    const review = await RiderReview.create({...data});
    this.calculateAverage(data.rider_id);
    return review;
}

exports.getReviews = async (rider_id, page=1, perPage=15) => {
    let {limit, offset} = getPagination(page, perPage);

    let reviews =  await RiderReview.findAndCountAll({
        where: {rider_id},
        include: [
            { model: User, as: 'user', attributes: ['firstName', 'lastName','email', 'phone']},
            { model: User, as: 'rider', attributes: ['firstName', 'lastName','email', 'phone']},
        ],
        limit,
        offset,
    });
    return {data: reviews.rows,...formatPagination(reviews, perPage, page)};
}

exports.calculateAverage = async (rider_id) => {
    let review = await RiderReview.findAll({
        where: {rider_id},
        attributes: ['rider_id', [models.sequelize.fn('AVG', models.sequelize.col('rating')), 'ratingAvg']],
        group: ['rider_id'],
        order: [[models.sequelize.fn('AVG', models.sequelize.col('rating')), 'DESC']]
    })
    let avg = Object.values(review)[0].dataValues.ratingAvg;
    return await User.update({rating: avg }, { where: { id: rider_id } });
}
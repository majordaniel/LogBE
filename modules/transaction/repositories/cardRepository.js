const models = require('../../../db/models');
const { User, Card } = models;
const {getPagination} = require('../../../utils/helpers');

exports.addCard = async (data) => {
    return await Card.create(data);
}

exports.getUserCards = async (user_id) => {
    return await Card.findAll({
        where: {user_id}
    });
}

exports.getChargeableCard = async (user_id) => {
    let card = await Card.findOne({
        where: {
            user_id,
            default: true
        }
    });
    if (!card) {
        card = await Card.findOne({
            where: {
                user_id
            }
        });
    }
    return card;
}
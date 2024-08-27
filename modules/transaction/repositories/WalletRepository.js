const models = require('../../../db/models');
const { User, Wallet } = models;
const {getPagination, formatPagination} = require('../../../utils/helpers');

/**
 * 
 * @param {string} user_id 
 * @param {int} amount 
 * @returns 
 */
exports.walletTopUp = async (user_id, amount) => {
    const wallet = await Wallet.findOne({where: {user_id}});
    let credit = wallet.balance + (amount * 100);
    return await Wallet.update({ balance: credit}, { where: { id: wallet.id } });
}


/**
 * 
 * @param {*} user_id 
 * @returns 
 */
exports.rewardReferer = async (user_id) => {
    const user = await User.findOne({
        where: {id: user_id}
    });
    if (!user) {
        throw new Error('User not found');
    }

    let amountToReward = 100;
    return await this.walletTopUp(user.referred_by, amountToReward);
}

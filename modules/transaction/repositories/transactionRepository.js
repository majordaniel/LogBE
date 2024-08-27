const models = require('../../../db/models');
const { User, Transaction } = models;
const {getPagination} = require('../../../utils/helpers');
const { toUpper } = require('lodash');


const TransactionStatus = ['INITIALISED', 'SUCCESS', 'FAILED'];


exports.logTransaction = async (user_id, amount, description, reference, trip_id=null) => {
    let data = {
        user_id,
        amount,
        description,
        reference,
        trip_id
    }
    return await Transaction.create(data)
}

exports.getTransactionByReference = async(reference) => {
    let transaction  = await Transaction.findOne({
        where: {reference}
    });

    if (transaction === null) {
        throw new Error('Transaction not found');
    }
    return transaction;
}

exports.updateTransaction = async(id, data) => {
    if(data.status) {
        const obj = {...TransactionStatus};
        data.status = Object.keys(obj).find(key => obj[key] === toUpper(data.status));
    }
    return await Transaction.update({ ...data }, { where: { id } });
}

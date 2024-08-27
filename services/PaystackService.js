const secret_key =  process.env.PAYSTACK_SECRET_KEY;
var paystack = require("paystack-api")(secret_key);
const helper = new paystack.FeeHelper();

exports.initiateTransaction = async function(amount, email, callback_url=null) {
    callback_url += "/api/v1/transaction/verify/card";
    return paystack.transaction.initialize({
        amount: amount,
        email: email,
        channels: ['card'],
        callback_url: callback_url
    });
}

exports.verifyTransaction = async function(reference) {
    return paystack.transaction.verify({
        reference
    });
}

exports.chargeCustomer = async function(amount, authorization_code, email) {
    return paystack.transaction.chargeAuth({
        amount,
        authorization_code,
        email
    });
}
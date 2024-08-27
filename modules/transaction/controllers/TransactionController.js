const paymentService = require('../../../services/PaystackService');
const { successResponse,
    generateToken,
    errorResponse
} = require('../../../utils/helpers');
const transactionRepository = require('../repositories/transactionRepository');
const cardRepository = require('../repositories/cardRepository');


exports.addCard = async (req, res) => {
    try {
        const {id, email} = req.user;
        const amount = 5000;
        let user_email = email ? email: 'admin.izigo.ng';
        var base_url = req.protocol + '://' + req.get('host');
        const data = await paymentService.initiateTransaction(amount, user_email, base_url);
        await transactionRepository.logTransaction(id, amount, 'Adding card', data['data']['reference']);
        return successResponse(res, 201, "transaction initialised", data['data']);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }   
}

exports.verifyCardTransaction = async(req, res) => {
    try {
        const {reference} = req.query;
        let transaction = await transactionRepository.getTransactionByReference(reference);
        let payment = await paymentService.verifyTransaction(reference);
        if(payment['status']) {
            if (payment['data']['authorization']['reusable']) {
                await cardRepository.addCard({
                    last_four: payment['data']['authorization']['last4'],
                    customer_id: payment['data']['customer']['id'],
                    authorization_code: payment['data']['authorization']['authorization_code'],
                    customer_code: payment['data']['customer']['customer_code'],
                    user_id: transaction.user_id,
                    type: payment['data']['authorization']['card_type']
                })
                await transactionRepository.updateTransaction(transaction.id, {
                    is_paid: true,
                    status: 'success',
                    response: JSON.stringify(payment['data'])
                });
                return successResponse(res, 200, "card added", payment['data']);
            }
        }
        await transactionRepository.updateTransaction(transaction.id, {
            status: 'failed'
        });
        return errorResponse(res, 400, 'Card not reusable');
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}

exports.getCards = async(req, res) => {
    const {id} = req.user;
    try {
        const cards = await cardRepository.getUserCards(id);
        return successResponse(res, 200, 'user cards', cards);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
}
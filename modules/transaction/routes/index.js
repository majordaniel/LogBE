const { Router } = require('express');

const router = Router();

const TransactionController = require('../controllers/TransactionController');
const middleware = require('../../../middlewares/authorised-user');

router.get('/verify/card', TransactionController.verifyCardTransaction);

router.use('/', middleware.checkAuthorizedUser)

router.get('/card', TransactionController.getCards);
router.post('/card/add', TransactionController.addCard);


module.exports = router;
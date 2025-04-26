const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth.middleware');
const controller = require('../controllers/farmer.wallet.controller');

router.get('/balance', auth('farmer'), controller.getBalance);
router.get('/transactions', auth('farmer'), controller.getTransactions);

module.exports = router;

const express = require('express');
const router = express.Router();
const StripeController = require('../controller/stripeController');


router.post('/create-payment-intent', StripeController.createPaymentIntent);

module.exports = router;
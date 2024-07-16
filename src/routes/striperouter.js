const express = require('express');
const router = express.Router();
const StripeController = require('../controller/stripeController');
const { ensureAuthenticated } = require("../middleware/authenticate.js");


router.post('/create-payment-intent', ensureAuthenticated, StripeController.createPaymentIntent);
router.get('/stripe/success', ensureAuthenticated, StripeController.handleSuccess);


module.exports = router;
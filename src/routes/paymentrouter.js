const express = require("express");
const router = express.Router();
const { PaymentController } = require("../controller/paymentController.js");

const paymentController = new PaymentController();

// Abonelik İşlemleri
router.get('/subscription', paymentController.createPayment.bind(paymentController));
router.post('/subscription/plan', paymentController.createPlan.bind(paymentController));
router.post('/v2/subscription/checkoutform/initialize', paymentController.createSubscription.bind(paymentController));
router.get('/subscription/:userId', paymentController.getSubscription.bind(paymentController));

module.exports = router;

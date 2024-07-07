const express = require("express");
const router = express.Router();
const { PaymentController } = require("../controller/paymentController.js");

const paymentController = new PaymentController();

router.get("/payment", PaymentController.createPayment);
router.post("/api/plans", paymentController.createPlan.bind(paymentController));
router.post("/api/subscribe", paymentController.createSubscription.bind(paymentController));
router.get("/api/subscriptions/:userId", paymentController.getSubscription.bind(paymentController));


module.exports = router;

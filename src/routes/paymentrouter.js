const express = require("express");
const router = express.Router();
const { PaymentController } = require("../controller/paymentController.js");

const paymentController = new PaymentController();

// Checkout form oluşturma ve ödeme işlemi
router.post("/get-checkout-form", (req, res) => paymentController.getCheckoutForm(req, res));

module.exports = router;
const express = require("express");
const router = express.Router();
const { IyzicoController } = require("../controller/IyzicoController.js");
const { authMiddleware } = require("../middleware/userMiddleware.js");



// Iyzico
router.get("/panel/payment", authMiddleware, IyzicoController.createPayment);
router.post("/panel/payment", authMiddleware, IyzicoController.createIyzicoapi);
router.post("/panel/payment/stripe", authMiddleware, IyzicoController.createStripeapi);


module.exports = router;
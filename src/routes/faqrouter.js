const express = require('express');
const router = express.Router();
const { FaqController } = require("../controller/adminController.js")
const { authMiddleware } = require("../middleware/userMiddleware.js");
// Faq 
router.post('/panel/faqs', authMiddleware, FaqController.addFaqiest)
router.delete('/panel/faq/:id', authMiddleware, FaqController.deleteFaq)
router.get("/panel/faq", authMiddleware, FaqController.getFaqiest)
router.get("/panel/faq/add", authMiddleware, FaqController.getFaqeiestAdd)
router.get("/panel/faq/edit/:id", authMiddleware, FaqController.editFaq);
router.put('/panel/faq/:id', authMiddleware, FaqController.updateFaq);


module.exports = router;
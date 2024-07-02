const { SeoController } = require("../controller/seoController.js")
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/userMiddleware.js")

// Seo
router.get("/panel/seo", authMiddleware, SeoController.getSeo)
router.post("/panel/seos", authMiddleware, SeoController.postSeo)
router.get("/panel/seo/add", authMiddleware, SeoController.getSeoAdd)
router.delete("/panel/seo/:id", authMiddleware, SeoController.deleteSeo)
router.get("/panel/seo/edit/:id", authMiddleware, SeoController.editSeo);
router.put('/panel/seo/:id', authMiddleware, SeoController.updateSeo);


module.exports = router;
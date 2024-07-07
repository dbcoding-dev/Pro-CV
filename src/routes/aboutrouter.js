const { AboutController } = require("../controller/aboutController.js")
const { authMiddleware } = require("../middleware/userMiddleware.js");
const express = require("express");
const router = express.Router();

// About
router.get('/panel/about', authMiddleware, AboutController.getAbout)
router.get('/panel/about/add', authMiddleware, AboutController.getAboutAdd)
router.post('/panel/abouties', authMiddleware, AboutController.addAbout)
router.delete('/panel/about/:id', authMiddleware, AboutController.deleteAbout)
router.get("/panel/about/edit/:id", authMiddleware, AboutController.editAbout);
router.put('/panel/about/:id', authMiddleware, AboutController.updateAbout);


module.exports = router;
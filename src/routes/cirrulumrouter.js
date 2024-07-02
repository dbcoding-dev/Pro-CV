const {
    CirriculumController
} = require("../controller/adminController.js")
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/userMiddleware.js")


// Cirrulum
router.get("/panel/curriculum", authMiddleware, CirriculumController.getCirrulum)
router.get("/panel/curriculum/add", authMiddleware, CirriculumController.getCirrulumAdd)
router.post("/panel/curriculums", authMiddleware, CirriculumController.addCirrulumiest)
router.delete("/panel/curriculums/:id", authMiddleware, CirriculumController.deleteCirrulum)
router.get("/panel/curriculum/edit/:id", authMiddleware, CirriculumController.editCirrulum);
router.put('/panel/curriculum/:id', authMiddleware, CirriculumController.updateCirrulum);


module.exports = router;
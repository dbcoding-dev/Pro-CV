const { ResumeController } = require("../controller/adminController.js")
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/userMiddleware.js");
// Resume 
router.get('/panel/resume', authMiddleware, ResumeController.getResume)
router.get('/panel/resume/add', authMiddleware, ResumeController.getResumeAdd)
router.post('/panel/resumes', authMiddleware, ResumeController.addResume)
router.delete('/panel/resume/:id', authMiddleware, ResumeController.deleteResume)
router.get("/panel/resume/edit/:id", authMiddleware, ResumeController.editResume);
router.put('/panel/resume/:id', authMiddleware, ResumeController.updateResume);


module.exports = router;
const express = require('express');
const router = express.Router();
const UsersProfil = require('../controller/cvController');
const { ensureAuthenticated } = require("../middleware/authenticate.js");
const { authMiddleware } = require("../middleware/userMiddleware.js");


// Get user profil
router.get('/panel/resumelist', authMiddleware, UsersProfil.getCv);
router.delete('/panel/resumelist/:userId', authMiddleware, UsersProfil.deleteUserAndAllData);
router.put('/panel/resumelist/:userId', authMiddleware, UsersProfil.updateUser);
router.get('/panel/resumelist/edit/:userId', authMiddleware, UsersProfil.editUser);
router.get('/resume/:id', ensureAuthenticated, UsersProfil.getProfil);
router.get('/create-cv/:id', ensureAuthenticated, UsersProfil.editProfile);
router.put('/create-cv/:id', ensureAuthenticated, UsersProfil.updateProfil);
router.delete('/delete-cv/:id', ensureAuthenticated, UsersProfil.deleteProfil);


module.exports = router;

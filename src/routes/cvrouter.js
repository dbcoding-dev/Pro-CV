const express = require('express');
const router = express.Router();
const UsersProfil = require('../controller/cvController');
const { ensureAuthenticated } = require("../middleware/authenticate.js");


// Get user profil
router.get('/resume/:id', ensureAuthenticated, UsersProfil.getProfil);
router.get('/create-cv/:id', ensureAuthenticated, UsersProfil.editProfile);
router.put('/create-cv/:id', ensureAuthenticated, UsersProfil.updateProfil);


module.exports = router;

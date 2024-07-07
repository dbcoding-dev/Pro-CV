const express = require("express");
const router = express.Router();
const { UserController } = require("../../controller/userController.js");
const { SiteController } = require("../../controller/websiteController.js");
const rateLimiter = require("../../middleware/ratemiddleware.js");
const { preventAuthenticatedAccess, ensureAuthenticated } = require("../../middleware/authenticate.js");


// User
router.get('/register', preventAuthenticatedAccess, UserController.GetRegister);
router.post('/register', preventAuthenticatedAccess, rateLimiter, UserController.RegisterUser);
router.post('/login', preventAuthenticatedAccess, rateLimiter, UserController.LoginUser);
router.get('/login', preventAuthenticatedAccess, SiteController.getLogin)
router.get('/logout', ensureAuthenticated, UserController.LogoutUser);
router.get('/forgot', preventAuthenticatedAccess, UserController.GetForgotPassword);
router.post('/auth/forgot', preventAuthenticatedAccess, UserController.requestPasswordReset);
router.post('/auth/delete/:token', preventAuthenticatedAccess, UserController.ConfirmDeleteAccount);
router.post('/request-delete-account', ensureAuthenticated, UserController.RequestDeleteAccount); // ensureAuthenticated eklendi
router.post('/confirm-delete-account', ensureAuthenticated, UserController.ConfirmDeleteAccount);
router.get('/profile', ensureAuthenticated, UserController.Getprofile);
router.post('/profile/update', ensureAuthenticated, UserController.UpdateProfile);
router.post('/profile/delete', ensureAuthenticated, UserController.RequestDeleteAccount); // RequestDeleteAccount eklendi
router.get('/register-success', preventAuthenticatedAccess, UserController.GetRegisterSuccess);

module.exports = router;

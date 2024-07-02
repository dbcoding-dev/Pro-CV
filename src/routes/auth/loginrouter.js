const express = require("express");
const router = express.Router();
const { UserController } = require("../../controller/UserController.js");
const rateLimiter = require("../../middleware/ratemiddleware.js"); // Doğru import
const { preventAuthenticatedAccess, ensureAuthenticated } = require("../../middleware/authenticate.js");

const {
    SiteController
} = require("../../controller/adminController.js")
// User
router.get('/register', preventAuthenticatedAccess, UserController.GetRegister);
router.post('/register', preventAuthenticatedAccess, rateLimiter, UserController.RegisterUser);
router.post('/login', preventAuthenticatedAccess, rateLimiter, UserController.LoginUser);
router.get('/login', preventAuthenticatedAccess, SiteController.getLogin)
router.get('/logout', ensureAuthenticated, UserController.LogoutUser);
router.get('/forgot', preventAuthenticatedAccess, UserController.GetForgotPassword);
router.post('/auth/forgot', preventAuthenticatedAccess, UserController.requestPasswordReset);
router.get('/auth/reset/:token', preventAuthenticatedAccess, UserController.resetPassword);
router.post('/auth/reset/:token', preventAuthenticatedAccess, UserController.updatePassword);
router.get('/profile', ensureAuthenticated, UserController.Getprofile);
router.post('/profile/update', ensureAuthenticated, UserController.UpdateProfile);
router.post('/profile/delete', ensureAuthenticated, UserController.DeleteAccount);
router.get('/register-success', preventAuthenticatedAccess, UserController.GetRegisterSuccess);



module.exports = router;

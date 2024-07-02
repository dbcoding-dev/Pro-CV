const express = require("express");
const router = express.Router();
const { loginAuthMiddleware, authMiddleware } = require("../../middleware/userMiddleware.js");
const { AuthController } = require("../../controller/adminController.js")
//Login
router.get("/panel/login", loginAuthMiddleware, AuthController.getLogin)
router.post('/admin/register', AuthController.RegisterUser);
router.post('/panel/logout', authMiddleware, AuthController.LogoutUser)
router.post('/admin/login', loginAuthMiddleware, AuthController.LoginUser)


module.exports = router;
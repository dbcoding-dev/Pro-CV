const express = require("express");
const router = express.Router();
const { loginAuthMiddleware, authMiddleware } = require("../../middleware/userMiddleware.js");
const { AuthController } = require("../../controller/adminController.js")



router.get('/panel/users/add', authMiddleware, AuthController.getRegisterUser)
router.post('/panel/users/add',  AuthController.RegisterUser);
router.get("/panel/login", loginAuthMiddleware, AuthController.getLogin)
router.post('/admin/login', loginAuthMiddleware, AuthController.LoginUser)
router.post('/panel/logout', authMiddleware, AuthController.LogoutUser)
router.get('/panel/users', authMiddleware, AuthController.getPanelUsers)
router.delete('/panel/user/:id', authMiddleware, AuthController.deleteUser)
router.get('/panel/users/edit/:id', authMiddleware, AuthController.getUpdate)
router.put('/panel/user/:id', authMiddleware, AuthController.updateUser)

module.exports = router;
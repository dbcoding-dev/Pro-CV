const {
    CookieController,
} = require("../controller/cookieController.js")
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/userMiddleware.js");

// Cookie 
router.get('/panel/cookie', authMiddleware, CookieController.getCookies)
router.get("/panel/cookie/add", authMiddleware, CookieController.addCook)
router.post('/panel/cookies', authMiddleware, CookieController.addCookiest)
router.delete('/panel/cookies/:id', authMiddleware, CookieController.deleteCookies)
router.get("/panel/cookie/edit/:id", authMiddleware, CookieController.editCookies);
router.put('/panel/cookie/:id', authMiddleware, CookieController.updateCookies);


module.exports = router;
const express = require("express");
const router = express.Router();
const { Blogs } = require("../controller/blogController.js")
const {
    AdminController,
} = require("../controller/adminController.js")
const { authMiddleware } = require("../middleware/userMiddleware.js");

// Blog
router.get("/panel", authMiddleware, AdminController.getPanel)
router.get("/panel/blogs", authMiddleware, AdminController.getBlog)
router.get("/panel/blog/add", authMiddleware, AdminController.getAdminBlogEkle);
router.post('/panel/blog', authMiddleware, Blogs.Blogpost);
router.get('/panel/blog', authMiddleware, Blogs.Blogget);
router.delete('/panel/blog/:id', authMiddleware, Blogs.BlogDelete);
router.get("/panel/blog/edit/:id", authMiddleware, Blogs.BlogEditPage);
router.put('/panel/blog/:id', authMiddleware, Blogs.BlogUpdate);

module.exports = router;


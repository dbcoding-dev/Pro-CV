const express = require("express");
const router = express.Router();
const { CommentsController } = require("../controller/commentController.js")
const { authMiddleware } = require("../middleware/userMiddleware.js")



// Comments 
router.get("/panel/comment", authMiddleware, CommentsController.getComments)
router.get("/panel/comment/add", authMiddleware, CommentsController.addComments)
router.post("/panel/comments", authMiddleware, CommentsController.postComments)
router.delete('/panel/comments/:id', authMiddleware, CommentsController.deleteComments)
router.get("/panel/comments/edit/:id", authMiddleware, CommentsController.EditComments);
router.put('/panel/comments/:id', authMiddleware, CommentsController.updateComments);


module.exports = router;
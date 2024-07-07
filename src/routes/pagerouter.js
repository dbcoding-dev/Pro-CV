const express = require('express');
const { PageController } = require('../controller/pageController');
const { authMiddleware } = require("../middleware/userMiddleware.js");

const router = express.Router();

router.use(PageController.logEntry);
router.use(PageController.logExit);
router.use(PageController.checkBlockedIp);
router.post('/panel/block-ip', authMiddleware, PageController.blockIp);
router.post('/panel/unblock-ip', authMiddleware, PageController.unblockIp);
router.get('/panel/blocks', authMiddleware, PageController.getBlockedIps);
router.delete('/panel/blocks/:id', authMiddleware, PageController.deleteBlockedIp);


module.exports = router;
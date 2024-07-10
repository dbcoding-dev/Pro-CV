const express = require('express');
const router = express.Router();

const PosController = require('../controller/posController');
const { authMiddleware } = require("../middleware/userMiddleware.js");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/pos')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });
router.post('/panel/pos', authMiddleware, PosController.createPos);
router.get('/panel/pos/add', authMiddleware, PosController.addPos);
router.get('/panel/pos', authMiddleware, PosController.getPos);
router.get('/panel/pos/edit/:id', authMiddleware, PosController.getPosById);
router.put('/panel/pos/:id', authMiddleware, upload.single('img'), PosController.updatePos);
router.get('/payment-methods', PosController.getData);


module.exports = router;
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/userMiddleware.js");
const { Kvkks } = require("../controller/kvkkController.js")


// Admim Kvkk
router.get("/panel/kvkk/", authMiddleware, Kvkks.getKvkks)
router.get("/panel/kvkk/add", authMiddleware, Kvkks.addKvkks)
router.post('/panel/kvkkies', authMiddleware, Kvkks.addKvkk)
router.get("/panel/kvkk/edit/:id", authMiddleware, Kvkks.KVKKEditPage);
router.put('/panel/kvkk/:id', authMiddleware, Kvkks.updateKvkk);
router.delete('/panel/kvkk/:id', authMiddleware, Kvkks.deleteKvkk);



module.exports = router;
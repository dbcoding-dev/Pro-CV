const express = require("express");
const router = express.Router();
const { GoogleAnalyticsController } = require("../controller/googleController.js")



router.get("/api/analytics", async (req, res) => {
    const googleAnalyticsController = new GoogleAnalyticsController();
    const report = await googleAnalyticsController.getReport();
    res.json(report);
});


module.exports = router;
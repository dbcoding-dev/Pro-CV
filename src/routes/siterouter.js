const { SitesController } = require("../controller/siteController.js")
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/userMiddleware.js");


// Site Kontrol
router.get("/panel/site", authMiddleware, SitesController.Siteget)
router.get("/panel/site/add", authMiddleware, SitesController.SiteAdd)
router.post('/panel/sites', authMiddleware, SitesController.Sitepost)
router.delete('/panel/site/:id', authMiddleware, SitesController.SiteDelete)
router.get("/panel/site/edit/:id", authMiddleware, SitesController.EditSite);
router.put('/panel/site/:id', authMiddleware, SitesController.UpdateSite);


module.exports = router;
const { SiteController } = require("../controller/websiteController.js")
const { Kvkks } = require("../controller/kvkkController.js")
const express = require("express");
const router = express.Router();
const { SitemapController } = require('../controller/sitemapController.js');
const { ensureAuthenticated } = require("../middleware/authenticate.js");


// Site
router.get('/', SiteController.getIndexpage);
router.get('/', SiteController.getIndexFooter);
router.get('/create-cv', ensureAuthenticated, SiteController.getCreate)
router.get('/resume-cv', SiteController.getResume)
router.get('/blog', SiteController.getBlog)
router.get('/blog/:slug', SiteController.getSlugBlog)
router.get("/sitemap.xml", SitemapController.generateSitemap)
router.get("/contact", SiteController.getContact)
router.get("/cookie", SiteController.getCookie)
router.get("/about", SiteController.getAbout)
router.get("/price", SiteController.getPrice)
router.get("/contact-form", SiteController.getContactForm)
router.get('/resume_service', SiteController.getResumService)
router.get('/success', SiteController.getContactForm)
router.get('/sss', SiteController.getSSS)
router.get('/kvkk', Kvkks.getKvkk)

module.exports = router;
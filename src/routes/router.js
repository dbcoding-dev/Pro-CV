const express = require("express");
const router = express.Router();
const commentRouter = require("./commentrouter.js");
const seoRouter = require("./seorouter.js");
const cirriculumRouter = require("./cirrulumrouter.js");
const aboutRouter = require("./aboutrouter.js");
const siteRouter = require("./siterouter.js");
const cookieRouter = require("./cookierouter.js");
const faqRouter = require("./faqrouter.js");
const adminloginRouter = require("./auth/adminloginrouter.js");
const resumeRouter = require("./resumerouter.js");
const blogRouter = require("./blogrouter.js");
const kvkkRouter = require("./kvkkrouter.js");
const contactRouter = require("./contactrouter.js");
const LoginRouter = require("./auth/loginrouter.js");
const { SitemapController } = require('../controller/sitemapController.js');
const { authenticateUser, ensureAuthenticated } = require("../middleware/authenticate.js");

const {
    SiteController
} = require("../controller/adminController.js")
const { Kvkks } = require("../controller/kvkkController.js")

router.use(authenticateUser);

// Admin comment
router.use(commentRouter);

// Admin seo
router.use(seoRouter);

// Admin cirrulum
router.use(cirriculumRouter);

// Admin about
router.use(aboutRouter);

// Admin site
router.use(siteRouter);

// Admin cookie
router.use(cookieRouter);

// Admin faq
router.use(faqRouter);

// Admin login
router.use(adminloginRouter);

// Admin resume
router.use(resumeRouter);

// Admin blog
router.use(blogRouter);

// Admin kvkk
router.use(kvkkRouter);

// Contact
router.use(contactRouter);

// Login
router.use(LoginRouter);

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

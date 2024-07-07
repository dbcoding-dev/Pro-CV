const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Blog = require("../models/blog.model")(sequelize, DataTypes);
const Resume = require("../models/resume.model")(sequelize, DataTypes);
const Faq = require("../models/faq.model")(sequelize, DataTypes);
const Cookie = require("../models/cookie.model")(sequelize, DataTypes);
const About = require("../models/about.model")(sequelize, DataTypes);
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);



class SiteController {
    static async getIndexFooter(req, res, next) {
        try {
            const blogFooterList = await Blog.findAll();
            res.locals.blogFooterList = blogFooterList;
            next();
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async getIndexpage(req, res) {
        try {
            const Resumiest = await Resume.findAll()
            const Blogiest = await Blog.findAll();
            res.render("index", { resumeList: Resumiest, blogList: Blogiest });
        } catch (error) {

        }
    }
    static async getKvkk(req, res) {
        res.render("kvkk")
    }
    static getContactForm(req, res) {
        res.render("success")
    }
    static getCreate(req, res) {
        res.render("create");
    }
    static async getBlog(req, res) {
        try {
            const loca = await Blog.findAll();

            const Blogiest = loca.slice(0, 10);

            res.render('blog', { blogList: Blogiest });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async getResume(req, res) {
        try {
            const Resumies = await Resume.findAll();
            res.render('resume', { resumeList: Resumies });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async getContact(req, res) {
        try {
            const Faqiest = await Faq.findAll();
            res.render('contact', { faqList: Faqiest });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async getSSS(req, res) {
        try {
            const Faqiest = await Faq.findAll();
            res.render('sss', { faqList: Faqiest });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async getSlugBlog(req, res) {
        try {
            const { slug } = req.params;

            if (!slug) {
                return res.status(400).send("Slug parameter is missing");
            }

            const blogDetail = await Blog.findOne({
                where: {
                    slug: slug,
                },
            });

            if (!blogDetail) {
                return res.status(404).send("Blog not found");
            }

            const sanitizedDetail = DOMPurify.sanitize(blogDetail.detail);

            res.render('blog_detail', { blogDetail: { ...blogDetail.toJSON(), detail: sanitizedDetail } });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    };
    static async getCookie(req, res) {
        try {
            const Cookiest = await Cookie.findAll();
            const sanitizedList = Cookiest.map((cookie) => {
                return {
                    ...cookie.toJSON(),
                    desc: DOMPurify.sanitize(cookie.desc),
                };
            }
            );
            res.render('cookie', { cookieList: sanitizedList });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async getAbout(req, res) {
        try {
            const Abouties = await About.findAll();
            const firstAboutItem = Abouties[0];
            res.render('about', { aboutItem: firstAboutItem });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static getPrice(req, res) {
        res.render("price")
    }
    static getContactForm(req, res) {
        res.render("contact-form")
    }
    static getLogin(req, res) {
        res.render("login")
    }
    static getResumService(req, res) {
        res.render("resume-service")
    }
}


module.exports = {
    SiteController
}
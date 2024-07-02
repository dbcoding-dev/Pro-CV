const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Blog = require("../models/blog.model")(sequelize, DataTypes);
const User = require("../models/user.model")(sequelize, DataTypes);
const Resume = require("../models/resume.model")(sequelize, DataTypes);
const Faq = require("../models/faq.model")(sequelize, DataTypes);
const Cirriculum = require("../models/curriculum.model")(sequelize, DataTypes);
const Cookie = require("../models/cookie.model")(sequelize, DataTypes);
const About = require("../models/about.model")(sequelize, DataTypes);
const bcrypt = require("bcrypt");
const multer = require('multer');
const fs = require('fs');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resume')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const aboutStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/about')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024
    }
}).fields([
    { name: 'img', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
]);

const aboutUpload = multer({
    storage: aboutStorage,
    limits: {
        fieldSize: 1024 * 1024
    }
}).single('img');

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
    static async getKvkk (req, res) {
        res.render("kvkk")
    }
    static getContactForm(req, res){
        res.render("success")
    }
    static getCreate(req, res) {
        res.render("create");
    }
    static async getBlog(req, res) {
        try {
            const loca = await Blog.findAll();

            const Blogiest = loca.slice(0,10);
            
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
    static async getSSS (req, res) {
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
    static getLogin(req,res){
        res.render("login")
    }
    static getResumService(req,res){
        res.render("resume-service")
    }
}

class AdminController {
    static getPanel(req, res) {
        res.render("panel/index")
    }
    static getBlog(req, res) {
        res.render("panel/blog/get")
    }
    static getAdminBlogEkle(req, res) {
        res.render("panel/blog/add");
    }
}

class AuthController {
    static getLogin(req, res) {
        res.render("auth/login")
    }
    static async LoginUser(req, res) {
        try {
            const { email, password } = req.body;
            const existingUser = await User.findOne({
                where: {
                    email: email,
                },
            });

            if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
                res.locals.error = 'Invalid email or password';
                return res.status(401).render('auth/login');
            }

            req.session.user = existingUser;

            if (existingUser.role === 'admin') {
                return res.redirect('/panel');
            } else {
                return res.redirect('/panel'); // Kullanıcı yönlendirmesini buraya ekleyin
            }
        } catch (error) {
            console.error(error);
            res.status(500).render('auth/login');
        }
    }
    static async LogoutUser(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    res.redirect('/panel/login');
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    static async RegisterUser(req, res) {
        try {
            const { name, email, password } = req.body;

            const existingUser = await User.findOne({
                where: {
                    email: email,
                },
            });

            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                name: name,
                email: email,
                password: hashedPassword,
            });

            res.redirect('/panel/login');
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

class ResumeController {
    static getResume(req, res) {
        res.render("panel/resume/get")
    }
    static getResumeAdd(req, res) {
        res.render("panel/resume/add")
    }
    static async addResume(req, res) {
        const maxSize = 1024 * 1024;
        upload(req, res, (err) => {
            if (err) {
                req.flash('error', 'Dosya yüklenirken bir hata oluştu: ' + err.message);
                return res.redirect('/panel/resume');
            }

            if (req.files['img'] && req.files['img'][0].size > maxSize) {
                req.flash('error', 'Resim dosya boyutu 1 MB\'dan fazla olamaz.');
                return res.redirect('/panel/resume');
            }

            if (req.files['pdf'] && req.files['pdf'][0].size > maxSize) {
                req.flash('error', 'PDF dosya boyutu 1 MB\'dan fazla olamaz.');
                return res.redirect('/panel/resume');
            }

            const { order, title, desc } = req.body;
            const img = req.files['img'] ? req.files['img'][0].filename : null;
            const pdf = req.files['pdf'] ? req.files['pdf'][0].filename : null;

            Resume.create({
                order: order,
                title: title,
                desc: desc,
                img: img,
                pdf: pdf
            })
                .then(() => {
                    req.flash('success', 'Resume başarıyla eklendi.');
                    res.redirect('/panel/resume');
                })
                .catch((error) => {
                    req.flash('error', 'Bir hata oluştu: ' + error.message);
                    res.redirect('/panel/resume');
                });
        });
    }
    static async getResume(req, res) {
        try {
            const Resumies = await Resume.findAll();
            res.render('panel/resume/get', { blogList: Resumies });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async deleteResume(req, res) {
        try {
            const blogToDelete = await Resume.findByPk(req.params.id);

            if (!blogToDelete) {
                return res.status(404).json({ success: false, message: 'Blog not found' });
            }

            const imgPath = `uploads/resume/${blogToDelete.img}`;
            const pdfPath = `uploads/resume/${blogToDelete.pdf}`;

            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
            if (fs.existsSync(pdfPath)) {
                fs.unlinkSync(pdfPath);
            }

            await blogToDelete.destroy();

            res.json({ success: true, message: 'Deleted Successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    }
    static async editResume(req, res) {
        try {
            const resume = await Resume.findByPk(req.params.id);
            if (!resume) {
                return res.status(404).send('Not Found');
            }
            res.render('panel/resume/edit', { resume: resume });
        } catch (error) {
            res.status(500).send('Internal Server Error')
        }
    }
    static async updateResume(req, res) {
        try {
            upload(req, res, async (err) => {
                if (err) {
                    req.flash('error', 'Dosya yüklenirken bir hata oluştu: ' + err.message);
                    return res.redirect('/panel/comment');
                }
    
                const { order, title, desc } = req.body;
                const img = req.files['img'] ? req.files['img'][0].filename : null;
                const pdf = req.files['pdf'] ? req.files['pdf'][0].filename : null;
    
                const resume = await Resume.findByPk(req.params.id);
                if (!resume) {
                    return res.status(404).send('Resume not found');
                }
    
                if (req.files['img'] && resume.img) {
                    const imgPath = `uploads/resume/${resume.img}`;
                    if (fs.existsSync(imgPath)) {
                        fs.unlinkSync(imgPath);
                    }
                }
    
                if (req.files['pdf'] && resume.pdf) {
                    const pdfPath = `uploads/resume/${resume.pdf}`;
                    if (fs.existsSync(pdfPath)) {
                        fs.unlinkSync(pdfPath);
                    }
                }
    
                await resume.update({
                    order: order,
                    title: title,
                    desc: desc,
                    img: img || resume.img,
                    pdf: pdf || resume.pdf,
                });
    
                req.flash('success', 'Resume başarıyla güncellendi.');
                res.redirect('/panel/resume');
            });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Bir hata oluştu: ' + error.message);
            res.redirect('/panel/resume');
        }
    }
    
}

class FaqController {
    static async getFaqiest(req, res) {
        try {
            const Faqies = await Faq.findAll();
            res.render('panel/faq/get', { faqList: Faqies });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static getFaqeiestAdd(req, res) {
        res.render("panel/faq/add")
    }
    static async addFaqiest(req, res) {
        try {
            const { order, title, desc } = req.body;

            const newAdd = await Faq.create({
                order: order,
                title: title,
                desc: desc,
            });

            if (newAdd) {
                res.status(201).redirect('/panel/faq');
            } else {
                console.error("Faq create failed");
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } catch (error) {
            console.error("Error during Faq creation:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    static async deleteFaq(req, res) {
        try {
            const blogToDelete = await Faq.findByPk(req.params.id);

            if (!blogToDelete) {
                return res.status(404).json({ success: false, message: 'Blog not found' });
            }

            await blogToDelete.destroy();

            res.json({ success: true, message: 'Deleted Successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    }
    static async editFaq(req,res){
        try {
            const blog = await Faq.findByPk(req.params.id);
            if (!blog) {
                return res.status(404).send('Not Found');
            }
            res.render('panel/faq/edit', { blog: blog });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async updateFaq(req, res) {
        try {
                const { order, title, desc } = req.body;
                const blog = await Faq.findByPk(req.params.id);
                if (!blog) {
                    return res.status(404).send('Blog not found');
                }
                await blog.update({
                    order: order,
                    title: title,
                    desc: desc,
                });
    
                req.flash('success', 'Blog yazısı başarıyla güncellendi.');
                res.redirect('/panel/faq');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Bir hata oluştu: ' + error.message);
            res.redirect('/panel/faq');
        }
    }
}

class CirriculumController {
    static async getCirrulum(req, res) {
        try {
            const Cirrulum = await Cirriculum.findAll();
            res.render('panel/cirrulum/get', { cirrulumList: Cirrulum });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static getCirrulumAdd(req, res) {
        res.render("panel/cirrulum/add")
    }
    static async addCirrulumiest(req, res) {
        try {
            const { order, title, desc } = req.body;
            const newAdd = await Cirriculum.create({
                order: order,
                title: title,
                desc: desc,
            });

            if (newAdd) {
                res.status(201).redirect('/panel/curriculum');
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } catch (error) {
            console.error("Error during Faq creation:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    static async deleteCirrulum(req, res) {
        try {
            const blogToDelete = await Cirriculum.findByPk(req.params.id);

            if (!blogToDelete) {
                return res.status(404).json({ success: false, message: 'Blog not found' });
            }

            await blogToDelete.destroy();

            res.json({ success: true, message: 'Deleted Successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    }
    static async editCirrulum(req,res){
        try {
            const blog = await Cirriculum.findByPk(req.params.id);
            if (!blog) {
                return res.status(404).send('Not Found');
            }
            res.render('panel/cirrulum/edit', { blog: blog });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async updateCirrulum(req, res) {
        try {
                const { order, title, desc } = req.body;
                const blog = await Cirriculum.findByPk(req.params.id);
                if (!blog) {
                    return res.status(404).send('Blog not found');
                }
                await blog.update({
                    order: order,
                    title: title,
                    desc: desc,
                });
    
                req.flash('success', 'Blog yazısı başarıyla güncellendi.');
                res.redirect('/panel/curriculum');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Bir hata oluştu: ' + error.message);
            res.redirect('/panel/curriculum');
        }
    }
}

class CookieController {
    static async getCookies(req, res) {
        try {
            const Cookies = await Cookie.findAll();
            res.render('panel/cookie/get', { cookieList: Cookies });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static addCook(req, res) {
        res.render("panel/cookie/add")
    }
    static async addCookiest(req, res) {
        try {
            const { order, title, desc } = req.body;
            const newAdd = await Cookie.create({
                order: order,
                title: title,
                desc: desc,
            });

            if (newAdd) {
                res.status(201).redirect('/panel/cookie');
            } else {
                console.error("Faq create failed");
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } catch (error) {
            console.error("Error during Faq creation:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    static async deleteCookies(req, res) {
        try {
            const blogToDelete = await Cookie.findByPk(req.params.id);

            if (!blogToDelete) {
                return res.status(404).json({ success: false, message: 'Cookie not found' });
            }

            await blogToDelete.destroy();

            res.json({ success: true, message: 'Deleted Successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    }
    static async editCookies(req,res){
        try {
            const blog = await Cookie.findByPk(req.params.id);
            if (!blog) {
                return res.status(404).send('Not Found');
            }
            res.render('panel/cookie/edit', { blog: blog });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async updateCookies(req, res) {
        try {
                const { order, title, desc } = req.body;
                const blog = await Cookie.findByPk(req.params.id);
                if (!blog) {
                    return res.status(404).send('Blog not found');
                }
                await blog.update({
                    order: order,
                    title: title,
                    desc: desc,
                });
    
                req.flash('success', 'Blog yazısı başarıyla güncellendi.');
                res.redirect('/panel/cookie');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Bir hata oluştu: ' + error.message);
            res.redirect('/panel/cookie');
        }
    }
}

class AboutController {
    static getAbout(req, res) {
        res.render("panel/about/get")
    }
    static getAboutAdd(req, res) {
        res.render("panel/about/add")
    }
    static async addAbout(req, res) {
        aboutUpload(req, res, (err) => {
            if (err) {
                req.flash('error', 'Dosya yüklenirken bir hata oluştu: ' + err.message);
                return res.redirect('/panel/about');
            }

            if (!req.file) {
                req.flash('error', 'Dosya yüklenemedi.');
                return res.redirect('/panel/about');
            }

            const { order, title, desc } = req.body;
            const img = req.file ? req.file.filename : null; // Dosya varsa filename, yoksa null
            About.create({
                order: order,
                title: title,
                desc: desc,
                img: img,
            })
                .then(() => {
                    req.flash('success', 'Resume başarıyla eklendi.');
                    res.redirect('/panel/about');
                })
                .catch((error) => {
                    req.flash('error', 'Bir hata oluştu: ' + error.message);
                    res.redirect('/panel/about');
                });
        });
    }
    static async getAbout(req, res) {
        try {
            const Resumies = await About.findAll();
            res.render('panel/about/get', { aboutList: Resumies });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async deleteAbout(req, res) {
        try {
            const blogToDelete = await About.findByPk(req.params.id);

            if (!blogToDelete) {
                return res.status(404).json({ success: false, message: 'Blog not found' });
            }

            const imgPath = `uploads/about/${blogToDelete.img}`;

            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
            await blogToDelete.destroy();

            res.json({ success: true, message: 'Deleted Successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    }
    static async editAbout(req,res){
        try {
            const blog = await About.findByPk(req.params.id);
            if (!blog) {
                return res.status(404).send('Not Found');
            }
            res.render('panel/about/edit', { blog: blog });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async updateAbout(req, res) {
        try {
            aboutUpload(req, res, async (err) => {
                if (err) {
                    req.flash('error', 'Dosya yüklenirken bir hata oluştu: ' + err.message);
                    return res.redirect('/panel/about');
                }
    
                const { order, title, desc } = req.body;
                const img = req.file ? req.file.filename : null;
    
                const blog = await About.findByPk(req.params.id);
                if (!blog) {
                    return res.status(404).send('Blog not found');
                }
    
                if (req.file && blog.img) {
                    const imgPath = `uploads/about/${blog.img}`;
                    if (fs.existsSync(imgPath)) {
                        fs.unlinkSync(imgPath);
                    }
                }
    
                await blog.update({
                    order: order,
                    title: title,
                    desc: desc,
                    img: img || blog.img,
                });
    
                req.flash('success', 'Blog yazısı başarıyla güncellendi.');
                res.redirect('/panel/about');
            });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Bir hata oluştu: ' + error.message);
            res.redirect('/panel/about');
        }
    }
}
module.exports = {
    SiteController,
    AdminController,
    AuthController,
    ResumeController,
    FaqController,
    CookieController,
    AboutController,
    CirriculumController
}
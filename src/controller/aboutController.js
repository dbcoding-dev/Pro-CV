const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const About = require("../models/about.model")(sequelize, DataTypes);
const multer = require('multer');
const fs = require('fs');

const aboutStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/about')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});


const aboutUpload = multer({
    storage: aboutStorage,
    limits: {
        fieldSize: 1024 * 1024
    }
}).single('img');


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
    static async editAbout(req, res) {
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

module.exports = { AboutController };
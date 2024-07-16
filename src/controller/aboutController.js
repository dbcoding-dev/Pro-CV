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
    static async getAbout(req, res) {
        try {
            const aboutList = await About.findAll();
            res.render('panel/about/get', { aboutList: aboutList });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async getAboutAdd(req, res) {
        try {
            const aboutCount = await About.count();
            if (aboutCount >= 1) {
                req.flash('error', 'Sadece bir adet "about" girdisi oluşturabilirsiniz.');
                return res.redirect('/panel/about');
            }
            res.render("panel/about/add");
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async addAbout(req, res) {
        try {
            const aboutCount = await About.count();
            if (aboutCount >= 1) {
                req.flash('error', 'Sadece bir adet "about" girdisi oluşturabilirsiniz.');
                return res.redirect('/panel/about');
            }

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
                const img = req.file ? req.file.filename : null;
                About.create({
                    order: order,
                    title: title,
                    desc: desc,
                    img: img,
                })
                    .then(() => {
                        req.flash('success', 'About başarıyla eklendi.');
                        res.redirect('/panel/about');
                    })
                    .catch((error) => {
                        req.flash('error', 'Bir hata oluştu: ' + error.message);
                        res.redirect('/panel/about');
                    });
            });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Bir hata oluştu: ' + error.message);
            res.redirect('/panel/about');
        }
    }

    static async deleteAbout(req, res) {
        try {
            const aboutToDelete = await About.findByPk(req.params.id);

            if (!aboutToDelete) {
                return res.status(404).json({ success: false, message: 'About not found' });
            }

            const imgPath = `src/uploads/about/${aboutToDelete.img}`;

            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
            await aboutToDelete.destroy();

            res.json({ success: true, message: 'Deleted Successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    }

    static async editAbout(req, res) {
        try {
            const about = await About.findByPk(req.params.id);
            if (!about) {
                return res.status(404).send('Not Found');
            }
            res.render('panel/about/edit', { about: about });
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

                const about = await About.findByPk(req.params.id);
                if (!about) {
                    return res.status(404).send('About not found');
                }

                if (req.file && about.img) {
                    const imgPath = `src/uploads/about/${about.img}`;
                    if (fs.existsSync(imgPath)) {
                        fs.unlinkSync(imgPath);
                    }
                }

                await about.update({
                    order: order,
                    title: title,
                    desc: desc,
                    img: img || about.img,
                });

                req.flash('success', 'About yazısı başarıyla güncellendi.');
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

const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Resume = require("../models/resume.model")(sequelize, DataTypes);
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/resume')
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


module.exports = ResumeController;
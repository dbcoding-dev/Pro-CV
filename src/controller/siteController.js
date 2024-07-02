const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Site = require("../models/site.model")(sequelize, DataTypes);
const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/comments')
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
});



class SitesController{
    static async Sitepost(req, res) {
        const maxSize = 1024 * 1024; 
        upload.single('fav_icon')(req, res, async (err) => {
            if (err) {
                return res.redirect('/panel/site');
            }
          if (req.file && req.file.size > maxSize) {
            req.flash('error', 'Dosya boyutu 1 MB\'dan fazla olamaz.');
            return res.redirect('/panel/site');
          }
      
          const { site_title, site_desc, number, email, addres } = req.body;
          const fav_icon = req.file ? req.file.filename : null; 
          Site.create({
            site_title: site_title,
            site_desc: site_desc,
            number: number,
            fav_icon: fav_icon,
            email: email,
            addres: addres
          })
          .then(() => {
            req.flash('success', 'Blog yazısı başarıyla eklendi.');
            res.redirect('/panel/site');
          })
          .catch((error) => {
            req.flash('error', 'Bir hata oluştu: ' + error.message);
            res.redirect('/panel/site');
          });
        });
    }
    static async Siteget(req, res) {
        try {
            const Sitiest = await Site.findAll();
            res.render('panel/site/get', { siteList: Sitiest });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async SiteDelete(req, res) {
        try {
            const blogToDelete = await Site.findByPk(req.params.id);
            if (!blogToDelete) {
                return res.status(404).json({ success: false, message: 'Blog not found' });
            }
            const imgPath = `uploads/blog/${blogToDelete.img}`;
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
    static SiteAdd(req, res) {
        res.render("panel/site/add");
    }
    static async EditSite(req, res) {
        try {
            const blog = await Site.findByPk(req.params.id);
            if (!blog) {
                return res.status(404).send('Not Found');
            }
            res.render('panel/site/edit', { blog: blog });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }

    }
    static async UpdateSite(req, res) {
        try {
            upload.single('fav_icon')(req, res, async (err) => {
                if (err) {
                    req.flash('error', 'Dosya yüklenirken bir hata oluştu: ' + err.message);
                    return res.redirect('/panel/site');
                }
                const { site_title, site_desc, number, email, addres } = req.body;
                const img = req.file ? req.file.filename : null;
                const blog = await Site.findByPk(req.params.id);
                if (!blog) {
                    return res.status(404).send('Blog not found');
                }
    
                if (req.file && blog.img) {
                    const imgPath = `uploads/site/${blog.img}`;
                    if (fs.existsSync(imgPath)) {
                        fs.unlinkSync(imgPath);
                    }
                }
    
                await blog.update({
                    site_title: site_title,
                    site_desc: site_desc,
                    number: number,
                    fav_icon: img || blog.img,
                    email: email,
                    addres:addres
                });
    
                req.flash('success', 'Site yazısı başarıyla güncellendi.');
                res.redirect('/panel/site');
            });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Bir hata oluştu: ' + error.message);
            res.redirect('/panel/site');
        }
    }
}

module.exports ={
    SitesController
}
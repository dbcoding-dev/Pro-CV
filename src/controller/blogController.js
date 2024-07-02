const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Blog = require("../models/blog.model")(sequelize, DataTypes);
const multer = require('multer');
const fs = require('fs');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/blog')
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




class Blogs {
    static async Blogpost(req, res) {
        const maxSize = 1024 * 1024; // 1 MB
        upload.single('img')(req, res, (err) => {
          if (err) {
            req.flash('error', 'Dosya yüklenirken bir hata oluştu: ' + err.message);
            return res.redirect('/panel/blog');
          }
      
          if (req.file && req.file.size > maxSize) {
            req.flash('error', 'Dosya boyutu 1 MB\'dan fazla olamaz.');
            return res.redirect('/panel/blog');
          }
      
          const { order, title, desc, detail } = req.body;
          const img = req.file ? req.file.filename : null; 
          Blog.create({
            order: order,
            title: title,
            desc: desc,
            img: img,
            detail: detail
          })
          .then(() => {
            req.flash('success', 'Blog yazısı başarıyla eklendi.');
            res.redirect('/panel/blog');
          })
          .catch((error) => {
            req.flash('error', 'Bir hata oluştu: ' + error.message);
            res.redirect('/panel/blog');
          });
        });
      }
    static async Blogget(req, res) {
        try {
            const Blogiest = await Blog.findAll();
            res.render('panel/blog/get', { blogList: Blogiest });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async BlogDelete(req, res) {
        try {
            const blogToDelete = await Blog.findByPk(req.params.id);

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
    static async BlogEditPage(req, res) {
        try {
            const blog = await Blog.findByPk(req.params.id);
            if (!blog) {
                return res.status(404).send('Not Found');
            }
            res.render('panel/blog/edit', { blog: blog });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }

    }
    static async BlogUpdate(req, res) {
        try {
            upload.single('img')(req, res, async (err) => {
                if (err) {
                    req.flash('error', 'Dosya yüklenirken bir hata oluştu: ' + err.message);
                    return res.redirect('/panel/blog');
                }
    
                const { order, title, desc, detail } = req.body;
                const img = req.file ? req.file.filename : null;
    
                const blog = await Blog.findByPk(req.params.id);
                if (!blog) {
                    return res.status(404).send('Blog not found');
                }
    
                if (req.file && blog.img) {
                    const imgPath = `uploads/blog/${blog.img}`;
                    if (fs.existsSync(imgPath)) {
                        fs.unlinkSync(imgPath);
                    }
                }
    
                await blog.update({
                    order: order,
                    title: title,
                    desc: desc,
                    img: img || blog.img,
                    detail: detail
                });
    
                req.flash('success', 'Blog yazısı başarıyla güncellendi.');
                res.redirect('/panel/blog');
            });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Bir hata oluştu: ' + error.message);
            res.redirect('/panel/blog');
        }
    }
}

module.exports = {
    Blogs
}
const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Comments = require("../models/comment.model")(sequelize, DataTypes);
const multer = require('multer');
const fs = require("fs")


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


class CommentsController {
  static async getComments(req, res) {
    try {
      const Commenties = await Comments.findAll();
      res.render('panel/comments/get', { commentList: Commenties });
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  }
  static addComments(req, res) {
    res.render("panel/comments/add");
  }
  static async postComments(req, res) {
    const maxSize = 1024 * 1024; // 1 MB
    upload.single('img')(req, res, (err) => {
      if (err) {
        req.flash('error', 'Dosya yüklenirken bir hata oluştu: ' + err.message);
        return res.redirect('/panel/comment');
      }

      if (req.file && req.file.size > maxSize) {
        req.flash('error', 'Dosya boyutu 1 MB\'dan fazla olamaz.');
        return res.redirect('/panel/comment');
      }

      const { name, position, desc } = req.body;
      const img = req.file ? req.file.filename : null;
      Comments.create({
        name: name,
        position: position,
        desc: desc,
        img: img
      })
        .then(() => {
          req.flash('success', 'Comment yazısı başarıyla eklendi.');
          res.redirect('/panel/comment');
        })
        .catch((error) => {
          req.flash('error', 'Bir hata oluştu: ' + error.message);
          res.redirect('/panel/comment');
        });
    });
  }
  static async deleteComments(req, res) {
    try {
      const blogToDelete = await Comments.findByPk(req.params.id);

      if (!blogToDelete) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
      }

      const imgPath = `uploads/comments/${blogToDelete.img}`;

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
  static async EditComments(req,res){
    try {
      const comment = await Comments.findByPk(req.params.id);
      if(!comment){
        return res.status(404).send('Not Found');
      }
      res.render('panel/comments/edit', {comment: comment});
    } catch (error) {
       res.status(500).send('Internal Server Error')
    }
  }
  static async updateComments(req,res){
    try {
      upload.single('img')(req, res, async (err) => {
          if (err) {
              req.flash('error', 'Dosya yüklenirken bir hata oluştu: ' + err.message);
              return res.redirect('/panel/comment');
          }

          const {  name, position, desc } = req.body;
          const img = req.file ? req.file.filename : null;

          const blog = await Comments.findByPk(req.params.id);
          if (!blog) {
              return res.status(404).send('Blog not found');
          }

          if (req.file && blog.img) {
              const imgPath = `uploads/comments/${blog.img}`;
              if (fs.existsSync(imgPath)) {
                  fs.unlinkSync(imgPath);
              }
          }

          await blog.update({
              name: name,
              position: position,
              desc: desc,
              img: img || blog.img,
          });

          req.flash('success', 'Blog yazısı başarıyla güncellendi.');
          res.redirect('/panel/comment');
      });
  } catch (error) {
      console.error(error);
      req.flash('error', 'Bir hata oluştu: ' + error.message);
      res.redirect('/panel/comment');
  }
  }
}

module.exports = {
  CommentsController
}

const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Cirriculum = require("../models/curriculum.model")(sequelize, DataTypes);


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
    static async editCirrulum(req, res) {
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

module.exports = CirriculumController;
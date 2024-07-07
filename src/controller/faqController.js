const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Faq = require("../models/faq.model")(sequelize, DataTypes);


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
                return res.status(404).json({ success: false, message: 'Faq not found' });
            }

            await blogToDelete.destroy();

            res.json({ success: true, message: 'Deleted Successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    }
    static async editFaq(req, res) {
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

module.exports = FaqController 
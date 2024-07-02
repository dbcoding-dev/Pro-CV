const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Seo = require("../models/seo.model")(sequelize, DataTypes);


class SeoController {
    static async getSeo(req, res) {
        try {
            const Faqies = await Seo.findAll();
            res.render('panel/seo/get', { SeoList: Faqies });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async postSeo(req, res) {
        try {
            const { order, title, desc } = req.body;
            const newAdd = await Seo.create({
                order: order,
                title: title,
                desc: desc,
            });
            if (newAdd) {
                res.status(201).redirect('/panel/seo');
            } else {
                console.error("SEO create failed");
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } catch (error) {
            console.error("Error during SEO creation:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    static getSeoAdd(req, res) {
        res.render("panel/seo/add")
    }
    static async deleteSeo(req, res) {
        try {
            const blogToDelete = await Seo.findByPk(req.params.id);

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
    static async editSeo(req,res){
        try {
            const seos = await Seo.findByPk(req.params.id);
            if (!seos) {
                return res.status(404).send('Not Found');
            }
            res.render('panel/seo/edit', { seos: seos });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async updateSeo(req, res) {
        try {
                const { order, title, desc } = req.body;
                const seos = await Seo.findByPk(req.params.id);
                if (!seos) {
                    return res.status(404).send('Blog not found');
                }
                await seos.update({
                    order: order,
                    title: title,
                    desc: desc,
                });
    
                req.flash('success', 'Seo yazısı başarıyla güncellendi.');
                res.redirect('/panel/seo');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Bir hata oluştu: ' + error.message);
            res.redirect('/panel/seo');
        }
    }

    static async getSeoByOrder(order) {
        try {
          const seo = await Seo.findOne({
            where: { order },
          });
    
          return seo;
        } catch (error) {
          console.error(error);
          throw new Error('Error fetching SEO data');
        }
      }
}

module.exports = {
    SeoController
}
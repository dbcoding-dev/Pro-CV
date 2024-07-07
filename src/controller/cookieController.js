const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Cookie = require("../models/cookie.model")(sequelize, DataTypes);



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
    static async editCookies(req, res) {
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


module.exports = { CookieController }
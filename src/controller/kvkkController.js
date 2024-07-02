const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Kvkk = require("../models/kvkk.model")(sequelize, DataTypes);


class Kvkks {
    static async getKvkk(req, res) {
        res.render("kvkk");
    }
    static async getKvkks(req, res) {
        try {
            const Kvkkiest = await Kvkk.findAll();
            res.render('panel/kvkk/get', { kvkkList: Kvkkiest });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async addKvkks(req, res) {
        try {
            res.render('panel/kvkk/add');
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async addKvkk(req, res) {
        try {
            const { order, title, desc } = req.body;
            const newAdd = await Kvkk.create({
                order: order,
                title: title,
                desc: desc,
            });

            if (newAdd) {
                res.status(201).redirect('/panel/kvkk');
            } else {
                console.error("Faq create failed");
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } catch (error) {
            console.error("Error during Faq creation:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async KVKKEditPage(req, res) {
        try {
            const kvkk = await Kvkk.findByPk(req.params.id);
            if (!kvkk) {
                return res.status(404).send('Not Found');
            }
            res.render('panel/kvkk/edit', { kvkk: kvkk });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async updateKvkk(req, res) {
        try {
                const { order, title, desc } = req.body;
                const kvkk = await Kvkk.findByPk(req.params.id);
                if (!kvkk) {
                    return res.status(404).send('Blog not found');
                }
                await kvkk.update({
                    order: order,
                    title: title,
                    desc: desc,
                });
    
                req.flash('success', 'Kvkk yazısı başarıyla güncellendi.');
                res.redirect('/panel/kvkk');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Bir hata oluştu: ' + error.message);
            res.redirect('/panel/kvkk');
        }
    }
    
}


module.exports = {
    Kvkks
}
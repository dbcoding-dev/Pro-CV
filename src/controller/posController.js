const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Pos = require("../models/pos.model")(sequelize, DataTypes);
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/pos')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});


const upload = multer({ storage: storage }).single('img');

class PosController {
    static async createPos(req, res) {
        upload(req, res, async (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: err });
            }

            const { name, status, url } = req.body;
            const img = req.file.filename;

            try {
                const newPos = await Pos.create({
                    name,
                    img,
                    url,
                    status: status === 'on' ? true : false
                });
                res.render('panel/pos/add', { message: 'Pos created successfully' });
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        });
    }
    static async addPos(req, res) {
        res.render('panel/pos/add');
    }

    static async getPos(req, res) {
        try {
            const pos = await Pos.findAll();
            res.render('panel/pos/index', { pos })
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

    static async getPosById(req, res) {
        const { id } = req.params;
        try {
            const pos = await Pos.findByPk(id);
            res.render('panel/pos/edit', { pos });
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

    static async updatePos(req, res) {
        const { id } = req.params;
        const { name, status, url } = req.body;

        try {
            const pos = await Pos.findByPk(id);
            if (req.file) {
                const img = req.file.filename;
                if (pos.img) {
                    fs.unlinkSync(`src/uploads/pos/${pos.img}`);
                }

                await Pos.update({
                    name,
                    img,
                    url,
                    status: status === '1' || status === 'on' ? true : false
                }, {
                    where: { id }
                });
            } else {
                await Pos.update({
                    name,
                    url,
                    status: status === '1' || status === 'on' ? true : false
                }, {
                    where: { id }
                });
            }

            res.redirect(`/panel/pos/`);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }


    static async deletePos(req, res) {
        const { id } = req.params;

        try {
            const pos = await Pos.findByPk(id);
            fs.unlinkSync(`src/uploads/pos/${pos.img}`);

            await Pos.destroy({
                where: {
                    id
                }
            });

            res.status(200).json({ message: 'Pos deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

    static async getData(req, res) {
        try {
            const pos = await Pos.findAll({
                where: {
                    status: true
                }
            });
            res.render('typepos', {
                pos
            })
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
}

module.exports = PosController;
const express = require('express');
const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const PdfUsers = require("../models/pdfuser.model")(sequelize, DataTypes);
const Cv = require("../models/cv.model")(sequelize, DataTypes);
const Academi = require("../models/academi.model")(sequelize, DataTypes);
const Referance = require("../models/referance.model")(sequelize, DataTypes);
const Skill = require("../models/skils.model")(sequelize, DataTypes);
const Lang = require("../models/lang.model")(sequelize, DataTypes);
const Experience = require("../models/work.model")(sequelize, DataTypes);
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/cv');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024
    }
});

class UsersProfil {
    static async getProfil(req, res) {
        const { id } = req.params;
        try {
            const user = await PdfUsers.findOne({ where: { id: id } });
            const CvUser = await Cv.findAll({ where: { userId: id } });
            res.render('profile/resume', { user, CvUser });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Update 
    static async updateProfil(req, res) {
        const uploadSingle = upload.single('photo');

        uploadSingle(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            const { id } = req.params;
            const { name, surname, email, phone, address, title, description } = req.body;
            const photoPath = req.file ? req.file.path : null;

            try {
                const updateData = {
                    name,
                    surname,
                    email,
                    phone,
                    address,
                    title,
                    description
                };

                if (photoPath) {
                    updateData.photo = photoPath;
                }

                await Cv.update(updateData, { where: { id: id } });
                const user = await Cv.findOne({ where: { id: id } });
                res.render('profile/create', { user });
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }

    // Edit Page
    static async editProfile(req, res) {
        const uploadSingle = upload.single('photo');

        uploadSingle(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            const { id } = req.params;
            const photoPath = req.file ? req.file.path : null;

            try {
                const user = await Cv.findOne({ where: { id: id } });

                if (photoPath) {
                    user.photo = photoPath;
                    await user.save();
                }

                res.render('profile/create', { user });
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
}

module.exports = UsersProfil;

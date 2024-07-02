const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
const applyTemplate1 = require('./template/applyTemplate1');
const applyTemplate2 = require('./template/applyTemplate2');
const applyTemplate3 = require('./template/applyTemplate3');
const applyTemplate4 = require('./template/applyTemplate4');
const applyTemplate5 = require('./template/applyTemplate5');
const applyTemplate6 = require('./template/applyTemplate6');
const applyTemplate7 = require('./template/applyTemplate7');
const applyDefaultTemplate = require('./template/applyDefaultTemplate');
const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Cv = require("../models/cv.model")(sequelize, DataTypes);
const Academi = require("../models/academi.model")(sequelize, DataTypes);
const Referance = require("../models/referance.model")(sequelize, DataTypes);
const Skill = require("../models/skils.model")(sequelize, DataTypes);
const Lang = require("../models/lang.model")(sequelize, DataTypes);
const Experience = require("../models/work.model")(sequelize, DataTypes);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const pdfDirectory = path.join(__dirname, '../uploads/pdf');

router.post('/create-cv-pdf', upload.single('photo'), async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const {
            template,
            name,
            surname,
            eposta,
            phonenumber,
            address,
            site,
            position,
            about,
            date,
            posta,
            city,
            birth,
            asker,
            surucu,
            medeni,
            gender
        } = req.body;

        const photoBuffer = req.file ? req.file.buffer : null;

        const experiences = typeof req.body.experiences === 'string' ? JSON.parse(req.body.experiences || '[]') : [];
        const skills = typeof req.body.skills === 'string' ? JSON.parse(req.body.skills || '[]') : [];
        const langs = typeof req.body.langs === 'string' ? JSON.parse(req.body.langs || '[]') : [];
        const referance = typeof req.body.referance === 'string' ? JSON.parse(req.body.referance || '[]') : [];
        const academi = typeof req.body.academi === 'string' ? JSON.parse(req.body.academi || '[]') : [];

        const randomString = Math.random().toString(36).substring(2, 8);
        const fileName = `mobilecv-${randomString}.pdf`;
        const pdfPath = path.join(pdfDirectory, fileName);
        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        doc.pipe(fs.createWriteStream(pdfPath));

        doc.font('Helvetica');
        if (template === 'template1') {
            applyTemplate1(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skills, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender);
        } else if (template === 'template2') {
            applyTemplate2(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skills, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender);
        } else if (template === 'template3') {
            applyTemplate3(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skills, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender);
        } else if (template === 'template4') {
            applyTemplate4(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skills, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender);
        } else if (template === 'template5') {
            applyTemplate5(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skills, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender);
        } else if (template === 'template6') {
            applyTemplate6(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skills, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender);
        } else if (template === 'template7') {
            applyTemplate7(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skills, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender);
        } else {
            applyDefaultTemplate(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skills, langs, experiences, referance, academi, city, posta, birth, asker, surucu, medeni, gender);
        }

        const userId = req.session.user.id;

        const newCv = await Cv.create({
            name,
            surname,
            eposta,
            phonenumber,
            address,
            site,
            position,
            about,
            date,
            posta,
            city,
            birth,
            asker,
            surucu,
            medeni,
            gender,
            photo: photoBuffer ? `uploads/${fileName}` : null,
            userId
        }, { transaction });

        // Save academi details
        for (const acad of academi) {
            await Academi.create({
                ...acad,
                cvId: newCv.id
            }, { transaction });
        }

        // Save experiences
        for (const exp of experiences) {
            await Experience.create({
                ...exp,
                cvId: newCv.id
            }, { transaction });
        }

        // Save skills
        for (const skill of skills) {
            await Skill.create({
                ...skill,
                cvId: newCv.id
            }, { transaction });
        }

        // Save languages
        for (const lang of langs) {
            await Lang.create({
                ...lang,
                cvId: newCv.id
            }, { transaction });
        }

        // Save references
        for (const ref of referance) {
            await Referance.create({
                ...ref,
                cvId: newCv.id
            }, { transaction });
        }

        await transaction.commit();

        res.redirect(`/download-cv/${fileName}`);
        doc.end();
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/download-cv/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const pdfPath = path.join(pdfDirectory, fileName);

    res.render('download', { fileName: fileName, pdfPath: pdfPath });
});

module.exports = router;

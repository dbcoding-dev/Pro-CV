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
const Payment = require('../models/stripepayment.model')(sequelize, DataTypes);


// Multer storage ayarı
const storages = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/cv');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Dosya ismi
    }
});
const uploads = multer({ storage: storages });

const pdfDirectory = path.join(__dirname, '../uploads/pdf');

router.post('/create-cv-pdf', uploads.single('photo'), async (req, res) => {
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

        const photoBuffer = req.file ? req.file.path : null;
        const photoPath = req.file ? req.file.path : null; // Dosya yolunu al

        const experiences = [];
        if (req.body.experiences) {
            for (const key in req.body.experiences) {
                if (req.body.experiences.hasOwnProperty(key)) {
                    experiences.push(req.body.experiences[key]);
                }
            }
        }

        const skilles = [];
        if (req.body.skilles) {
            console.log('Skills:', req.body.skilles);
            if (Array.isArray(req.body.skilles)) {
                for (const skill of req.body.skilles) {
                    if (skill.skil && Array.isArray(skill.skil)) {
                        const validSkills = skill.skil.filter(s => s.trim() !== ""); // Boş elemanları filtrele
                        if (validSkills.length > 0) {
                            const skillString = validSkills.join(", ");
                            console.log('Processed skill:', skillString);
                            skilles.push(skillString);
                        }
                    }
                }
            } else {
                for (const key in req.body.skilles) {
                    if (req.body.skilles.hasOwnProperty(key)) {
                        const skill = req.body.skilles[key];
                        if (skill.skil && Array.isArray(skill.skil)) {
                            const validSkills = skill.skil.filter(s => s.trim() !== ""); // Boş elemanları filtrele
                            if (validSkills.length > 0) {
                                const skillString = validSkills.join(", ");
                                console.log('Processed skill:', skillString);
                                skilles.push(skillString);
                            }
                        }
                    }
                }
            }
        }



        if (skilles.length === 0) {
            console.error("No valid skills found");
            res.status(400).send("No valid skills found");
            return;
        }

        const langs = [];
        if (req.body.langs) {
            console.log('Languages:', req.body.langs);
            if (Array.isArray(req.body.langs)) {
                for (const lang of req.body.langs) {
                    if (lang.lang && Array.isArray(lang.lang)) {
                        const validLangs = lang.lang.filter(l => l.trim() !== ""); // Boş elemanları filtrele
                        if (validLangs.length > 0) {
                            const langString = validLangs.join(", ");
                            console.log('Processed language:', langString);
                            langs.push({ lang: langString, level: lang.level });
                        }
                    }
                }
            } else {
                for (const key in req.body.langs) {
                    if (req.body.langs.hasOwnProperty(key)) {
                        const lang = req.body.langs[key];
                        if (lang.lang && Array.isArray(lang.lang)) {
                            const validLangs = lang.lang.filter(l => l.trim() !== ""); // Boş elemanları filtrele
                            if (validLangs.length > 0) {
                                const langString = validLangs.join(", ");
                                console.log('Processed language:', langString);
                                langs.push({ lang: langString, level: lang.level });
                            }
                        }
                    }
                }
            }
        }


        if (langs.length === 0) {
            console.error("No valid languages found");
            res.status(400).send("No valid languages found");
            return;
        }



        const referance = isJSON(req.body.referance) ? JSON.parse(req.body.referance) : [];
        const academi = isJSON(req.body.academi) ? JSON.parse(req.body.academi) : [];

        const randomString = Math.random().toString(36).substring(2, 8);
        const fileName = `procv-${randomString}.pdf`;
        const pdfPath = path.join(pdfDirectory, fileName);
        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        doc.pipe(fs.createWriteStream(pdfPath));

        doc.font('Helvetica');
        if (template === 'template1') {
            applyTemplate1(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skilles, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender);
        } else if (template === 'template2') {
            applyTemplate2(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skilles, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender);
        } else if (template === 'template3') {
            applyTemplate3(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skilles, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender);
        } else if (template === 'template4') {
            applyTemplate4(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skilles, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender);
        } else if (template === 'template5') {
            applyTemplate5(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skilles, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender);
        } else if (template === 'template6') {
            applyTemplate6(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skilles, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender);
        } else if (template === 'template7') {
            applyTemplate7(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skilles, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender);
        } else {
            applyDefaultTemplate(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skilles, langs, experiences, referance, academi, city, posta, birth, asker, surucu, medeni, gender);
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
            photo: photoPath ? `${path.basename(photoPath)}` : null,
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
                position: exp.jobTitle,
                city: exp.city,
                worker: exp.employer,
                start: exp.startDate,
                end: exp.endDate,
                description: exp.description,
                cvId: newCv.id
            }, { transaction });
        }


        // Save skills
        for (const skill of skilles) {
            await Skill.create({
                skills: skill,
                cvId: newCv.id
            }, { transaction });
        }


        // Save languages
        for (const lang of langs) {
            await Lang.create({
                lang: lang,
                cvId: newCv.id
            }, { transaction });
        }

        // Save references
        for (const ref of referance) {
            console.log('Saving reference:', ref);
            await Referance.create({
                ...ref,
                cvId: newCv.id
            }, { transaction });
        }

        await transaction.commit();

        const payment = await Payment.findOne({ where: { userId } });
        if (payment) {
            res.redirect(`/download-cv/${fileName}`);
        } else {
            res.redirect('/payment-methods');
        }

        doc.end();
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

router.post('/create-cv-pdf/:id', uploads.single('photo'), async (req, res) => {
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

        const photoBuffer = req.file ? req.file.path : null;
        const photoPath = req.file ? req.file.path : null; // Dosya yolunu al


        const experiences = typeof req.body.experiences === 'string' ? JSON.parse(req.body.experiences || '[]') : [];
        const skills = typeof req.body.skills === 'string' ? JSON.parse(req.body.skills || '[]') : [];
        const langs = typeof req.body.langs === 'string' ? JSON.parse(req.body.langs || '[]') : [];
        const referance = typeof req.body.referance === 'string' ? JSON.parse(req.body.referance || '[]') : [];
        const academi = typeof req.body.academi === 'string' ? JSON.parse(req.body.academi || '[]') : [];


        const randomString = Math.random().toString(36).substring(2, 8);
        const fileName = `procv-${randomString}.pdf`;
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
            photo: photoPath ? `${path.basename(photoPath)}` : null,
            userId
        }, { transaction });

        // Save academi details
        for (const acad of academi) {
            console.log('Saving academi:', acad);
            await Academi.create({
                ...acad,
                cvId: newCv.id
            }, { transaction });
        }

        // Save experiences
        for (const exp of experiences) {
            console.log('Saving experience:', exp);
            await Experience.create({
                ...exp,
                cvId: newCv.id
            }, { transaction });
        }

        // Save skills
        for (const skill of skills) {
            console.log('Saving skill:', skill);
            await Skill.create({
                ...skill,
                cvId: newCv.id
            }, { transaction });
        }

        // Save languages
        for (const lang of langs) {
            console.log('Saving language:', lang);
            await Lang.create({
                ...lang,
                cvId: newCv.id
            }, { transaction });
        }

        // Save references
        for (const ref of referance) {
            console.log('Saving reference:', ref);
            await Referance.create({
                ...ref,
                cvId: newCv.id
            }, { transaction });
        }

        await transaction.commit();

        const payment = await Payment.findOne({ where: { userId } });
        if (payment) {
            res.redirect(`/download-cv/${fileName}`);
        } else {
            res.redirect('/payment-methods');
        }

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

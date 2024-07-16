const path = require('path');

function applyTemplate6(doc, name, surname,
    eposta,
    phonenumber,
    address,
    photoBuffer,
    site,
    position, about, skilles, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender) {
    const Roboto = path.join(__dirname, '../../font/Roboto/Roboto-Regular.ttf');
    const RobotoMedium = path.join(__dirname, '../../font/Roboto/Roboto-Medium.ttf');
    const RobotoBold = path.join(__dirname, '../../font/Roboto/Roboto-Bold.ttf');
    const RobotoLight = path.join(__dirname, '../../font/Roboto/Roboto-Light.ttf');
    const RobotoThin = path.join(__dirname, '../../font/Roboto/Roboto-Thin.ttf');
    const RobotoItalic = path.join(__dirname, '../../font/Roboto/Roboto-Italic.ttf');


    const Whatsapp = path.join(__dirname, '../../public/assets/icon/whatsapp.png');
    const Email = path.join(__dirname, '../../public/assets/icon/mail.png');

    if (Whatsapp) {
        const photoWidth = 10;
        const photoHeight = 10;
        const photoY = 120
        doc.image(Whatsapp, 430, photoY, { width: photoWidth, height: photoHeight });
    }
    if (Email) {
        const photoWidth = 10;
        const photoHeight = 10;
        const photoY = 120
        doc.image(Email, 200, photoY, { width: photoWidth, height: photoHeight });
    }
    // Fotoğraf
    if (photoBuffer) {
        doc.image(photoBuffer, 50, 50, { width: 110, height: 110 });
    }

    const contactInfoXX = 215;
    const contactInfoYY = 120;
    doc.x = contactInfoXX;
    doc.y = contactInfoYY;
    doc.font(Roboto).fontSize(9).fillColor('black').text(eposta.toLowerCase(), { align: 'left', width: 200 });

    const contactInfoXXX = 445;
    const contactInfoYYY = 120;
    doc.x = contactInfoXXX;
    doc.y = contactInfoYYY;
    doc.font(Roboto).fontSize(9).fillColor('black').text(phonenumber.toLowerCase(), { align: 'left', width: 200 });
    // Adı
    const fontSize = 20;
    const text = `${name.toUpperCase()} ${surname.toUpperCase()}`;
    const pos = `${position.toUpperCase()}`
    const textWidth = doc.font(RobotoBold).widthOfString(text, { size: fontSize });
    const centerX = (doc.page.width - textWidth) / 2;

    const verticalOffset = 50;

    doc.fillColor('#000000').fontSize(fontSize).text(text, centerX - 20, verticalOffset, { align: 'left', });
    doc.fillColor('#000000').font(RobotoMedium).fontSize(14).text(pos, centerX - 20, verticalOffset + 45, { align: 'left', });



    const contactInfosX = 40;
    const contactInfosY = 190;
    const lineY = contactInfosY + 20; // Metnin altına çizgi çekmek için bir y koordinatı belirleyin

    doc.x = contactInfosX;
    doc.y = contactInfosY;

    doc.font(RobotoBold).fontSize(13).fillColor('#000000').text('Profil'.toUpperCase(), { align: 'left' });
    doc.moveDown(0.5);

    doc.font(RobotoLight).fontSize(10).fillColor('#3C3633').text(site, { align: 'left', width: 180 });
    doc.moveDown(0.5);
    doc.font(RobotoLight).fontSize(10).fillColor('#3C3633').text(`${address.toLowerCase()}/ ${city.toLowerCase()} / ${posta.toLowerCase()}`, { align: 'left', width: 180 });
    doc.moveDown(0.5);
    doc.font(RobotoLight).fontSize(10).fillColor('#3C3633').text(date, { align: 'left', width: 180 });
    doc.moveDown(0.5);
    doc.font(RobotoLight).fontSize(10).fillColor('#3C3633').text(gender, { align: 'left', width: 180 });
    doc.moveDown(0.5);
    doc.lineWidth(0.4).moveTo(contactInfosX, lineY + 100).lineTo(contactInfosX + 180, lineY + 100).strokeColor('#C7C8CC').stroke();
    doc.lineWidth(0.4).moveTo(contactInfosX, lineY + 250).lineTo(contactInfosX + 180, lineY + 250).strokeColor('#C7C8CC').stroke();
    doc.lineWidth(0.4).moveTo(contactInfosX, lineY + 390).lineTo(contactInfosX + 180, lineY + 390).strokeColor('#C7C8CC').stroke();

    // Yetenekler
    doc.moveDown(1);
    doc.font(RobotoBold).fontSize(13).fillColor('#000000').text('YETENEKLER', 45, 320, { align: 'left' });

    const maxSkillsToShow = 5;
    if (skilles && Array.isArray(skilles)) {
        for (let index = 0; index < Math.min(skilles.length, maxSkillsToShow); index++) {
            const skill = skilles[index];
            if (skill && typeof skill === 'string') {
                if (index !== 0) {
                    doc.moveDown(0.5);
                }
                const skillText = skill;
                const skillLines = skillText.split(',').map(line => line.trim());

                doc.font(RobotoLight)
                    .fontSize(10)
                    .fillColor('#000000')
                    .lineGap(6)
                    .text(`• ${skillLines.join('\n• ')}`, { align: 'left' });
            } else {
                console.error(`Invalid skill at index ${index}.`);
            }
        }
    } else {
        console.error('Skills are not defined or not an array.');
    }

    // Dil Becerileri
    doc.moveDown(1);
    doc.font(RobotoBold).fontSize(13).fillColor('#000000').text('DİLLER ', 45, 470, { align: 'left' });
    const maxLanguagesToShow = 5;
    let displayedLanguages = 0;

    if (langs && Array.isArray(langs)) {
        langs.forEach((langg, index) => {
            if (displayedLanguages < maxLanguagesToShow && typeof langg === 'string') {
                if (displayedLanguages !== 0) {
                    doc.moveDown(1);
                }
                const langText = langg;
                const langLines = langText.split(',').map(line => line.trim());
                doc.font(RobotoLight)
                    .fontSize(10)
                    .fillColor('#000000')
                    .lineGap(6)
                    .text(`• ${langLines.join('\n• ')}`, { align: 'left' });

                displayedLanguages++;
            } else {
                console.error(`Invalid lang at index ${index}.`);
            }
        });
    } else {
        console.error('Languages are not defined or not an array.');
    }


    // Kişisel Bilgiler
    doc.font(RobotoBold).fontSize(13).fillColor('#000000').text('KİŞİSEL', 45, 610, { align: 'left' });
    doc.font(RobotoLight).fontSize(9).fillColor('#3C3633').text('Doğum yeri: ' + birth.toLowerCase(), { align: 'left', width: 180 });
    doc.font(RobotoLight).fontSize(9).fillColor('#3C3633').text('Cinsiyet: ' + gender.toUpperCase(), { align: 'left', width: 180 });
    doc.font(RobotoLight).fontSize(9).fillColor('#3C3633').text('Ehliyet: ' + surucu.toLowerCase(), { align: 'left', width: 180 });
    doc.font(RobotoLight).fontSize(9).fillColor('#3C3633').text('Medeni Durumu: ' + medeni.toLowerCase(), { align: 'left', width: 180 });
    doc.font(RobotoLight).fontSize(9).fillColor('#3C3633').text('Askerlik: ' + asker.toLowerCase(), { align: 'left', width: 180 });
    doc.moveDown(0.1);
    // Çizgiler
    const contactInfossX = 40;
    const contactInfossX2 = 240;
    const contactInfossX3 = 260;
    const contactInfossY = 150;
    const lineYY = contactInfossY + 20;
    doc.x = contactInfossX;
    doc.y = contactInfossY;
    // Üst Çizgi
    doc.lineWidth(1).moveTo(contactInfossX, lineYY).lineTo(contactInfossX + 530, lineYY).strokeColor('#C7C8CC').stroke();

    // Ortadaki Çizgi
    doc.x = contactInfossX2;
    doc.lineWidth(1).moveTo(contactInfossX2, lineYY).lineTo(contactInfossX2, lineYY + 600).strokeColor('#C7C8CC').stroke();

    // Hakkımızdaki Çizgi
    doc.x = contactInfossX3;
    doc.lineWidth(0.5).moveTo(contactInfossX3, lineYY + 180).lineTo(contactInfossX3 + 300, lineYY + 180).strokeColor('#C7C8CC').stroke();
    // İş Geçmişi

    // Hakkımda
    const contactInfoX = 270;
    const contactInfoY = 180;
    doc.x = contactInfoX;
    doc.y = contactInfoY;

    doc.font(RobotoBold).fontSize(14).fillColor('#000000').text('Hakkımda'.toUpperCase(), { align: 'left' });
    doc.fillColor('black').font(RobotoLight).fontSize(10).text(about, 270, 200, { align: 'left', width: 300 });

    const contactRefX = 200;
    const contactRefY = 360;
    doc.x = contactRefX;
    doc.y = contactRefY;

    const addSection = (title, content) => {
        const startX = 270;
        const startY = (doc.y !== undefined && doc.y !== null) ? doc.y : 0;

        doc.font(RobotoBold).fontSize(16).fillColor('#000000').text(title.toUpperCase(), startX, startY, { align: 'left' });
        content();
        const endY = doc.y + 10;
        doc.y = (endY);
    };

    const addExperiencesSection = () => {
        if (experiences && Array.isArray(experiences)) {
            experiences.forEach((experience, index) => {
                if (experience && typeof experience === 'object') {
                    if (index !== 0) {
                        doc.moveDown(0.5);
                    }
                    const jobTitles = Array.isArray(experience.jobTitle) ? experience.jobTitle : [experience.jobTitle];
                    const employers = Array.isArray(experience.employer) ? experience.employer : [experience.employer];
                    const cities = Array.isArray(experience.city) ? experience.city : [experience.city];
                    const startDates = Array.isArray(experience.startDate) ? experience.startDate : [experience.startDate];
                    const endDates = Array.isArray(experience.endDate) ? experience.endDate : [experience.endDate];
                    const descriptions = Array.isArray(experience.description) ? experience.description : [experience.description];
                    jobTitles.forEach((title, i) => {
                        doc.font(RobotoBold).fontSize(11).fillColor('#000000').text(`${title}`, { align: 'left', width: 200 });
                        doc.font(RobotoThin).fontSize(9).fillColor('#000000').text(`${employers[i]} - ${cities[i]} - ${startDates[i]} - ${endDates[i]}`, { align: 'left', });
                        doc.font(Roboto)
                            .fontSize(9)
                            .fillColor('black')
                            .text(`• ${descriptions[i]}`, { align: 'left', width: 250 });
                        doc.moveDown(1);

                    });
                } else {
                    console.error(`Invalid experience at index ${index}.`);
                }
            });
        } else {
            console.error('Experiences are not defined or not an array.');
        }
    };

    const addReferencesSection = () => {
        if (referance && Array.isArray(referance)) {
            referance.forEach((ref, index) => {
                if (ref && typeof ref === 'object') {
                    if (index !== 0) {
                    }
                    const jobTitle = Array.isArray(ref.jobTitle) ? ref.jobTitle.join(', ') : ref.jobTitle || "";
                    const city = Array.isArray(ref.city) ? ref.city.join(', ') : ref.city || "";
                    const employer = Array.isArray(ref.employer) ? ref.employer.join(', ') : ref.employer || "";

                    doc.font(RobotoBold).fontSize(9).fillColor('black').text(jobTitle, { align: 'left' });
                    doc.font(RobotoThin).fontSize(9).fillColor('black').text(city, { align: 'left' });
                    doc.font(RobotoMedium).fontSize(9).fillColor('black').text(employer, { align: 'left' });

                    doc.moveDown(1);
                } else {
                    console.error(`Invalid reference at index ${index}.`);
                }
            });
        } else {
            console.error('References are not defined or not an array.');
        }
    };
    const addAcademiSection = () => {
        if (academi && Array.isArray(academi)) {
            academi.forEach((academis, index) => {
                if (academis && typeof academis === 'object') {
                    if (index !== 0) {
                    }
                    const jobTitle = Array.isArray(academis.title) ? academis.title.join(', ') : academis.title || "";
                    const lisans = Array.isArray(academis.lisans) ? academis.lisans.join(', ') : academis.lisans || "";
                    const employers = Array.isArray(academis.uni) ? academis.uni.join(', ') : academis.uni || "";
                    const startDates = Array.isArray(academis.start) ? academis.start.join(', ') : academis.start || "";
                    const endDates = Array.isArray(academis.end) ? academis.end.join(', ') : academis.end || "";
                    const descriptions = Array.isArray(academis.desc) ? academis.desc.join('\n') : academis.desc || "";

                    doc.font(RobotoBold).fontSize(11).fillColor('black').text(jobTitle, { align: 'left', width: 200 });
                    doc.font(RobotoBold).fontSize(9).fillColor('black').text(lisans, { align: 'left', width: 250 });
                    doc.font(RobotoBold).fontSize(9).fillColor('black').text(employers, { align: 'left', width: 250 });
                    doc.font(RobotoItalic).fontSize(9).fillColor('#000000').text(`${startDates} - ${endDates}`, { align: 'left', });
                    doc.font(Roboto).fontSize(9).fillColor('black').text(descriptions, { align: 'left', width: 250 });
                } else {
                    console.error(`Invalid academic experience at index ${index}.`);
                }
            });
        } else {
            console.error('Academic experiences are not defined or not an array.');
        }
    };

    addSection('İş tecrübesİ', addExperiencesSection);
    addSection('Eğİtİm ve Nİtelİkler', addAcademiSection);
    addSection('Referanslar', addReferencesSection);
}


module.exports = applyTemplate6;
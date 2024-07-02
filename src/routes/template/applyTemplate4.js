const path = require('path');

function applyTemplate4(doc, name, surname,
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
    const RobotoItalic = path.join(__dirname, '../../font/Roboto/Roboto-Italic.ttf');


    // Renkler
    doc.rect(50, 50, 200, 1920).fill('#EEEEEE');
    doc.rect(0, 770, 1920, 30).fill('#EEEEEE');

    // Fotoğraf
    if (photoBuffer) {
        doc.image(photoBuffer, 50, 10, { width: 200, height: 200 });
    }

    // Ad-soyad
    const fontSize = 24;
    const uppercaseName = name.toUpperCase();
    const uppercaseSurname = surname.toUpperCase();
    const text = `${uppercaseName} ${uppercaseSurname}`;
    const textWidth = doc.font(RobotoMedium).widthOfString(text, { size: fontSize });
    const centerX = (doc.page.width - textWidth) / 2;

    doc.rect(260, 135, 1920, 30).fill('#EEEEEE');
    const verticalOffset = 50;
    doc.fillColor('black').fontSize(fontSize).text(text, centerX + 75, verticalOffset, { align: 'left' });
    doc.fillColor('black').font(Roboto).fontSize(20).text(position, centerX + 80, verticalOffset + 90, { align: 'left', width: 250 });

    // Kişisel Bilgiler
    doc.fillColor("black").font(Roboto).fontSize(9).text('Doğum Yeri: ' + birth.toLowerCase(), centerX + 80, verticalOffset + 120, { align: 'left', width: 250 })
    doc.fillColor("black").font(Roboto).fontSize(9).text('Doğum Tarihi: ' + date.toLowerCase(), centerX + 80, verticalOffset + 130, { align: 'left', width: 250 })
    doc.fillColor("black").font(Roboto).fontSize(9).text('Ehliyet: ' + surucu.toLowerCase(), centerX + 80, verticalOffset + 140, { align: 'left', width: 250 })
    doc.fillColor("black").font(Roboto).fontSize(9).text('Askerlik: ' + asker.toLowerCase(), centerX + 80, verticalOffset + 150, { align: 'left', width: 250 })
    doc.fillColor("black").font(Roboto).fontSize(9).text('Medeni Durum: ' + medeni.toLowerCase(), centerX + 80, verticalOffset + 160, { align: 'left', width: 250 })
    doc.fillColor("black").font(Roboto).fontSize(9).text('Cinsiyet: ' + gender, centerX + 80, verticalOffset + 170, { align: 'left', width: 250 })

    // İletişim Bilgiler
    const contactInfoX = 75;
    const contactInfoY = 250;
    doc.x = contactInfoX;
    doc.y = contactInfoY;

    doc.font(Roboto).fontSize(20).fillColor('#000000').text('İLETİŞİM', { align: 'left' });

    const lineY = contactInfoY + 25;
    doc.lineWidth(1).moveTo(centerX - 15, lineY).lineTo(contactInfoX - 15, lineY).strokeColor('#000000').stroke();
    // E-posta
    doc.moveDown(0.3);
    doc.font(Roboto).fontSize(9).fillColor('#000000').text(eposta, { align: 'left', width: 180 });
    doc.moveDown(0.3);
    // Telefon Numarası
    doc.font(Roboto).fontSize(9).fillColor('#000000').text(phonenumber, { align: 'left', width: 180 });
    // Website
    doc.moveDown(0.3);
    doc.font(Roboto).fontSize(9).fillColor('#000000').text(site, { align: 'left', width: 180 });

    doc.moveDown(0.3);
    doc.font(Roboto).fontSize(9).fillColor('#000000').text(`${address.toLowerCase()} / ${city.toLowerCase()} / ${posta.toLowerCase()}`, { align: 'left', width: 150 });

    // Hakkında
    const contactInfoXX = 75;
    const contactInfoYY = 350;
    doc.x = contactInfoXX;
    doc.y = contactInfoYY;
    doc.font(Roboto).fontSize(20).fillColor('#000000').text('HAKKINDA', { align: 'left' });
    const linesY = contactInfoYY + 25;
    doc.lineWidth(1).moveTo(centerX - 15, linesY ).lineTo(contactInfoXX - 15, linesY).strokeColor('#000000').stroke();
    doc.fillColor('black').font(RobotoLight).fontSize(8).text(about, contactInfoXX, contactInfoYY + 30, { align: 'left', width: 170 });

    // Yetenekler
    const contactInfoXXX = 75;
    const contactInfoYYY = 490;
    doc.x = contactInfoXXX;
    doc.y = contactInfoYYY;
    const lineYY = contactInfoYYY + 10;

    doc.font(Roboto).fontSize(20).fillColor('000000').text('BECERİLER', contactInfoXXX, doc.y + 10, { align: 'left' });
    doc.lineWidth(1).moveTo(centerX - 15,  doc.y + 5).lineTo(contactInfoXXX - 15,  doc.y + 5).strokeColor('#000000').stroke();
    const maxSkillsToShow = 5;

    if (skilles && Array.isArray(skilles)) {
        for (let index = 0; index < Math.min(skilles.length, maxSkillsToShow); index++) {
            const skill = skilles[index];
            if (skill && typeof skill === 'object' && skill.skil) {
                const skillText = `${skill.skil}`;
                const skillLines = skillText.split(',').map(line => line.trim());
                doc.y = doc.y + 10;
                doc.font(RobotoLight)
                    .fontSize(10)
                    .fillColor('#000000')
                    .lineGap(3)
                    .text(`- ${skillLines.join('\n- ')}`, { align: 'left' });
            } else {
                console.error(`Invalid skill at index ${index}.`);
            }
        }
    } else {
        console.error('Skills are not defined or not an array.');
    }

    doc.font(Roboto).fontSize(20).fillColor('#000000').text('YABANCI DİL ', contactInfoXXX, doc.y + 5, { align: 'left' });
    doc.lineWidth(1).moveTo(centerX - 15,  doc.y + 5).lineTo(contactInfoXXX - 15,  doc.y + 5).strokeColor('#000000').stroke();


    const maxLanguagesToShow = 5;
    let displayedLanguages = 0;

    if (langs && Array.isArray(langs)) {
        langs.forEach((langg, index) => {
            if (displayedLanguages < maxLanguagesToShow && langg && typeof langg === 'object' && langg.lang) {
                const langText = `${langg.lang}`;
                const langLines = langText.split(',').map(line => line.trim());
                doc.y = doc.y + 10;
                doc.font(RobotoLight)
                    .fontSize(10)
                    .fillColor('#000000')
                    .lineGap(3)
                    .text(`- ${langLines.join('\n- ')}`, { align: 'left' });

                displayedLanguages++;
            } else {
                console.error(`Invalid lang at index ${index}.`);
            }
        });
    } else {
        console.error('Languages are not defined or not an array.');
    }
    const contactRefX = 35;
    const contactRefY = 250;
    doc.x = contactRefX;
    doc.y = contactRefY;

    const addSection = (title, content) => {
        const startX = 280;
        const startY = (doc.y !== undefined && doc.y !== null) ? doc.y : 0;
        doc.font(Roboto).fontSize(20).fillColor('#000000').text(title.toUpperCase(), startX, startY, { align: 'left' });
        content();
        const endY = doc.y + 10;
        doc.y = (endY);
    };

    const addExperiencesSection = () => {
        if (experiences && Array.isArray(experiences)) {
            experiences.forEach((experience, index) => {
                if (experience && typeof experience === 'object') {
                    if (index !== 0) {
                    }
                    const jobTitles = Array.isArray(experience.jobTitle) ? experience.jobTitle : [experience.jobTitle];
                    const employers = Array.isArray(experience.employer) ? experience.employer : [experience.employer];
                    const cities = Array.isArray(experience.city) ? experience.city : [experience.city];
                    const startDates = Array.isArray(experience.startDate) ? experience.startDate : [experience.startDate];
                    const endDates = Array.isArray(experience.endDate) ? experience.endDate : [experience.endDate];
                    const descriptions = Array.isArray(experience.description) ? experience.description : [experience.description];
                    jobTitles.forEach((title, i) => {
                        doc.font(RobotoBold).fontSize(9).fillColor('#000000').text(`${title}`, { align: 'left', width: 200 });
                        doc.font(Roboto).fontSize(9).fillColor('#000000').text(`${employers[i]} - ${cities[i]} - ${startDates[i]} - ${endDates[i]}`, { align: 'left', });
                        doc.font(Roboto).fontSize(9).fillColor('black').text(`${descriptions[i]}`, { align: 'left', width: 250 });
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
                    doc.font(RobotoBold).fontSize(9).fillColor('#000000').text(jobTitle, { align: 'left' });
                    doc.font(RobotoBold).fontSize(9).fillColor('black').text(employer, { align: 'left' });
                    doc.font(Roboto).fontSize(9).fillColor('black').text(city, { align: 'left' });
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
                    doc.font(RobotoBold).fontSize(11).fillColor('#000000').text(jobTitle, { align: 'left', width: 200 });
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
    addSection('Eğİtİm ve Nİtelİkler', addAcademiSection)
    addSection('Referanslar', addReferencesSection);

}

module.exports = applyTemplate4;
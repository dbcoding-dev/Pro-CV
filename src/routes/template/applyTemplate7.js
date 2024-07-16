const path = require('path');


function applyTemplate7(doc, name, surname,
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

    const Whatsapp = path.join(__dirname, '../../public/assets/icon/whatsapp.png');
    const Email = path.join(__dirname, '../../public/assets/icon/mail.png');
    const Konum = path.join(__dirname, '../../public/assets/icon/location.png');

    if (Whatsapp) {
        const photoWidth = 10;
        const photoHeight = 10;
        const photoY = 296;
        doc.image(Whatsapp, 35, photoY, { width: photoWidth, height: photoHeight });
    }
    if (Email) {
        const photoWidth = 10;
        const photoHeight = 10;
        const photoY = 280;
        doc.image(Email, 35, photoY, { width: photoWidth, height: photoHeight });
    }
    if (Konum) {
        const photoWidth = 10;
        const photoHeight = 10;
        const photoY = 313;
        doc.image(Konum, 35, photoY, { width: photoWidth, height: photoHeight });
    }



    // Color
    const gradient = doc.linearGradient(0, 0, 1920, 0);
    gradient.stop(0, '#F18C31');
    gradient.stop(1, '#F2A90F');

    doc.rect(580, 0, 100, 1920).fill(gradient);

    // Ad Soyad

    const fontSize = 19;
    const text = `${name} ${surname}`;
    const textWidth = doc.font(RobotoBold).widthOfString(text, { size: fontSize });
    const centerX = (doc.page.width - textWidth) / 2;
    const verticalOffset = 50;
    doc.fillColor('black').fontSize(fontSize).text(text, centerX - 150, verticalOffset, { align: 'left', width: 330 });
    doc.fillColor('black').font(Roboto).fontSize(16).text(position, centerX - 150, verticalOffset + 45, { align: 'left', });
    doc.fillColor('black').font(Roboto).fontSize(9).text('Doğum Günü: ' + date, centerX - 150, verticalOffset + 65, { align: 'left', });
    doc.fillColor('black').font(Roboto).fontSize(9).text('Doğum Yeri: ' + birth, centerX - 150, verticalOffset + 75, { align: 'left', });
    doc.fillColor('black').font(Roboto).fontSize(9).text('Askerlik: ' + asker, centerX - 150, verticalOffset + 85, { align: 'left', });
    doc.fillColor('black').font(Roboto).fontSize(9).text('Ehliyet: ' + surucu, centerX - 150, verticalOffset + 95, { align: 'left', });
    doc.fillColor('black').font(Roboto).fontSize(9).text('Medeni Durum: ' + medeni, centerX - 150, verticalOffset + 105, { align: 'left', });
    doc.fillColor('black').font(Roboto).fontSize(9).text('Cinsiyet: ' + gender, centerX - 150, verticalOffset + 115, { align: 'left', });



    // Fotoğraf
    doc.image(photoBuffer, 350, 50, { width: 180, height: 180 });


    // İletişim Bilgiler
    const contactInfoX = 50;
    const contactInfoY = 250;
    doc.x = contactInfoX;
    doc.y = contactInfoY;
    const boxWidth = 230;
    const boxHeight = 530;
    const cornerRadius = 20;
    const borderWidth = 0.8;

    doc.roundedRect(contactInfoX - 20, contactInfoY - 30, boxWidth, boxHeight, cornerRadius)
        .lineWidth(borderWidth) // Kenarlık kalınlığını ayarlayın
        .strokeColor('#000000') // Kenarlık rengini ayarlayın
        .stroke(); // Kenarlık çiz

    doc.font(RobotoBold).fontSize(16).fillColor('#000000').text('İLETİŞİM', { align: 'left', width: 180 });
    // E-posta
    doc.moveDown(0.5);
    doc.font(Roboto).fontSize(10).fillColor('#000000').text(eposta, { align: 'left', width: 180 });
    doc.moveDown(0.5);
    // Telefon Numarası
    doc.font(Roboto).fontSize(10).fillColor('#000000').text(phonenumber, { align: 'left', width: 180 });
    // Website
    doc.moveDown(0.5);
    doc.font(Roboto).fontSize(10).fillColor('#000000').text(`${address.toLowerCase()} / ${city.toLowerCase()} / ${posta.toLowerCase()}`, { align: 'left', width: 180 });
    doc.font(Roboto);

    // Hakkında
    const contactInfoXX = 50;
    const contactInfoYY = 340;
    doc.x = contactInfoXX;
    doc.y = contactInfoYY;
    doc.font(RobotoBold).fontSize(16).fillColor('#000000').text('HAKKINDA', { align: 'left' });
    doc.fillColor('black').font(RobotoLight).fontSize(10).text(about, contactInfoXX, contactInfoYY + 25, { align: 'left', width: 210 });

    // Yetenekler
    const contactInfoXXX = 50;
    const contactInfoYYY = 510;
    doc.x = contactInfoXXX;
    doc.y = contactInfoYYY;
    doc.moveDown(1);
    doc.font(RobotoBold).fontSize(16).fillColor('000000').text('BECERİLER', contactInfoXXX, contactInfoYYY, { align: 'left' });
    doc.moveDown(0.5);

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
                    .lineGap(3)
                    .text(`- ${skillLines.join('\n- ')}`, { align: 'left' });
            } else {
                console.error(`Invalid skill at index ${index}.`);
            }
        }
    } else {
        console.error('Skills are not defined or not an array.');
    }

    doc.moveDown(2);
    doc.font(RobotoBold).fontSize(16).fillColor('#000000').text('YABANCI DİL ', contactInfoXXX, contactInfoYYY + 110, { align: 'left' });
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


    // İş deneyim ile Referanslar


    const contactRefX = 35;
    const contactRefY = 250;
    doc.x = contactRefX;
    doc.y = contactRefY;

    const addSection = (title, content) => {
        const startX = 300;
        const startY = (doc.y !== undefined && doc.y !== null) ? doc.y : 30;

        doc.font(RobotoBold).fontSize(16).fillColor('black').text(title, startX, startY, { align: 'left' });
        doc.moveDown(1);
        content();
        const endY = doc.y + 10;
        doc.y = (endY);
    };

    const addExperiencesSection = () => {
        const transformExperiences = (experiences) => {
            return experiences.map((experience) => {
                return {
                    jobTitle: Array.isArray(experience.jobTitle) ? experience.jobTitle : [experience.jobTitle],
                    employer: Array.isArray(experience.employer) ? experience.employer : [experience.employer],
                    startDate: Array.isArray(experience.startDate) ? experience.startDate : [experience.startDate],
                    endDate: Array.isArray(experience.endDate) ? experience.endDate : [experience.endDate],
                    description: Array.isArray(experience.description) ? experience.description : [experience.description],
                };
            });
        };

        const transformedExperiences = transformExperiences(experiences || []);
        transformedExperiences.forEach((experience, index) => {
            if (Array.isArray(experience.jobTitle) &&
                Array.isArray(experience.employer)) {
                experience.jobTitle.forEach(title => {
                    doc.font(RobotoBold).fontSize(10).fillColor('black').text(`${title}`, { align: 'left', width: 150 });
                });
                doc.font(RobotoBold).fontSize(10).fillColor('black').text(`${experience.startDate.join(' - ')} - ${experience.endDate.join(' - ')}`, { align: 'left', width: 200 });
                experience.employer.forEach(emp => {
                    doc.font(RobotoLight).fontSize(10).fillColor('black').text(`${emp}`, { align: 'left' });
                });
                doc.font(Roboto).fontSize(10).fillColor('black').text(`${experience.description.join('\n')}`, { align: 'left', width: 200 });
                doc.moveDown(0.3);
            } else {
                console.error(`Invalid experience at index ${index}. One or more fields are not arrays.`);
            }
        });
    };

    const addReferencesSection = () => {
        const transformRefenerce = (referance) => {
            return referance.map((referance) => {
                return {
                    jobTitle: Array.isArray(referance.jobTitle) ? referance.jobTitle : [referance.jobTitle],
                    city: Array.isArray(referance.city) ? referance.city : [referance.city],
                    employer: Array.isArray(referance.employer) ? referance.employer : [referance.employer],
                };
            });
        };

        const transformedRefenerce = transformRefenerce(referance || []);
        transformedRefenerce.forEach((referance, index) => {
            if (referance && typeof referance === 'object') {
                referance.jobTitle.forEach(title => {
                    doc.font(RobotoBold).fontSize(10).fillColor('black').text(` ${title}`, { align: 'left' });
                });
                referance.city.forEach(cty => {
                    doc.font(Roboto).fontSize(10).fillColor('black').text(`${cty}`, { align: 'left' });
                });
                referance.employer.forEach(emp => {
                    doc.font(RobotoLight).fontSize(10).fillColor('#black').text(`${emp}`, { align: 'left' });
                });

            } else {
                console.error(`Invalid experience at index ${index}.`);
            }
        });
    };

    const addAcademiSection = () => {
        if (academi && Array.isArray(academi)) {
            academi.forEach((academis, index) => {
                if (academis && typeof academis === 'object') {
                    const jobTitle = Array.isArray(academis.title) ? academis.title.join(', ') : academis.title || "";
                    const lisans = Array.isArray(academis.lisans) ? academis.lisans.join(', ') : academis.lisans || "";
                    const employers = Array.isArray(academis.uni) ? academis.uni.join(', ') : academis.uni || "";
                    const startDates = Array.isArray(academis.start) ? academis.start.join(', ') : academis.start || "";
                    const endDates = Array.isArray(academis.end) ? academis.end.join(', ') : academis.end || "";
                    const descriptions = Array.isArray(academis.desc) ? academis.desc.join('\n') : academis.desc || "";

                    doc.font(RobotoBold).fontSize(11).fillColor('#000000').text(jobTitle, { align: 'left', width: 200 });
                    doc.font(RobotoBold).fontSize(9).fillColor('#000000').text(lisans, { align: 'left', width: 250 });
                    doc.font(RobotoBold).fontSize(9).fillColor('#000000').text(employers, { align: 'left', width: 250 });
                    doc.font(RobotoItalic).fontSize(9).fillColor('#000000').text(`${startDates} - ${endDates}`, { align: 'left', width: 250 });
                    doc.font(Roboto).fontSize(9).fillColor('#000000').text(descriptions, { align: 'left', width: 250 });
                } else {
                    console.error(`Invalid academic experience at index ${index}.`);
                }
            });
        } else {
            console.error('Academic experiences are not defined or not an array.');
        }
    };

    addSection('İŞ DENEYİMİ', addExperiencesSection);
    addSection('REFERANSLAR', addReferencesSection);
    addSection('EĞİTİM VE NİTELİKLER', addAcademiSection);

}

module.exports = applyTemplate7;
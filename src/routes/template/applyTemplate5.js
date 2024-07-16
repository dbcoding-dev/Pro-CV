const path = require('path');


function applyTemplate5(doc, name, surname,
    eposta,
    phonenumber,
    address,
    photoBuffer,
    site,
    position, about, skilles, langs, experiences, referance, academi, date, city, posta, birth, asker, surucu, medeni, gender) {
    const Roboto = path.join(__dirname, '../../font/Roboto/Roboto-Regular.ttf');
    const RobotoBold = path.join(__dirname, '../../font/Roboto/Roboto-Bold.ttf');
    const RobotoLight = path.join(__dirname, '../../font/Roboto/Roboto-Light.ttf');
    const RobotoItalic = path.join(__dirname, '../../font/Roboto/Roboto-Italic.ttf');

    doc.rect(0, 100, 230, 1920).fill('#EDEDED');

    if (photoBuffer) {
        doc.image(photoBuffer, 40, 40, { width: 160, height: 160 });
    }
    // Adı
    const fontSize = 20;
    const text = `${name.toUpperCase()} ${surname.toUpperCase()}`;
    const textWidth = doc.font(RobotoBold).widthOfString(text, { size: fontSize });
    const centerX = (doc.page.width - textWidth) / 2;

    const verticalOffset = 50;

    doc.fillColor('#000000').fontSize(fontSize).text(text, centerX + 60, verticalOffset, { align: 'left', });
    doc.fillColor('#000000').font(RobotoBold).fontSize(14).text(position, centerX + 60, verticalOffset + 60, { align: 'left', });


    // Hakkımda
    const contactInfoX = 270;
    const contactInfoY = 160;
    doc.x = contactInfoX;
    doc.y = contactInfoY;

    doc.font(RobotoBold).fontSize(18).fillColor('#000000').text('Hakkımda'.toUpperCase(), { align: 'left' });
    doc.fillColor('black').font(RobotoLight).fontSize(10).text(about, 270, verticalOffset + 140, { align: 'left', width: 330 });


    const contactInfosX = 40;
    const contactInfosX2 = 200;
    const contactInfosY = 220;
    const lineY = contactInfosY + 20; // Metnin altına çizgi çekmek için bir y koordinatı belirleyin

    doc.x = contactInfosX;
    doc.y = contactInfosY;

    doc.font(RobotoBold).fontSize(13).fillColor('#000000').text('İLETİŞİM', { align: 'left' });
    doc.lineWidth(1).moveTo(contactInfosX, lineY).lineTo(contactInfosX + 190, lineY).strokeColor('#000000').stroke();
    // E-posta
    doc.moveDown(1);
    doc.font(Roboto).fontSize(9).fillColor('#3C3633').text(eposta, { align: 'left', width: 180 });
    doc.moveDown(0.7);
    // Telefon Numarası
    doc.font(Roboto).fontSize(9).fillColor('#3C3633').text(phonenumber, { align: 'left', width: 180 });
    doc.moveDown(0.7);
    // Konum
    doc.font(Roboto).fontSize(9).fillColor('#3C3633').text(`${address.toLowerCase()} / ${city.toLowerCase()} / ${posta.toLowerCase()}`, { align: 'left', width: 180 });
    // Website
    doc.moveDown(0.7);
    doc.font(Roboto).fontSize(9).fillColor('#3C3633').text(site, { align: 'left' });


    // Kişisel
    doc.font(RobotoBold).fontSize(13).fillColor('#000000').text('KİŞİSEL', 40, doc.y + 10, { align: 'left' });
    doc.lineWidth(1).moveTo(contactInfosX, doc.y + 5).lineTo(contactInfosX + 190, doc.y + 5).strokeColor('#000000').stroke();

    // Doğum Yeri
    doc.moveDown(0.5);
    doc.font(Roboto).fontSize(9).fillColor('#000000').text('Doğum Yeri :' + birth.toLowerCase(), { align: 'left', width: 180 });

    // Doğum Gunu
    doc.moveDown(0.5);
    doc.font(Roboto).fontSize(9).fillColor('#000000').text('Doğum Günü :' + date, { align: 'left', width: 180 });
    // Ehliyet
    doc.moveDown(0.5);
    doc.font(Roboto).fontSize(9).fillColor('#000000').text('Ehliyet :' + surucu, { align: 'left', width: 180 });
    // Cinsiyet
    doc.moveDown(0.5);
    doc.font(Roboto).fontSize(9).fillColor('#000000').text('Cinsiyet :' + gender, { align: 'left', width: 180 });
    // Medeni Durum
    doc.moveDown(0.5);
    doc.font(Roboto).fontSize(9).fillColor('#000000').text('Medeni Durum :' + medeni, { align: 'left', width: 180 });

    // Askerlik
    doc.moveDown(0.5);
    doc.font(Roboto).fontSize(9).fillColor('#000000').text('Askerlik :' + asker, { align: 'left', width: 180 });
    // Yetenekler
    doc.moveDown(1);
    doc.font(RobotoBold).fontSize(13).fillColor('#000000').text('YETENEKLER', 40, doc.y + 10, { align: 'left' });
    doc.lineWidth(1).moveTo(contactInfosX, doc.y + 10).lineTo(contactInfosX + 190, doc.y + 10).strokeColor('#000000').stroke();

    doc.moveDown(0.5);

    const maxSkillsToShow = 5;

    if (skilles && Array.isArray(skilles)) {
        for (let index = 0; index < Math.min(skilles.length, maxSkillsToShow); index++) {
            const skill = skilles[index];
            if (skill && typeof skill === 'string') {
                const skillText = `${skill}`;
                const skillLines = skillText.split(',').map(line => line.trim());
                doc.y = doc.y + 10;
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
    doc.moveDown(0.5);
    doc.font(RobotoBold).fontSize(13).fillColor('#000000').text('DİLLER ', 40, doc.y + 5, { align: 'left' });
    doc.lineWidth(1).moveTo(contactInfosX, doc.y + 3).lineTo(contactInfosX + 190, doc.y + 3).strokeColor('#000000').stroke();
    const maxLanguagesToShow = 5;
    let displayedLanguages = 0;

    if (langs && Array.isArray(langs)) {
        langs.forEach((langg, index) => {
            if (displayedLanguages < maxLanguagesToShow && typeof langg === 'string') {
                const langText = langg;
                const langLines = langText.split(',').map(line => line.trim());
                doc.y = doc.y + 10;
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



    const contactRefX = 200;
    const contactRefY = 300;
    doc.x = contactRefX;
    doc.y = contactRefY;


    doc.moveTo(275, 320) // Başlangıç noktası (x=100, y=100)
        .lineTo(500, 320) // Bitiş noktası (x=400, y=100)
        .stroke();
    doc.moveTo(270, 180) // Başlangıç noktası (x=100, y=100)
        .lineTo(500, 180) // Bitiş noktası (x=400, y=100)
        .stroke();
    const addSection = (title, content) => {
        const startX = 275;
        const startY = (doc.y !== undefined && doc.y !== null) ? doc.y : 0;
        doc.font(RobotoBold).fontSize(16).fillColor('#000000').text(title.toUpperCase(), startX, startY, { align: 'left' });
        doc.moveDown(0.5);
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
                        doc.font(RobotoItalic).fontSize(9).fillColor('#000000').text(`${startDates[i]} - ${endDates[i]}`, { align: 'left', width: 80 });
                        doc.moveUp(0.8);
                        doc.font(RobotoBold).fontSize(9).fillColor('#000000').text(`${title}`, { align: 'right', width: 200 });
                        doc.moveDown(0.2);
                        doc.font(RobotoBold).fontSize(9).fillColor('black').text(`${employers[i]}/${cities[i]}`, { align: 'left', width: 250 });
                        doc.moveDown(0.2);
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
    const addAcademiSection = () => {
        if (academi && Array.isArray(academi)) {
            academi.forEach((academis, index) => {
                if (academis && typeof academis === 'object') {
                    if (index !== 0) {
                        doc.moveDown(0.1);
                    }
                    const jobTitle = Array.isArray(academis.title) ? academis.title.join(', ') : academis.title || "";
                    const lisans = Array.isArray(academis.lisans) ? academis.lisans.join(', ') : academis.lisans || "";
                    const employers = Array.isArray(academis.uni) ? academis.uni.join(', ') : academis.uni || "";
                    const startDates = Array.isArray(academis.start) ? academis.start.join(', ') : academis.start || "";
                    const endDates = Array.isArray(academis.end) ? academis.end.join(', ') : academis.end || "";
                    const descriptions = Array.isArray(academis.desc) ? academis.desc.join('\n') : academis.desc || "";

                    doc.font(RobotoBold).fontSize(11).fillColor('#000000').text(jobTitle, { align: 'left', width: 200 });
                    doc.moveDown(0.1);
                    doc.font(RobotoBold).fontSize(9).fillColor('black').text(lisans, { align: 'left', width: 250 });
                    doc.moveDown(0.1);
                    doc.font(RobotoBold).fontSize(9).fillColor('black').text(employers, { align: 'left', width: 250 });
                    doc.moveDown(0.1);
                    doc.font(RobotoItalic).fontSize(9).fillColor('#000000').text(`${startDates} - ${endDates}`, { align: 'left', });
                    doc.moveDown(0.1);
                    doc.font(Roboto).fontSize(9).fillColor('black').text(descriptions, { align: 'left', width: 250 });
                } else {
                    console.error(`Invalid academic experience at index ${index}.`);
                }
            });
        } else {
            console.error('Academic experiences are not defined or not an array.');
        }
    };
    const addReferencesSection = () => {
        if (referance && Array.isArray(referance)) {
            referance.forEach((ref, index) => {
                if (ref && typeof ref === 'object') {
                    if (index !== 0) {
                        doc.moveDown(0.2);
                    }
                    const jobTitle = Array.isArray(ref.jobTitle) ? ref.jobTitle.join(', ') : ref.jobTitle || "";
                    const city = Array.isArray(ref.city) ? ref.city.join(', ') : ref.city || "";
                    const employer = Array.isArray(ref.employer) ? ref.employer.join(', ') : ref.employer || "";

                    doc.font(RobotoBold).fontSize(9).fillColor('#000000').text(jobTitle, { align: 'left' });
                    doc.moveDown(0.1);
                    doc.font(Roboto).fontSize(9).fillColor('black').text(city, { align: 'left' });
                    doc.moveDown(0.1);
                    doc.font(RobotoBold).fontSize(9).fillColor('black').text(employer, { align: 'left' });
                } else {
                    console.error(`Invalid reference at index ${index}.`);
                }
            });
        } else {
            console.error('References are not defined or not an array.');
        }
    };

    addSection('İş tecrübesi', addExperiencesSection);
    addSection('Referanslar', addReferencesSection);
    addSection('Eğitim ve Nitelikler ', addAcademiSection);



}

module.exports = applyTemplate5;
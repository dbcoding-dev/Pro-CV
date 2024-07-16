const path = require('path');

function applyTemplate2(doc, name, surname,
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

    // Background Çizilen Kısmı
    doc.rect(0, 0, 200, 1920).fill('#bf5c46');
    doc.rect(0, 0, 1920, 50).fill('#bf5c46');
    doc.rect(35, 30, 500, 170).fill('#ffffff');


    // Adı-Soyadı
    const fontSize = 20;
    const text = `${name} ${surname}`;
    const textWidth = doc.font(RobotoBold).widthOfString(text, { size: fontSize });
    const centerX = (doc.page.width - textWidth) / 2;

    const verticalOffset = 50;
    const verticalOffsets = 85;

    doc.fillColor('black').fontSize(fontSize).text(text, centerX + 30, verticalOffset - 10, { align: 'left' });
    doc.fillColor('black').font(Roboto).fontSize(16).text(position, centerX + 30, verticalOffset + 35, { align: 'left', });
    doc.fillColor('black').font(RobotoLight).fontSize(10).text(about, centerX + 30, verticalOffset + 65, { align: 'left', });

    const lineY = verticalOffsets + 25;
    doc.lineWidth(1).moveTo(centerX, lineY).lineTo(centerX + 300, lineY).strokeColor('#EEEDEB').stroke();


    // İletişim Bilgiler
    const contactInfoX = 35;
    const contactInfoY = 230;
    doc.x = contactInfoX;
    doc.y = doc.y + 10;

    doc.font(RobotoBold).fontSize(14).fillColor('white').text('İLETİŞİM BİLGİLERİ', { align: 'left' });
    // E-posta
    doc.moveDown(1);
    doc.font(RobotoBold).fontSize(9).fillColor('white').text(eposta, { align: 'left', width: 150 });
    doc.moveDown(0.5);
    // Telefon Numarası
    doc.font(RobotoBold).fontSize(9).fillColor('white').text(phonenumber, { align: 'left', width: 100 });
    doc.moveDown(0.5);
    // Konum
    doc.font(RobotoBold).fontSize(9).fillColor('white').text(`${address} / ${city} / ${posta}`, { align: 'left', width: 150 });
    doc.font(Roboto);
    doc.moveDown(0.5);
    // Website
    doc.font(RobotoBold).fontSize(9).fillColor('white').text(site, { align: 'left' });
    doc.font(Roboto);

    // Kişisel
    doc.font(RobotoBold).fontSize(14).fillColor('white').text('KİŞİSEL BİLGİLER', contactInfoX, doc.y + 10, { align: 'left' });
    doc.moveDown(0.5);
    doc.font(RobotoBold).fontSize(9).fillColor('white').text('• ' + 'Doğum Yeri: ' + birth, { align: 'left', width: 200 });
    doc.font(RobotoBold).fontSize(9).fillColor('white').text('• ' + 'Askerlik: ' + asker.toLowerCase(), { align: 'left', width: 200 });
    doc.font(RobotoBold).fontSize(9).fillColor('white').text('• ' + 'Ehliyet: ' + surucu.toLowerCase(), { align: 'left', width: 200 });
    doc.font(RobotoBold).fontSize(9).fillColor('white').text('• ' + 'Medeni Durum: ' + medeni.toLowerCase(), { align: 'left', width: 200 });
    doc.font(RobotoBold).fontSize(9).fillColor('white').text('• ' + 'Cinsiyet: ' + gender, { align: 'left', width: 200 });
    doc.font(RobotoBold).fontSize(9).fillColor('white').text('• ' + 'Doğum Günü: ' + date, { align: 'left', width: 200 });


    // Yetenekler
    doc.font(RobotoBold).fontSize(14).fillColor('white').text('YETENEKLER', contactInfoX, doc.y + 10, { align: 'left' });
    const maxSkillsToShow = 5;


    if (skilles && Array.isArray(skilles)) {
        for (let index = 0; index < Math.min(skilles.length, maxSkillsToShow); index++) {
            const skill = skilles[index];
            if (skill && typeof skill === 'string') {
                if (index !== 0) {
                    doc.moveDown(0.5);
                }
                const skillLines = skill.split(',').map(line => line.trim());
                doc.y = doc.y + 5;
                doc.font(Roboto)
                    .fontSize(12)
                    .fillColor('white')
                    .lineGap(6)
                    .text(`- ${skillLines.join('\n- ')}`, { align: 'left' });
            } else {
                console.error(`Invalid skill at index ${index}.`);
            }
        }
    } else {
        console.error('Skills are not defined or not an array.');
    }

    // Dil Becerleri
    doc.moveDown(1);
    doc.font(RobotoBold).fontSize(14).fillColor('#4b30c9').text('Yabancı Dil', 400, 590, { align: 'left' });
    doc.moveDown(0.5);

    if (langs && Array.isArray(langs)) {
        langs.forEach((langg, index) => {
            if (typeof langg === 'string') {
                if (index !== 0) {
                    doc.moveDown(1);
                }
                const langText = langg;
                const langLines = langText.split(',').map(line => line.trim());
                doc.font(RobotoBold)
                    .fontSize(10)
                    .fillColor('black')
                    .lineGap(6)
                    .text(`• ${langLines.join('\n• ')}`, { align: 'left', width: 200 });
            } else if (typeof langg === 'object' && langg.lang) {
                if (index !== 0) {
                    doc.moveDown(1);
                }
                const langText = langg.lang;
                const langLines = langText.split(',').map(line => line.trim());
                doc.font(RobotoBold)
                    .fontSize(10)
                    .fillColor('black')
                    .lineGap(6)
                    .text(`• ${langLines.join('\n• ')}`, { align: 'left', width: 200 });
            } else {
                console.error(`Invalid lang at index ${index}.`);
            }
        });
    } else {
        console.error('Languages are not defined or not an array.');
    }



    if (photoBuffer) {
        doc.image(photoBuffer, 60, 45, { width: 140, height: 140 });
    }

    const contactRefX = 35;
    const contactRefY = 230;
    doc.x = contactRefX;
    doc.y = contactRefY;

    const addSection = (title, content) => {
        const startX = 250;
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

module.exports = applyTemplate2;
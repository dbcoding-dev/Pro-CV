
const path = require('path');
function applyTemplate1(doc, name, surname,
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

    const photoPath = path.join(__dirname, '../../public/assets/bg.png');

    // Adı Soyadı
    const verticalOffset = 80;
    const fontSize = 25;
    const text = `${name} ${surname}`;
    const textWidth = doc.font(RobotoBold).widthOfString(text, { size: fontSize });
    doc.fillColor('#4b30c9').fontSize(fontSize).text(text, 50, verticalOffset, { align: 'left', width: 300 });
    doc.fillColor('black').font(RobotoBold).fontSize(20).text(position, 50, verticalOffset + 60, { align: 'left', width: 300 });
    doc.fillColor('black').font(Roboto).fontSize(9).text(date, 50, verticalOffset + 85, { align: 'left', width: 300 });
    doc.fillColor('black').font(RobotoLight).fontSize(10).text(about, 50, verticalOffset + 95, { align: 'left', width: 330 });

    // İletişim Bilgileri
    const contactInfoX = 400;
    const contactInfoY = 290;
    doc.x = contactInfoX;
    doc.y = contactInfoY;

    doc.font(RobotoBold).fontSize(14).fillColor('#4b30c9').text('İletişim Bilgileri', { align: 'left' });

    // E-posta
    doc.moveDown(0.8);
    doc.font(Roboto).fontSize(9).fillColor('black').text('• ' + eposta.toLowerCase(), { align: 'left', width: 200 });
    // Telefon Numarası
    doc.moveDown(0.4);
    doc.font(Roboto).fontSize(9).fillColor('black').text('• ' + phonenumber.toLowerCase(), { align: 'left', width: 200 });
    // Konum
    doc.moveDown(0.4);
    doc.font(Roboto).fontSize(9).fillColor('black').text('• ' + `${address.toLowerCase()} / ${city.toLowerCase()} / ${posta.toLowerCase()}`, { align: 'left', width: 200 });
    // Website
    doc.moveDown(0.4);
    doc.font(Roboto).fontSize(9).fillColor('black').text('• ' + site.toLowerCase(), { align: 'left', width: 200 });
    // Kişisel Bilgiler
    doc.font(RobotoBold).fontSize(14).fillColor('#4b30c9').text('Kişisel Bilgileri', 400, 390, { align: 'left', width: 100 });
    // Doğum Yeri
    doc.moveDown(0.4);
    doc.font(Roboto).fontSize(9).fillColor('black').text('• ' + 'Doğum Yeri: ' + birth.toLowerCase(), { align: 'left', width: 200 });
    // Askerlik
    doc.moveDown(0.4);
    doc.font(Roboto).fontSize(9).fillColor('black').text('• ' + 'Askerlik: ' + asker.toLowerCase(), { align: 'left', width: 200 });
    // Ehliyet
    doc.moveDown(0.4);
    doc.font(Roboto).fontSize(9).fillColor('black').text('• ' + 'Ehliyet: ' + surucu.toLowerCase(), { align: 'left', width: 200 });
    // Ehliyet
    doc.moveDown(0.4);
    doc.font(Roboto).fontSize(9).fillColor('black').text('• ' + 'Medeni Durum: ' + medeni.toLowerCase(), { align: 'left', width: 200 });
    // Cinsiyet 
    doc.moveDown(0.4);
    doc.font(Roboto).fontSize(9).fillColor('black').text('• ' + 'Cinsiyet: ' + gender, { align: 'left', width: 200 });
    // Alt
    if (photoPath) {
        const photoWidth = 150;
        const photoHeight = 150;
        const photoY = 650
        doc.image(photoPath, 480, photoY, { width: photoWidth, height: photoHeight });
    }

    // Fotoğraf
    if (photoBuffer) {
        doc.image(photoBuffer, 400, 70, { width: 150, height: 150 });
    }

    // Yan çizgiler 
    const lineY = 300;
    const pointSize = 3;
    doc.lineCap('butt').lineWidth(1.5).moveTo(0, lineY).lineTo(80, lineY).stroke('#4b30c9');
    doc.circle(80, lineY, pointSize).fill('#4b30c9');
    // Dil Becerleri
    doc.moveDown(1);
    doc.font(RobotoBold).fontSize(14).fillColor('#4b30c9').text('Yabancı Dil', 400, 590, { align: 'left' });
    doc.moveDown(0.5);

    if (langs && Array.isArray(langs)) {
        langs.forEach((langg, index) => {
            if (langg && typeof langg === 'object' && langg.lang) {
                if (index !== 0) {
                    doc.moveDown(1);
                }
                const langText = `${langg.lang}`;
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
    // Yetkinlikler
    doc.moveDown(1);
    doc.font(RobotoBold).fontSize(14).fillColor('#4b30c9').text('Yetkinlikler', 400, 490, { align: 'left', width: 100 });

    if (skilles && Array.isArray(skilles)) {
        skilles.forEach((skill, index) => {
            if (skill && typeof skill === 'object' && skill.skil) {
                if (index !== 0) {
                    doc.moveDown(1);
                }
                const skillText = `${skill.skil}`;
                const skillLines = skillText.split(',').map(line => line.trim());

                doc.font(RobotoBold)
                    .fontSize(10)
                    .fillColor('black')
                    .lineGap(5)
                    .text(`• ${skillLines.join('\n• ')}`, { align: 'left', width: 200 });
            } else {
                console.error(`Invalid skill at index ${index}.`);
            }
        });
    } else {
        console.error('Skills are not defined or not an array.');
    }

    const contactRefX = 35;
    const contactRefY = 290;
    doc.x = contactRefX;
    doc.y = contactRefY;

    const addSection = (title, content) => {
        const startX = 100;
        const startY = (doc.y !== undefined && doc.y !== null) ? doc.y : 30;

        doc.font(RobotoBold).fontSize(16).fillColor('#4b30c9').text(title, startX, startY, { align: 'left' });
        doc.moveDown(0.1);
        content();
    };

    const addExperiencesSection = () => {
        if (experiences && Array.isArray(experiences)) {
            experiences.forEach((experience, index) => {
                if (experience && typeof experience === 'object') {
                    if (index !== 0) {
                        doc.moveDown(0.1);
                    }
                    const jobTitles = Array.isArray(experience.jobTitle) ? experience.jobTitle : [experience.jobTitle];
                    const employers = Array.isArray(experience.employer) ? experience.employer : [experience.employer];
                    const startDates = Array.isArray(experience.startDate) ? experience.startDate : [experience.startDate];
                    const endDates = Array.isArray(experience.endDate) ? experience.endDate : [experience.endDate];
                    const descriptions = Array.isArray(experience.description) ? experience.description : [experience.description];
                    jobTitles.forEach((title, i) => {
                        doc.font(RobotoBold).fontSize(11).fillColor('#4b30c9').text(`${title}`, { align: 'left', width: 200 });
                        doc.moveDown(0.1);
                        doc.font(RobotoBold).fontSize(9).fillColor('black').text(`${employers[i]}`, { align: 'left', width: 250 });
                        doc.moveDown(0.1);
                        doc.font(RobotoBold).fontSize(9).fillColor('#000000').text(`${startDates[i]} - ${endDates[i]}`, { align: 'left', });
                        doc.moveDown(0.1);
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
                        doc.moveDown(0.1);
                    }
                    const jobTitle = Array.isArray(ref.jobTitle) ? ref.jobTitle.join(', ') : ref.jobTitle || "";
                    const city = Array.isArray(ref.city) ? ref.city.join(', ') : ref.city || "";
                    const employer = Array.isArray(ref.employer) ? ref.employer.join(', ') : ref.employer || "";

                    doc.font(RobotoBold).fontSize(9).fillColor('#4b30c9').text(jobTitle, { align: 'left' });
                    doc.moveDown(0.2);
                    doc.font(RobotoBold).fontSize(9).fillColor('black').text(employer, { align: 'left' });
                    doc.moveDown(0.2);
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
                        doc.moveDown(0.1);
                    }
                    const jobTitle = Array.isArray(academis.title) ? academis.title.join(', ') : academis.title || "";
                    const lisans = Array.isArray(academis.lisans) ? academis.lisans.join(', ') : academis.lisans || "";
                    const employers = Array.isArray(academis.uni) ? academis.uni.join(', ') : academis.uni || "";
                    const startDates = Array.isArray(academis.start) ? academis.start.join(', ') : academis.start || "";
                    const endDates = Array.isArray(academis.end) ? academis.end.join(', ') : academis.end || "";
                    const descriptions = Array.isArray(academis.desc) ? academis.desc.join('\n') : academis.desc || "";
    
                    doc.font(RobotoBold).fontSize(11).fillColor('#4b30c9').text(jobTitle, { align: 'left', width: 200 });
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
    
    

    addSection('Eğitim ve Nitelikler', addAcademiSection);
    addSection('İş Deneyimi', addExperiencesSection);
    addSection('Referanslar', addReferencesSection);

}


module.exports = applyTemplate1;
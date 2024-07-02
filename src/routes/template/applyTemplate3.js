const path = require('path');


function applyTemplate3(doc, name, surname,
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

    doc.rect(0, 0, 1920, 1000).fill('#fef9f9');
    doc.rect(-2, 0, 1920, 150).fill('#fce7f1');
    doc.rect(50, 0, 200, 1920).fill('#edeefc');

    if (photoBuffer) {
        doc.image(photoBuffer, 80, 45, { width: 140, height: 140 });
    }

    // Adı
    const fontSize = 25;
    const text = `${name.toUpperCase()} ${surname.toUpperCase()}`;
    const textWidth = doc.font(RobotoBold).widthOfString(text, { size: fontSize });
    const centerX = (doc.page.width - textWidth) / 2;

    const verticalOffset = 50;

    doc.fillColor('#3C3633').fontSize(fontSize).text(text, centerX + 80, verticalOffset, { align: 'left', });
    doc.fillColor('#3C3633').font(RobotoItalic).fontSize(16).text(position, centerX + 80, verticalOffset + 60, { align: 'left', });


    // Hakkımda
    const contactInfoX = 300;
    const contactInfoY = 160;
    doc.x = contactInfoX;
    doc.y = contactInfoY;

    doc.font(RobotoBold).fontSize(22).fillColor('#3C3633').text('Hakkımda'.toUpperCase(), { align: 'left' });
    doc.fillColor('black').font(RobotoLight).fontSize(10).text(about, 270, verticalOffset + 150, { align: 'left', width: 330 });


    const contactInfosX = 70;
    const contactInfosY = 230;
    doc.x = contactInfosX;
    doc.y = contactInfosY;

    doc.font(RobotoBold).fontSize(14).fillColor('#3C3633').text('İletişim', { align: 'left' });
    // E-posta
    doc.moveDown(0.5);
    doc.font(RobotoLight).fontSize(10).fillColor('#3C3633').text(eposta, { align: 'left', width: 180 });
    doc.moveDown(0.5);
    // Telefon Numarası
    doc.font(RobotoLight).fontSize(10).fillColor('#3C3633').text(phonenumber, { align: 'left', width: 180 });
    doc.moveDown(0.5);
    // Konum
    doc.font(RobotoLight).fontSize(10).fillColor('#3C3633').text(`${address} / ${city} / ${posta}`, { align: 'left', width: 180 });
    // Website
    doc.moveDown(0.5);
    doc.font(RobotoLight).fontSize(10).fillColor('#3C3633').text(site, { align: 'left' });



    // Kişisel
    doc.moveDown(1);
    doc.font(RobotoBold).fontSize(14).fillColor('#3C3633').text('Kişisel', contactInfosX, contactInfosY + 110, { align: 'left' });

    doc.moveDown(0.4);
    doc.font(RobotoLight).fontSize(9).fillColor('#3C3633').text('• ' + 'Doğum Yeri: ' + birth.toLowerCase(), { align: 'left', width: 200 });
    // Askerlik
    doc.moveDown(0.4);
    doc.font(RobotoLight).fontSize(9).fillColor('#3C3633').text('• ' + 'Askerlik: ' + asker.toLowerCase(), { align: 'left', width: 200 });
    // Ehliyet
    doc.moveDown(0.4);
    doc.font(RobotoLight).fontSize(9).fillColor('#3C3633').text('• ' + 'Ehliyet: ' + surucu.toLowerCase(), { align: 'left', width: 200 });
    // Ehliyet
    doc.moveDown(0.4);
    doc.font(RobotoLight).fontSize(9).fillColor('#3C3633').text('• ' + 'Medeni Durum: ' + medeni.toLowerCase(), { align: 'left', width: 200 });
    // Cinsiyet 
    doc.moveDown(0.4);
    doc.font(RobotoLight).fontSize(9).fillColor('#3C3633').text('• ' + 'Cinsiyet: ' + gender, { align: 'left', width: 200 });
    // Doğum Günü 
    doc.moveDown(0.4);
    doc.font(RobotoLight).fontSize(9).fillColor('#3C3633').text('• ' + 'Doğum Günü: ' + date, { align: 'left', width: 200 });


    // Yetenekler
    doc.font(RobotoBold).fontSize(14).fillColor('#3C3633').text('Yetenekler', contactInfosX, doc.y + 10, { align: 'left' });
    const maxSkillsToShow = 5;

    if (skilles && Array.isArray(skilles)) {
        for (let index = 0; index < Math.min(skilles.length, maxSkillsToShow); index++) {
            const skill = skilles[index];
            if (skill && typeof skill === 'object' && skill.skil) {
                const skillText = `${skill.skil}`;
                const skillLines = skillText.split(',').map(line => line.trim());
                doc.y = doc.y + 5;
                doc.font(Roboto)
                    .fontSize(9)
                    .fillColor('#3C3633')
                    .lineGap(6)
                    .text(`- ${skillLines.join('\n- ')}`, { align: 'left' });
            } else {
                console.error(`Invalid skill at index ${index}.`);
            }
        }
    } else {
        console.error('Skills are not defined or not an array.');
    }

    doc.font(RobotoBold).fontSize(14).fillColor('#3C3633').text('Yabancı Dil ', contactInfosX, doc.y + 10, { align: 'left' });

    const maxLanguagesToShow = 5;
    let displayedLanguages = 0;

    if (langs && Array.isArray(langs)) {
        langs.forEach((langg, index) => {
            if (displayedLanguages < maxLanguagesToShow && langg && typeof langg === 'object' && langg.lang) {
                if (displayedLanguages !== 0) {
                    doc.moveDown(1);
                }
                const langText = `${langg.lang}`;
                const langLines = langText.split(',').map(line => line.trim());
                doc.y = doc.y + 5;
                doc.font(Roboto)
                    .fontSize(9)
                    .fillColor('#3C3633')
                    .lineGap(6)
                    .text(`- ${langLines.join('\n- ')}`, { align: 'left' });

                displayedLanguages++;
            } else {
                console.error(`Invalid lang at index ${index}.`);
            }
        });
    } else {
        console.error('Languages are not defined or not an array.');
    }



    const contactRefX = 40;
    const contactRefY = 300;
    doc.x = contactRefX;
    doc.y = contactRefY;

    const addSection = (title, content) => {
        const startX = 270;
        const startY = (doc.y !== undefined && doc.y !== null) ? doc.y : 0;
        doc.font(Roboto).fontSize(20).fillColor('#000000').text(title.toUpperCase(), startX, startY, { align: 'left' });
        content();
        const endY = doc.y + 10;
        doc.y = ( endY);
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


module.exports = applyTemplate3;
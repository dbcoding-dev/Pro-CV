function applyDefaultTemplate(doc, name, surname, eposta, phonenumber, address, photoBuffer, site, position, about, skilles, langs, referance, academi) {
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('lightgray');
    doc.fontSize(20).text('Default Template - Curriculum Vitae', { align: 'center', fillColor: 'blue' });
    doc.fillColor('black');
    doc.fontSize(14).text(`${name} ${surname}`, { fillColor: 'green' });
    doc.fontSize(14).text(`${eposta}`, { fillColor: 'red' });
    doc.fontSize(14).text(`${phonenumber}`, { fillColor: 'purple' });
    doc.fontSize(14).text(`${address}`, { fillColor: 'orange' });
    if (photoBuffer) {
        doc.image(photoBuffer, 100, 100, { width: 100, height: 100 });
    }
}

module.exports = applyDefaultTemplate;
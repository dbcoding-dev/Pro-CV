const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

class ContactController {
    static async sendEmail(req, res) {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'mobilcv45@gmail.com',
                    pass: 'wton ynyp dbvs eshh'
                }
            });

            const { name, surname, email, message } = req.body;

            const mailOptions = {
                from: 'mobilcv45@gmail.com',
                to: 'mobilcv45@gmail.com',
                subject: 'İletişim Formundan Gelenler',
                text: `Adı: ${name}\nSoyadı: ${surname}\nE-posta: ${email}\nMesajı: ${message}`
            };

            await transporter.sendMail(mailOptions);

            res.render('success', { message: 'Your message has been sent successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { message: 'An error occurred while sending email' });
        }
    }
}

module.exports = ContactController;

const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const PdfUsers = require("../models/pdfuser.model")(sequelize, DataTypes);
const SubscriptionRequest = require("../models/subscriptionRequest.model")(sequelize, DataTypes);
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER, // Gönderen e-posta adresiniz
        pass: process.env.EMAIL_PASS // Gönderen e-posta şifreniz
    }
});




class SubscriptionCancelController {
    static async cancelSubscription(req, res) {
        const { email } = req.body;

        try {
            // PdfUsers modelinden kullanıcıyı e-posta adresine göre bul
            const user = await PdfUsers.findOne({ where: { email: email } });

            if (!user) {
                // Kullanıcı bulunamazsa hata mesajı göster
                req.flash('error', 'Kullanıcı bulunamadı.');
                return res.redirect('/cancel-subscription');
            }

            // Aynı e-posta ile bir iptal talebi var mı kontrol et
            const existingRequest = await SubscriptionRequest.findOne({ where: { email: email } });
            if (existingRequest) {
                req.flash('error', 'Bu e-posta ile zaten bir iptal talebi var.');
                return res.redirect('/cancel-subscription');
            }

            // Yeni bir iptal talebi oluştur
            await SubscriptionRequest.create({ email: email });

            req.flash('success', 'Abonelik iptal talebiniz alındı.');
            res.redirect('/cancel-subscription');
        } catch (error) {
            console.error('Abonelik iptal talebi sırasında hata oluştu:', error);
            req.flash('error', 'Abonelik iptal talebi sırasında bir hata oluştu.');
            res.redirect('/cancel-subscription');
        }
    }

    static getCancelSubscriptionPage(req, res) {
        res.render('cancel-subscription');
    }

    static async getSubscriptionRequests(req, res) {
        try {
            const requests = await SubscriptionRequest.findAll();
            res.render('panel/subscription/index', { requests: requests });
        } catch (error) {
            console.error('Abonelik iptal talepleri getirilirken hata oluştu:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async handleSubscriptionRequest(req, res) {
        try {
            const { id, action } = req.params;
            const request = await SubscriptionRequest.findByPk(id);

            if (!request) {
                return res.status(404).send('Talep bulunamadı');
            }

            let emailSubject;
            let emailText;

            if (action === 'approve') {
                await request.update({ status: 'approved' });
                const user = await PdfUsers.findOne({ where: { email: request.email } });
                if (user) {
                    await user.destroy();
                }
                emailSubject = 'Abonelik İptali Onaylandı';
                emailText = `Merhaba, ${request.email} adresine ait abonelik iptal talebiniz onaylanmıştır. 
Artık sitemizden abonelik hizmeti almıyorsunuz.

İyi günler dileriz.

Saygılarımızla, ProCv Ekibi
                `;
            } else if (action === 'reject') {
                await request.update({ status: 'rejected' });
                emailSubject = 'Abonelik İptali Reddedildi';
                emailText = `Merhaba, ${request.email} adresine ait abonelik iptal talebiniz reddedilmiştir. 
Daha fazla bilgi için lütfen bizimle iletişime geçin. 

İyi günler dileriz. 

Saygılarımızla, ProCv Ekibi`;
            }

            // E-posta gönderme
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: request.email,
                subject: emailSubject,
                text: emailText
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                } else {
                }
            });

            req.flash('success', 'Subscription request has been updated successfully.');
            res.redirect('/panel/subscription-requests');
        } catch (error) {
            console.error('Subscription request could not be updated:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = { SubscriptionCancelController };
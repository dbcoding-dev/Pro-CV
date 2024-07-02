const { DataTypes, Op } = require("sequelize");
const { sequelize } = require("../models");
const User = require("../models/pdfuser.model")(sequelize, DataTypes);
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { blockIP, blockedIPs, blockDuration } = require('../middleware/ipfilter');
const failedAttempts = {};

class UserController {
    static async RegisterUser(req, res) {
        try {
            const { username, email, password} = req.body;
            if (!username || !email || !password) {
                return res.status(400).render('register', { error: 'Lütfen tüm alanları doldurunuz!' });
            }
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).render('register', { error: 'Bu email ile kayıtlı bir kullanıcı zaten var' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ username, email, password: hashedPassword});
            res.redirect('/register-success');
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async LoginUser(req, res) {
        const ip = req.ip;
        if (blockedIPs[ip]) {
            const timeBlocked = blockedIPs[ip].time;
            const timePassed = Date.now() - timeBlocked;
            const timeLeft = blockDuration - timePassed;
            const minutesLeft = Math.floor(timeLeft / 60000);
            const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
            return res.status(200).render('login', {
                error: `Çok fazla başarısız deneme. Lütfen ${minutesLeft} dakika ${secondsLeft} saniye sonra tekrar deneyin.`
            });
        }
        try {
            const { email, password } = req.body;
            const existingUser = await User.findOne({ where: { email } });
            if (!existingUser) {
                failedAttempts[ip] = (failedAttempts[ip] || 0) + 1;
                const remainingAttempts = 5 - failedAttempts[ip];
                if (failedAttempts[ip] >= 5) {
                    blockIP(ip);
                    const timeBlocked = blockedIPs[ip].time;
                    const timePassed = Date.now() - timeBlocked;
                    const timeLeft = blockDuration - timePassed;
                    const minutesLeft = Math.floor(timeLeft / 60000);
                    const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
                    return res.status(200).render('login', {
                        error: `Çok fazla başarısız deneme. Lütfen ${minutesLeft} dakika ${secondsLeft} saniye sonra tekrar deneyin.`
                    });
                }
                return res.status(200).render('login', {
                    error: `Geçersiz eposta veya şifre. Kalan deneme hakkınız: ${remainingAttempts}`
                });
            }
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                failedAttempts[ip] = (failedAttempts[ip] || 0) + 1;
                const remainingAttempts = 5 - failedAttempts[ip];
                if (failedAttempts[ip] >= 5) {
                    blockIP(ip);
                    const timeBlocked = blockedIPs[ip].time;
                    const timePassed = Date.now() - timeBlocked;
                    const timeLeft = blockDuration - timePassed;
                    const minutesLeft = Math.floor(timeLeft / 60000);
                    const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
                    return res.status(200).render('login', {
                        error: `Çok fazla başarısız deneme. Lütfen ${minutesLeft} dakika ${secondsLeft} saniye sonra tekrar deneyin.`
                    });
                }
                return res.status(200).render('login', {
                    error: `Geçersiz eposta veya şifre. Kalan deneme hakkınız: ${remainingAttempts}`
                });
            }
            failedAttempts[ip] = 0;
            req.session.user = existingUser;
            res.redirect('/create-cv');
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { error: 'Sunucu Hatası' });
        }
    }

    static async LogoutUser(req, res) {
        try {
            req.session.destroy(err => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    res.redirect('/register');
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async GetRegister(req, res) {
        res.render("register");
    }

    static async requestPasswordReset(req, res) {
        const { email } = req.body;
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(400).render('password/password-reset', { error: 'E-posta adresi bulunamadı.' });
            }

            const token = crypto.randomBytes(20).toString('hex');
            const resetPasswordExpires = Date.now() + 3600000; // 1 saat

            await User.update(
                { resetPasswordToken: token, resetPasswordExpires },
                { where: { email } }
            );

            const transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                to: user.email,
                from: process.env.EMAIL_USER,
                subject: `Pro CV Parola Sıfırlama Talebi`,
                text: `Parolanızı sıfırlamak için şu bağlantıya tıklayın:\n\n` +
                    `http://${req.headers.host}/auth/reset/${token}\n\n` +
                    `Eğer bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.\n`
            };

            await transporter.sendMail(mailOptions);
            res.status(200).render('password/password-reset', { success: 'Parola sıfırlama e-postası gönderildi.' });
        } catch (error) {
            console.error(error);
            res.status(500).render('password/password-reset', { error: 'Sunucu hatası.' });
        }
    }

    static async resetPassword(req, res) {
        const { token } = req.params;
        try {
            const user = await User.findOne({
                where: {
                    resetPasswordToken: token,
                    resetPasswordExpires: { [Op.gt]: Date.now() }
                }
            });

            if (!user) {
                return res.status(400).render('password/reset', { error: 'Parola sıfırlama tokenı geçersiz veya süresi dolmuş.' });
            }

            res.render('password/reset', { token }); // token'ı burada geçiyoruz
        } catch (error) {
            console.error(error);
            res.status(500).render('password/reset', { error: 'Sunucu hatası.' });
        }
    }

    static async updatePassword(req, res) {
        const { token } = req.params;
        const { password } = req.body;

        try {
            const user = await User.findOne({
                where: {
                    resetPasswordToken: token,
                    resetPasswordExpires: { [Op.gt]: Date.now() }
                }
            });

            if (!user) {
                return res.status(400).render('password/reset', { error: 'Parola sıfırlama tokenı geçersiz veya süresi dolmuş.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await User.update(
                {
                    password: hashedPassword,
                    resetPasswordToken: null,
                    resetPasswordExpires: null
                },
                { where: { id: user.id } }
            );

            res.status(200).render('login', { success: 'Parola başarıyla güncellendi.' });
        } catch (error) {
            console.error(error);
            res.status(500).render('password/reset', { error: 'Sunucu hatası.' });
        }
    }

    static async GetForgotPassword(req, res) {
        res.render('password/password-reset');
    }

    static async Getprofile(req, res) {
        res.render('profile/profile');
    }

    static async UpdateProfile(req, res) {
        const { username, email, password } = req.body;
        try {
            const updatedData = {
                username,
                email,
            };
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                updatedData.password = hashedPassword;
            }
            await User.update(updatedData, { where: { id: req.session.user.id } });
            const updatedUser = await User.findByPk(req.session.user.id);
            req.session.user = updatedUser;
            res.status(200).render('profile/profile', { user: updatedUser, success: 'Profil başarıyla güncellendi.' });
        } catch (error) {
            console.error(error);
            res.status(500).render('profile/profile', { user: req.session.user, error: 'Sunucu hatası.' });
        }
    }

    static async RequestDeleteAccount(req, res) {
        try {
            const user = await User.findByPk(req.session.user.id);
            if (!user) {
                return res.status(400).json({ error: 'Kullanıcı bulunamadı.' });
            }
    
            const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6 haneli doğrulama kodu
            const deleteAccountExpires = Date.now() + 3600000; // 1 saat
    
            await User.update(
                { deleteAccountToken: token, deleteAccountExpires },
                { where: { id: req.session.user.id } }
            );
    
            const transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
    
            const mailOptions = {
                to: user.email,
                from: process.env.EMAIL_USER,
                subject: `Hesap Silme Talebi`,
                text: `Hesabınızı silmek için doğrulama kodunu kullanın:\n\n` +
                    `Doğrulama Kodu: ${token}\n\n` +
                    `Eğer bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.\n`
            };
    
            await transporter.sendMail(mailOptions);
            res.status(200).render('profile/delete-account-verify', { success: 'Hesap silme doğrulama kodu e-postası gönderildi.' });
        } catch (error) {
            console.error(error);
            res.status(500).render('profile/delete-account-verify', { error: 'Sunucu hatası.' });
        }
    }
    
    static async ConfirmDeleteAccount(req, res) {
        const { token } = req.body;
        try {
            const user = await User.findOne({
                where: {
                    deleteAccountToken: token,
                    deleteAccountExpires: { [Op.gt]: Date.now() }
                }
            });
    
            if (!user) {
                return res.status(400).render('profile/delete-account-verify', { error: 'Hesap silme doğrulama kodu geçersiz veya süresi dolmuş.' });
            }
    
            await User.destroy({ where: { id: user.id } });
    
            req.session.destroy(err => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    res.redirect('/');
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).render('profile/delete-account-verify', { error: 'Sunucu hatası.' });
        }
    }

    static async GetRegisterSuccess(req, res) {
        res.render('password/register-success');
    }
}

module.exports = { UserController };

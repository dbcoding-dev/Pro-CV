
const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Iyzico = require("../models/iyzico.model")(sequelize, DataTypes);
const Stripe = require("../models/stripe.model")(sequelize, DataTypes);

class IyzicoController {
    static async createPayment(req, res) {
        const successMessage = req.query.success || null;
        const errorMessage = req.query.error || null;
        const sucessStripe = req.query.stripe || null;
        const errorStripe = req.query.errorstripe || null;
        const iyzico = await Iyzico.findOne();
        const stripe = await Stripe.findOne();
        res.render('panel/payment/index.ejs', {
            successMessage: successMessage,
            errorMessage: errorMessage,
            sucessStripe: sucessStripe,
            errorStripe: errorStripe,
            iyzico: iyzico,
            stripe: stripe
        });
    }

    static async createIyzicoapi(req, res) {
        try {
            const { api_key, secret_key } = req.body;
            const iyzico = await Iyzico.findOne();

            if (iyzico) {
                // Mevcut kayıt varsa güncelle
                iyzico.api_key = api_key;
                iyzico.secret_key = secret_key;
                await iyzico.save();
                res.redirect('/panel/payment?success=Iyzico API updated successfully.');
            } else {
                // Yeni kayıt oluştur
                await Iyzico.create({
                    api_key,
                    secret_key
                });
                res.redirect('/panel/payment?success=Iyzico API created successfully.');
            }
        } catch (error) {
            console.error('Error updating Iyzico API:', error);
            res.redirect('/panel/payment?error=Error updating Iyzico API.');
        }
    }

    static async createStripeapi(req, res) {
        try {
            const { api_key, secret_key } = req.body;
            const stripe = await Stripe.findOne();

            if (stripe) {
                // Mevcut kayıt varsa güncelle
                stripe.api_key = api_key;
                stripe.secret_key = secret_key;
                await stripe.save();
                res.redirect('/panel/payment?stripe=Stripe API updated successfully.');
            } else {
                // Yeni kayıt oluştur
                await Stripe.create({
                    api_key,
                    secret_key
                });
                res.redirect('/panel/payment?stripe=Stripe API created successfully.');
            }
        } catch (error) {
            console.error('Error updating Stripe API:', error);
            res.redirect('/panel/payment?errorstripe=Error updating Stripe API.');
        }
    }
}

module.exports = { IyzicoController };

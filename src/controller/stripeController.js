const dotenv = require('dotenv');
dotenv.config();
const { DataTypes } = require('sequelize');
const { sequelize } = require('../models');
const PdfUser = require('../models/pdfuser.model')(sequelize, DataTypes);
const Payment = require('../models/stripepayment.model')(sequelize, DataTypes);
const ApiKey = require("../models/stripe.model")(sequelize, DataTypes);

class StripeController {
    static async createPaymentIntent(req, res) {
        try {
            const apiKeyRecord = await ApiKey.findOne({ order: [['createdAt', 'ASC']] });
            if (!apiKeyRecord) {
                return res.status(500).send({ error: 'API Key not found' });
            }

            const stripe = require('stripe')(apiKeyRecord.secret_key);

            const { userId } = req.body;
            if (!userId) {
                return res.status(400).send({ error: 'userId is required' });
            }

            const user = await PdfUser.findByPk(userId);
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }
            // Kullanıcının geldiği sayfayı HTTP referer başlığından al
            const referer = req.headers.referer || `${process.env.CLIENT_URL}/default-cancel`;


            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: apiKeyRecord.line_items,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${process.env.CLIENT_URL}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: referer,
                metadata: {
                    userId: userId // Kullanıcı ID'sini metadata içinde saklayın
                }
            });

            res.redirect(303, session.url);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: error.message || 'An unknown error occurred' });
        }
    }
    static async handleSuccess(req, res) {
        try {
            const apiKeyRecord = await ApiKey.findOne({ where: { /* burada gerekli koşulu belirtin */ } });
            if (!apiKeyRecord) {
                return res.status(500).send({ error: 'API Key not found' });
            }

            const stripe = require('stripe')(apiKeyRecord.secret_key);

            const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

            const userId = parseInt(session.metadata.userId, 10);

            const user = await PdfUser.findByPk(userId);
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }

            const existingPayment = await Payment.findOne({ where: { stripeSessionId: session.id } });
            if (existingPayment) {
                return res.render('stripe/success', { session });
            }

            await Payment.create({
                userId: userId,
                stripeSessionId: session.id,
                amount: session.amount_total,
                currency: session.currency,
                status: session.payment_status,
                subscriptionId: session.subscription,
                paymentType: 'stripe',
            });

            res.render('stripe/success', { session });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: error.message || 'An unknown error occurred' });
        }
    }
}

module.exports = StripeController;

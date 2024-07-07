const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Plan = require("../models/plan.model")(sequelize, DataTypes);
const Subscription = require("../models/subscription.model")(sequelize, DataTypes);
const Iyzipay = require('iyzipay');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
dotenv.config();

class PaymentController {
    constructor() {
        this.iyzipay = new Iyzipay({
            apiKey: process.env.IYZICO_API_KEY || "sandbox-dpPUlMuotXeh7y5PLJtRgPhYEaUjBQxS",
            secretKey: process.env.IYZICO_SECRET_KEY || "sandbox-XcyuaXhyYnnxBgpTpKR55uFoEq6XKpFj",
            uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
        });
    }

    static async createPayment(req, res) {
        res.render('payment/payment.ejs');
    }

    // Ürün (Plan) Oluşturma
    async createPlan(req, res) {
        const { name, price, interval } = req.body;

        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: uuidv4(),
            name,
            description: `Plan: ${name}`
        };

        this.iyzipay.subscriptionProduct.create(request, async (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            try {
                const newPlan = await Plan.create({
                    name,
                    price,
                    interval
                });
                res.status(201).json(newPlan);
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        });
    }

    async createSubscription(req, res) {
        const { userId, pricingPlanReferenceCode, cardHolderName, cardNumber, expiryMonth, expiryYear, cvc } = req.body;

        const id = uuidv4();

        const subscription = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: id,
            pricingPlanReferenceCode: pricingPlanReferenceCode,
            customer: {
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                gsmNumber: '+905350000000',
                identityNumber: '74300864791',
                billingAddress: {
                    contactName: 'John Doe',
                    city: 'Istanbul',
                    country: 'Turkey',
                    address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                    zipCode: '34742'
                },
                shippingAddress: {
                    contactName: 'John Doe',
                    city: 'Istanbul',
                    country: 'Turkey',
                    address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                    zipCode: '34742'
                }
            },
            paymentCard: {
                cardHolderName: cardHolderName,
                cardNumber: cardNumber,
                expireMonth: expiryMonth.split('/')[0],
                expireYear: expiryYear.split('/')[1],
                cvc: cvc
            }
        };

        this.iyzipay.subscription.create(subscription, async (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            try {
                const newSubscription = await Subscription.create({
                    userId: userId,
                    pricingPlanReferenceCode: pricingPlanReferenceCode,
                    referenceCode: result.data.referenceCode,
                    status: result.data.status
                });
                res.status(201).json(newSubscription);
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        });
    }

    // Abonelik Detayları
    async getSubscription(req, res) {
        try {
            const { userId } = req.params;
            const subscriptions = await Subscription.findAll({ where: { userId } });
            res.status(200).json(subscriptions);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
}

module.exports = { PaymentController };

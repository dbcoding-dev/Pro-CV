const Iyzipay = require('iyzipay');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
dotenv.config();

class PaymentController {

    constructor() {
        this.iyzipay = new Iyzipay({
            apiKey: "sandbox-lfgYlzOMRmanLDH8vUPqT7EZoI7gKN9i",
            secretKey: "sandbox-x6muZECgP1qQbneyMCumYaazg03oaOco",
            uri: 'https://sandbox-api.iyzipay.com'
        });

        // Örnek planlar
        this.plans = [
            {
                name: 'Basic Plan',
                price: 9.99,
                interval: 'MONTHLY',
                productReferenceCode: 'product_ref_code_1'
            },
            {
                name: 'Premium Plan',
                price: 19.99,
                interval: 'MONTHLY',
                productReferenceCode: 'product_ref_code_2'
            }
        ];
    }

    createPayment(req, res) {
        res.render('payment/payment.ejs', { plans: this.plans });
    }

    async createPlan(req, res) {
        const { name, price, interval } = req.body;

        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: uuidv4(),
            name: name,
            description: `Plan: ${name}`
        };

        this.iyzipay.subscriptionProduct.create(request, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            try {
                this.plans.push({
                    name,
                    price,
                    interval,
                    productReferenceCode: result.productReferenceCode
                });
                res.status(201).json({ message: 'Plan created successfully', plan: result });
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        });
    }

    async createSubscription(req, res) {
        const { cardHolderName, cardNumber, expiryMonth, expiryYear, cvc, registerCard } = req.body;

        if (!expiryMonth || !expiryYear) {
            return res.status(400).json({ error: 'Expiry month and year are required' });
        }
        const subscription = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: uuidv4(),
            callbackUrl: 'callbackUrl',
            pricingPlanReferenceCode: '2af0eee5-22c3-40c8-91b8-7c64ccb9ab12',
            subscriptionInitialStatus: Iyzipay.SUBSCRIPTION_INITIAL_STATUS.PENDING,
            paymentCard: {
                cardHolderName: cardHolderName,
                cardNumber: cardNumber,
                expireMonth: expiryMonth,
                expireYear: expiryYear,
                cvc: cvc,
                registerCard: registerCard ? 1 : 0
            },
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
        };

        this.iyzipay.subscription.initialize(subscription, (err, result) => {
            if (err) {
                console.error('API Error:', err);
                return res.status(500).json(err);
            }

            if (result.status === 'failure') {
                console.error('API Error:', result.errorMessage);
                return res.status(500).json({
                    errorCode: result.errorCode,
                    errorMessage: result.errorMessage,
                    status: result.status,
                    systemTime: result.systemTime
                });
            }

            try {
                console.log('Subscription Result:', result);
                res.status(201).json({ message: 'Subscription created successfully', subscription: result });
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        });
    }

    async getSubscription(req, res) {
        try {
            res.status(200).json({ message: 'No subscriptions found' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
}

module.exports = { PaymentController };




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
        this.productReferenceCode = uuidv4();
        this.planReferenceCode = uuidv4();
    }

    async getCheckoutForm(req, res) {
        const { cardHolderName, cardNumber, expireMonth, expireYear, cvc, registerCard } = req.body;

        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: uuidv4(),
            price: '1',
            paidPrice: '1.2',
            currency: Iyzipay.CURRENCY.TRY,
            installment: '1',
            basketId: 'B67832',
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
            paymentCard: {
                cardHolderName: cardHolderName,
                cardNumber: cardNumber,
                expireMonth: expireMonth,
                expireYear: expireYear,
                cvc: cvc,
                registerCard: registerCard
            },
            buyer: {
                id: 'BY789',
                name: 'John',
                surname: 'Doe',
                gsmNumber: '+905350000000',
                email: 'email@email.com',
                identityNumber: '74300864791',
                lastLoginDate: '2015-10-05 12:43:35',
                registrationDate: '2013-04-21 15:12:09',
                registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                ip: '85.34.78.112',
                city: 'Istanbul',
                country: 'Turkey',
                zipCode: '34732'
            },
            shippingAddress: {
                contactName: 'John Doe',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                zipCode: '34742'
            },
            billingAddress: {
                contactName: 'John Doe',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                zipCode: '34742'
            },
            basketItems: [
                {
                    id: 'BI101',
                    name: 'Binocular',
                    category1: 'Collectibles',
                    category2: 'Accessories',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                    price: '0.3'
                },
                {
                    id: 'BI102',
                    name: 'Game code',
                    category1: 'Game',
                    category2: 'Online Game Items',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: '0.5'
                },
                {
                    id: 'BI103',
                    name: 'Usb',
                    category1: 'Electronics',
                    category2: 'Usb / Cable',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                    price: '0.2'
                }
            ]
        };

        this.iyzipay.payment.create(request, (err, result) => {
            if (err) {
                console.error(err);
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
                console.log('Payment Result:', result);
                res.status(201).json({ message: 'Payment created successfully', payment: result });
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        });
    }

}

module.exports = { PaymentController };

const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeController {
    static async createPaymentIntent(req, res) {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'T-shirt',
                            },
                            unit_amount: 2000,
                            recurring: {
                                interval: 'month',
                            },
                        },
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${process.env.CLIENT_URL}/success`,
                cancel_url: `${process.env.CLIENT_URL}/cancel`,
            });

            res.redirect(303, session.url);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: error.raw.message });
        }
    }
}

module.exports = StripeController;

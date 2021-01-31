const express = require('express');

const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51I5B7mLaXDcHpE2BKAPeNbNK9ZiHUVIaTI6D6YuXe1Mloa2F3GiIGXG0piKKs2vROyem94HywDr9ysJK0I8w0NRk00SZjaoGWh');

router.get('/pay', (req, res) => {
    res.render('payment', {title:'Subscribe'});
});

const calculateOrderAmount = items => {
    return 1000;
  };

router.post("/create-payment-intent", async (req, res) => {
const { items } = req.body;
// Create a PaymentIntent with the order amount and currency
const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    description: "Talents daily Subscribtion",
    currency: "SGD"
});

//const subscription = await stripe.subscriptions.create({
    // customer: 'cus_IgYpoVkOpGTxok',
    // items: [
    //   {price: 'price_1IFiirLaXDcHpE2BvXo7qCaw'},
    // ],
//});

res.send({
    clientSecret: paymentIntent.client_secret
});
});

module.exports = router;
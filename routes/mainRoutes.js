const express = require('express');
const bodyParser = require('body-parser')

const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51I5B7mLaXDcHpE2BKAPeNbNK9ZiHUVIaTI6D6YuXe1Mloa2F3GiIGXG0piKKs2vROyem94HywDr9ysJK0I8w0NRk00SZjaoGWh');

var jsonParser = bodyParser.json()

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

router.post('/create-subscription', jsonParser,  async (req, res) => {
    // Simulate authenticated user. In practice this will be the
    // Stripe Customer ID related to the authenticated user.
    const customerId = req.body.customerId;
  
    let paymentMethod;
    try {
      paymentMethod = await stripe.paymentMethods.attach(
        req.body.paymentMethodId, {
          customer: customerId,
        }
      );
    } catch (error) {
      return res.status(400).send({ error: { message: error.message } });
    }
  
    // Create the subscription
    const priceId = req.body.priceId;
  
    const subscription = await stripe.subscriptions.create({
      default_payment_method: paymentMethod.id,
      customer: customerId,
      items: [{
        price: priceId,
      }],
      expand: ['latest_invoice.payment_intent'],
    });
  
    res.send({ subscription });
  });
  

module.exports = router;
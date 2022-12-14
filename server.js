const express = require('express');
const cors = require('cors');
const app = express();
const { stripeKey } = require('./config/keys');

const stripe = require("stripe")(stripeKey);

app.use(express.static("public"));
app.use(express.json());
app.use(cors({}));

const calculateOrderAmount = items => {
    return items.reduce((a, c) => a + c.price * c.quantity, 0) * 100;
};

app.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;

    if(!items.length) {
      return res.status(400).send({
        msg: 'no items'
      });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd"
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret
    });
});

app.listen(4242, () => console.log('Node server listening on port 4242!'));
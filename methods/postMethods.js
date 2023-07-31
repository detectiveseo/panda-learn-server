const verifyJWT = require("./verifyJWT");
require('dotenv').config()
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`)

module.exports = postMethods = (app, classesCollections) => {

    app.post("/add-new-course", async (req, res) => {
        const body = req.body;
        const result = await classesCollections.insertOne(body);
        res.send(result);
        console.log(result)
    })

    // genarete clint secrate for stripe 
    app.post("/create-payment-intent", async (req, res) => {
        const { price } = req.body;
        const amount = price * 100;
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types: ['card']
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
          });

    })
}
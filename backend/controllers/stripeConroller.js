const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const paymentIntent = async (req, res) => {
  const { amount } = req.body;
  console.log("amount", amount);
  if (!amount) {
    return res.status(400).send({
      error: {
        message: "No Amount entered in Req body",
      },
    });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "INR",
      amount: amount,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
};

const getConfig = async (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};

module.exports = {
  paymentIntent,
  getConfig,
};

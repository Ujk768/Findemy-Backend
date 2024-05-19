const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const uuid = require("uuid");

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
      currency: "inr",
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

const createCheckoutSession = async (req, res) => {
  try {
    const cartItems = req.body;
    console.log(cartItems);
    if (cartItems) {
      try {
        const lineItems = cartItems.map((item) => ({
          price_data: {
            currency: "inr",
            product_data: {
              name: item.title,
              images: [item.thumbnail],
            },
            unit_amount: (Math.round(item.discountedPrice)) * 100,
          },
          quantity: 1,
        }));
        const session = await stripe.checkout.sessions.create({
          line_items: lineItems ? lineItems : [],
          mode: "payment",
          shipping_address_collection: {
            allowed_countries: ["IN"],
          },
          payment_method_types: ["card"],
          success_url: `${process.env.FRONT_END_BASE_URL}/success`,
          cancel_url: `${process.env.FRONT_END_BASE_URL}/`,
        });
        res.json({ id: session.id });
      } catch (err) {
        console.log(err);
        res.status(400).send({
          message: err.message,
        });
      }
    } else {
      res.status(400).send("cart details not passed in req body");
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

const createCustomer = async (req, res) => {
  const { custName, custId } = req.body;
  try {
    const customer = await stripe.customers.create({
      name: custName,
      //   id: custId,
      address: {
        // line1: address.line1,
        // city: address.city,
        // postal_code: address.postal_code,
        // state: address.state,
        country: "IN",
      },
    });
    res.status(200).send({
      message: "Customer created",
    });
  } catch (err) {
    console.log("error", err);
    res.status(400).send({ message: err.message });
  }
};


module.exports = {
  paymentIntent,
  getConfig,
  createCheckoutSession,
  createCustomer,
};

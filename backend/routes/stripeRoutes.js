const express = require("express");
const router = express.Router();
const {
  paymentIntent,
  getConfig,
  createCheckoutSession,
  createCustomer,
} = require("../controllers/stripeConroller");
const { protect } = require("../middleware/authMiddleware");

router.post("/create-payment-intent", protect, paymentIntent);
router.get("/config", protect, getConfig);
router.post("/create-checkout-session", createCheckoutSession);
router.post("/create-customer", createCustomer);

module.exports = router;

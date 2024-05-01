const express = require("express");
const router = express.Router();
const {paymentIntent, getConfig} = require("../controllers/stripeConroller");
const { protect } = require("../middleware/authMiddleware");

router.post("/create-payment-intent", protect, paymentIntent);
router.get("/config", protect, getConfig);

module.exports = router;

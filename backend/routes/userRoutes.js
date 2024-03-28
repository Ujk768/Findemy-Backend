const express = require("express");
const router = express.Router();
const {
  loginUser,
  signUpUser,
  addToCart,
  removeFromCart,
  getCart,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/login", loginUser);
router.post("/signup", signUpUser);
router.post("/addtocart", protect, addToCart);
router.post("/removefromcart", protect, removeFromCart);
router.get("/getcart", protect, getCart);

module.exports = router;

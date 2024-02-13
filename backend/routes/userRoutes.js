const express = require('express')
const router = express.Router()
const {loginUser,signUpUser, addToCart, removeFromCart, getCart}=require('../controllers/userController')
router.post('/login',loginUser)
router.post('/signup',signUpUser)
router.post('/addtocart',addToCart)
router.post('/removefromcart',removeFromCart)
router.get('/getcart/:id',getCart)

module.exports=router
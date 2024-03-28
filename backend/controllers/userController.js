const Users = require("../model/userModel");
const Courses = require("../model/courseModel");
const jwt = require("jsonwebtoken");
let validator = require("validator");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");

const loginUser = asyncHandler(async (req, res) => {
  let enteredEmail = req.body.email;
  let enteredPassword = req.body.password;
  //check for user email
  const existing_User = await Users.findOne({ email: enteredEmail });
  if (
    existing_User &&
    bcrypt.compareSync(enteredPassword, existing_User.password)
  ) {
    res.status(201).json({
      id: existing_User.id,
      name: existing_User.name,
      email: existing_User.email,
      token: generateToken(existing_User.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

const signUpUser = asyncHandler(async (req, res) => {
  let userName = req.body.name;
  let userEmail = req.body.email;
  let userPassword = req.body.password;
  //check all fields
  if (!userName || !userEmail || !userPassword) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  //check if user exists
  const existing_Users = await Users.findOne({ email: userEmail });
  if (existing_Users) {
    res.status(401);
    throw new Error("User already exists");
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userPassword, salt);
  // create user
  const user = await Users.create({
    name: userName,
    email: userEmail,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const addToCart = async (req, res) => {
  const { id, course_id } = req.body;
  const user = await Users.findOne({ _id: id });
  const course = await Courses.findById(course_id);
  try {
    if (user.cartItems.find((c) => c._id === course._id)) {
      res.status(401).send({ message: "Already Added to cart" });
    } else {
      user.cartItems.push(course);
      await user.save();
      res.status(200).send({ message: "Added to cart", data: { course } });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ message: "Error" });
  }
};

const removeFromCart = async (req, res) => {
  const { id, course_id } = req.body;
  const user = await Users.findOne({ _id: id });
  const course = await Courses.findById(course_id);
  try {
    user.cartItems = user.cartItems.filter((c) => {
      return c._id.toString() !== course._id.toString();
    });
    await user.save();
    console.log(course);
    res.status(200).send({
      message: "Removed from cart",
      data: course,
      total: user.cartItems.length,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ message: "Error" });
  }
};

const getCart = async (req, res) => {
  const { id } = req.params;
  const user = await Users.findOne({ _id: id });
  try {
    res.status(200).send({ message: "Got cart items", data: user });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "not found" });
  }
};

//generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  loginUser,
  signUpUser,
  addToCart,
  removeFromCart,
  getCart,
};

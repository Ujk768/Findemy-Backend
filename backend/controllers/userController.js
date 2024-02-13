const Users = require("../model/userModel");
const Courses = require("../model/courseModel");
let validator = require("validator");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

const loginUser = async (req, res) => {
  let enteredEmail = req.body.email;
  let enteredPassword = req.body.password;
  const existing_User = await Users.findOne({ email: enteredEmail });
  if (existing_User) {
    if (bcrypt.compareSync(enteredPassword, existing_User.password)) {
      console.log(`Login Success!!!!`);
      res.send({ message: "Login Success", data: existing_User });
      console.log(existing_User);
    } else {
      console.log("Wrong Password entered !!!");
      res.status(401).send({ message: "Wrong Password Entered" });
    }
  } else {
    console.error("Please Signup user doesnt exist !!!");
    res.status(401).send({ message: "Sign Up User doesnt exist" });
  }
};

const signUpUser = async (req, res) => {
  let userName = req.body.name;
  let userEmail = req.body.email;
  let userPassword = req.body.password;
  console.log(req.body);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userPassword, salt);
  let userDetails = new Users({
    name: userName,
    email: userEmail,
    password: hashedPassword,
  });
  const existing_Users = await Users.findOne({ email: userEmail });
  if (existing_Users) {
    console.log("Email already in use !!!");
    res.status(401).send({ message: "signup failed user already exists" });
  } else {
    userDetails.save();
    console.log(`sign up successful!!!!!!`);
    res.send({ message: "Sign Up Success" });
  }
};

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
    console.log(course)
    res
      .status(200)
      .send({
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
  const user = await Users.findOne({ _id: id }).populate("cartItems");
  try {
    res.status(200).send({ message: "Got cart items", data: user.cartItems });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "not found" });
  }
};

module.exports = {
  loginUser,
  signUpUser,
  addToCart,
  removeFromCart,
  getCart,
};

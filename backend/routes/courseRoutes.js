const express = require("express");

const router = express.Router();

const {
  getCourses,
  getCourseById,
  getSearchedCourses,
} = require("../controllers/courseController");

router.get("/getcourses", getCourses);

router.get("/getcourse/:id", getCourseById);

router.get("/search", getSearchedCourses);

module.exports = router;

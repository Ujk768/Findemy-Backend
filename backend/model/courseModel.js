const mongoose = require("mongoose");
const validator = require("validator");
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  authorImage: {
    type: String,
    required: true,
  },
  authorDescription: {
    type: String,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  numOfRatings: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  isBestSeller: {
    type: Boolean,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  learningOutcomes: {
    type: Array,
    required: true,
  },
  longdescription: {
    type: String,
    required: true,
  },
});

courseSchema.index({ "$**": "text" });
const Course = mongoose.model("courses", courseSchema);
module.exports = Course;

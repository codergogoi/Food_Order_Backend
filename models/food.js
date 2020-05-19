const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  readyTime: {
    type: Number,
  },
  rating: {
    rate: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
  },
});

module.exports = mongoose.model("Food", productSchema);

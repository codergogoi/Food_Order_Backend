const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const restaurant = new Schema({
  name: {
    type: String,
    required: true,
  },
  foodType: {
    type: String,
  },
  pincode: {
    type: String,
  },
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  rating: {
    rate: Number,
  },
  images: {
    type: [String],
  },
  foods: [
    {
      type: Schema.Types.ObjectId,
      ref: "Food",
    },
  ],
});

module.exports = mongoose.model("Restaurant", restaurant);

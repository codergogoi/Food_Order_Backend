const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  cart: [
    {
      food: { type: Schema.Types.ObjectId, ref: "Food", required: true },
      qty: { type: Number, required: true },
    },
  ],
  order: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

userSchema.methods.addToCart = function (foodItem) {
  const foodIndex = this.cart.findIndex((cf) => {
    return cf.food._id.toString() === foodItem._id.toString();
  });

  let updatedItems = [...this.cart];
  let newQty = 1;
  if (foodIndex >= 0) {
    newQty = this.cart[foodIndex].qty + 1;
    updatedItems[foodIndex].qty = newQty;
  } else {
    updatedItems.push({
      food: foodItem,
      qty: newQty,
    });
  }
  this.cart = updatedItems;
  return this.save();
};

userSchema.methods.editCart = function (foodItem, newQty) {
  const foodIndex = this.cart.findIndex((cf) => {
    return cf.food._id.toString() === foodItem._id.toString();
  });

  if (newQty < 1) {
    const updatedItems = this.cart.filter((cf) => {
      return cf.food._id.toString() !== foodItem._id.toString();
    });
    this.cart = updatedItems;
    return this.save();
  } else {
    if (foodIndex >= 0) {
      let updatedItems = [...this.cart];
      updatedItems[foodIndex].qty = newQty;

      this.cart = updatedItems;
      return this.save();
    } else {
      return new Promise.reject();
    }
  }
};

module.exports = mongoose.model("User", userSchema);

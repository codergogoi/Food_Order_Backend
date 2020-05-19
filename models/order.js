const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderID: {
    type: String,
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Food",
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
  },
  paidThrough: {
    // COD// CARD // Net Banking // Google Pay
    type: String,
  },
  paymentResponse: {
    // Bank or PG response with Transaction number Log for refund or enquiry
    type: String,
  },
  orderStatus: {
    // waiting // preparing // onway // delivered // cancelled // failed
    type: String,
  },
});

module.exports = mongoose.model("Order", orderSchema);

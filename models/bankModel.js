const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "from is required"],
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "to is required"],
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: [true, "product is required"],
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
  },
  money: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Bank = mongoose.model("Bank", bankSchema);

module.exports = Bank;

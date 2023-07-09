const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
  },
  deliveryMan: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;

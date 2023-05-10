const mongoose = require("mongoose");

const donateSchema = mongoose.Schema({
  charityName: {
    type: String,
    enum: [],
    required: [true, "Please enter the charity name you want to donate to"],
  },
  message: String,
  orderId: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
  },
});

const Donate = mongoose.model('Donate', donateSchema);

module.exports = Donate;

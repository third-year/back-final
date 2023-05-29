const mongoose = require("mongoose");

const donateSchema = mongoose.Schema({
  charityName: {
    type: String,
    enum: [Nour_Foundation , Al-Bar_Association_and-Social_Services, Touch_of_Hanan_Association, Excellence_in_orphan_sponsorship
    ,Al-Ghaith_Charity_Association],
    required: [true, "Please enter the charity name you want to donate to"],
  },
  message: String,
  orderId: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
    require:[true,"Must have an order Id"]
  },
});

const Donate = mongoose.model('Donate', donateSchema);

module.exports = Donate;

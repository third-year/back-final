const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
  date: {
    type: Date,
    required: [true, "Please enter the data"],
  },
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;

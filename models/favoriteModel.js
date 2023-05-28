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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;

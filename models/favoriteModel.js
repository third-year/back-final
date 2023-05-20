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

/*favoriteSchema.pre(/^findByIdAndDelete/, async function(next) {
  this.r = await this.findByIdAndDelete();
   //console.log(this.r);
  next();
});*/
const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;

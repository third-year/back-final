const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const { lookUpGeoJSON } = require("geojson-places");
const { lookUpRaw } = require("geojson-places");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter the product name"],
  },
  description: {
    type: String,
    required: [true, "Enter the product description"],
  },
  price: {
    type: Number,
    required: [true, "Enter the product price"],
  },
  image: {
    type: String,
    required: [true, "Enter the product image"],
  },
  quantity: {
    type: Number,
    required: [true, "Enter the product quantity"],
  },
  address: {
    type: [Number],
    required: [true, "Enter the product address"],
  },
  rating: {
    type: Number,
  },
  categories: {
    type: String,
    enum: ['clothes'],
    required: [true, "Enter the product categorie"],
  },
  status:{
    type: String,
    enum: ['new', 'old'],
    required: [true, "Enter the product status new or old"],
  },
  userId:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});
productSchema.plugin(mongoosePaginate);
const Product = mongoose.model("Product", productSchema);

module.exports = Product;

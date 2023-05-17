const mongoose = require("mongoose");

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
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
  },
  ratingsQuantity: {
    type: Number,
    default: 0
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
  }},
  {    
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'products',
  localField: '_id'
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

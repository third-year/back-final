const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [
    {
      _id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'An order must belong to a product.'],
      },
      name: {
        type: String,
      },
      price: {
        type: Number,
        require: [true, 'A product must have a price.'],
      },
      quantity: {
        type: Number,
        required: [true, 'A product must have a quantity.'],
        default: 1,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A order must have a User Id.'],
  },
 distantionAdress:{
    type:String,
    require:true
  },
 distant:{
    type:Number
}
});

const Order = mongoose.model('Order',orderSchema);
module.exports=Order;
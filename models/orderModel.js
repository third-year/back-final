const mongoose = require('mongoose');
const User = require('./userModel');
const Product = require('./productModel');

const orderSchema = new mongoose.Schema({
quantity:{
type:Number
},
totallPrice:{
    type:Number
},
userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
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
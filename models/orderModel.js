const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product:{
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'An order must belong to a product.'],
    }
,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A order must have a User Id.'],
  },
  quantitySell:{
    type:Number,
    require:[true,'You must have define qunatity']
  },
 distantionAdress:{
    type:Array,
    require:[true,'Must put address']
  },
 distant:{
    type:Number
}
});


const Order = mongoose.model('Order',orderSchema);

module.exports=Order;
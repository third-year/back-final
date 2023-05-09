const mongoose = require('mongoose');
const User = require('./userModel');

const orderSchema = new mongoose.Schema({
quantity:{
type:NumberInt
},
totallPrice:{
    type:Number
},
userId:{
    Reflect:User
},
/*productId:{
    Reflect:Product
}*/
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
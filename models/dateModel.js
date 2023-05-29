const mongoose = require('mongoose');

const dateSchema = new mongoose.Schema({
    productId:{
        ref:"Product",
        required: [true, 'A date must belong to a product.'],

    },
    userId:{
        ref:"User",
        require:[true,'A date must belong to a User']
    },
    orderId:{
        ref:"Order",
        required: [true, 'A date must belong to am order.'],

    },
    buyDate:{
        type:Date,
        default: Date.now()
    },
    deliveryDate:{
        type:Date
    }
    
})
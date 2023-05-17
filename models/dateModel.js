const mongoose = require('mongoose');
const Review = require('./reviewModel');
const Product = require('./productModel');
const dateSchema = new mongoose.Schema({

    buyDate:{
        type:Date
    },
    productId:{
        ref:Product
    }       
})
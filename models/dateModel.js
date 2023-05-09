const mongoose = require('mongoose');
const Review = require('./reviewModel');
//const Product = require('./productModel');
const dateSchema = new mongoose.Schema({

    buyDate:{
        type:dateSchema
    },
    reviewDate:{
        type:dateSchema
    },
    reviewId:{
        Reflect:Review
    }    
    /*
    productId:{
        Reflect:Product
    }     */    
})
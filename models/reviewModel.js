const mongoose = require('mongoose');
const User = require('./userModel');

const reviewSchema = new mongoose.Schema({        
comment:{
    type:String
},
userId:{
    Reflect:User
}
/*productId:{
    Reflect:Product
}*/
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
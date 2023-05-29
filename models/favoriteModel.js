const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
    product:{
        type: mongoose.Schema.ObjectId,
        ref:'Product',
        required:[true,'A Favorite must belong to Product']
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'A Favorite must belong to user']
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
});

const Favorite = mongoose.model('Favorite',favoriteSchema);
module.exports= Favorite;
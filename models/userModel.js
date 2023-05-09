const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        require:[true,'Please Enter The Name']
    },
    email:{
        type:String,
        require:[true,'Enter The Email'],
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    imag:{
        type:String
    },
    passWord:{
        type:String,
        require:true,
        minlength:8,
        select:false
    },
    passWordConfrim:{
        type:String,
        require:true,
        
        validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
        
    },
    phone:{
        type:Number,
        require:true
    }
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;
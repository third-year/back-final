const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

//create token 
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

//signup

exports.signup = catchAsync (async (req,res,next)=>{

    //add first name and last name in full name
    const Name = req.body.firstName+" "+req.body.LastName

    //create new user

    //1)request
    const newUser = await User.create({
     fullName:Name,
     email:req.body.email,
     imag:req.body.imag,
     passWord:req.body.passWord,
     passWordConfrim:req.body.passWordConfrim,
     phone:req.body.phone
    });

    //Token
  createSendToken(newUser, 201, res);

    //2)response
    res.status(201).json({
        status:'success',
        data:{
            user:newUser
        }
    }
    );

});
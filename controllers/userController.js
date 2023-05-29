const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { populate } = require('../models/favoriteModel');

//filter function
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//getUsers
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
  
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  });

  
  //update profile
  exports.updateProfile =catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }
  const filteredBody = filterObj(req.body, 'fullName', 'email','imag','phone');

 const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
  new: true,
  runValidators: true
});

res.status(200).json({
  status: 'success',
  data: {
    user: updatedUser
  }
});
});

//delete account
exports.deleteAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});


exports.getAllUsersForTheAdmin = catchAsync(async(req, res, next)=>{
  const users = await User.find({roles: 'user'});

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {users}
  })
})
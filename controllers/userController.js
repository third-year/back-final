
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const emailSend = require("./../utils/email");
const AppError = require("./../utils/appError");
const { populate } = require("../models/favoriteModel");
const { response } = require('express');


//filter function
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};


///getUser
/*exports.getUser = catchAsync(async(req,res,next)=>{
const token = req.headers.authorization;
console.log(token);
res.status(200).json({
  status: 'success',
  token
});
});*/
exports.getUser = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      status: 'fail',
      message: 'No authorization header provided'
    });
  }
  else{
    res.status(200).json({
      status: 'success',
      authHeader
    });
  };
});

//getUsers
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

//update profile
exports.updateProfile = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }
  const filteredBody = filterObj(
    req.body,
    "fullName",
    "email",
    "imag",
    "phone"
  );

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

//delete account
exports.deleteAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// GET ALL USERS FOR THE ADMIN
exports.getAllUsersForTheAdmin = catchAsync(async (req, res, next) => {
  const users = await User.find({ roles: "user" });

  res.status(200).json({
    status: "success",
    result: users.length,
    data: { users },
  });
});

// SEND EMAIL
exports.sendEmail = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with this email", 404));
  }

  try {
    await emailSend({
      from: "STARZ<STARZadmin@gmail.com>",
      email: user.email,
      subject: req.body.subject,
      message: req.body.message,
    });

    res.status(200).json({
      status: "success",
      massage: "email sent successfully",
    });
  } catch (err) {
    return next(
      new AppError(
        "There was an error in sending the email. Try again later",
        500
      )
    );
  }
});

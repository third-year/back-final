const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");
const User = require("./../models/userModel");
const Product = require("./../models/productModel");

//////////////////////////////// PROTECT
exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(
        new AppError("You are not logged in! please log in to get access", 401)
      );
    }

    // Varification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if the user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this user is no longer exists", 401)
      );
    }

    // Check if the user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError("User recently changed password! Please login again", 401)
      );
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  }
});

//////////////////////////////// The loged in user is the user who owns the info
exports.isProductOwner = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const product = await Product.findById(req.params.id);

  if (userId !== product.userId.toString() && req.user.roles === "user") {
    return next(
      new AppError(
        "You are not the owner so you can't perform this action",
        404
      )
    );
  }

  next();
});

//////////////////////////////// restrictTo function
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin']
    if (!roles.includes(req.user.roles)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

//////////////////////////////// SIGN TOKEN
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//////////////////////////////// CHECK IF THE TOKEN IS VALID
exports.checkTokenIfValid = catchAsync(async (req, res, next) => {
  // Get use based on reset token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // if the user is exist return 200 status and confirm message
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  req.user = user;
  next();
});

//////////////////////////////// SIGNUP
exports.signup = catchAsync(async (req, res, next) => {
  // Check if the email is unique
  const findOneEmail = await User.findOne({ email: req.body.email });
  if (findOneEmail) {
    return next(new AppError("This email already used"));
  }

  //add first name and last name in full name
  const Name = req.body.firstName + " " + req.body.lastName;

  //create new user

  //1)request
  const newUser = await User.create({
    fullName: Name,
    email: req.body.email,
    image: req.body.imag,
    roles: req.body.roles,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    phone: req.body.phone,
  });

  // //Token
  // createSendToken(newUser, 201, res);

  //2)response
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

//////////////////////////////// LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exists
  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }

  // Check if the user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // if every thing is OK, send the token to the user
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

//////////////////////////////// FORGOT PASSWORD
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user from the email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with this email", 404));
  }

  // Generate random reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // Send it to user email
  const message = `Forgot your Password? this is your reset toke please enter it ${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password resrt token (valid for 10 min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error in sending the email. Try again later",
        500
      )
    );
  }
});

//////////////////////////////// CHECK RESET TOKEN
exports.checkResetToken = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "The Token is valid",
  });
});

//////////////////////////////// RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
 
   res.status(200).json({
     status: 'success',
     massage: 'password reseted successfully'
   })

})

const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const User = require("./../models/userModel");

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

   ///restrictTo function
   exports.restrictTo=(...roles)=>{
    return (req,res,next)=>{
      //role['admin']
      if(!roles.includes(req.user.roles)){
        return next(new AppError('You dont have perform for this action',401));}
      return next();
    };

   };

//////////////////////////////// SIGN TOKEN
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//////////////////////////////// SIGNUP
exports.signup = catchAsync(async (req, res, next) => {

  // Check if the email is unique
  const findOneEmail = await User.findOne({ email: req.body.email })
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
    password: req.body.password,
    passwordConfrim: req.body.passwordConfrim,
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
  const user = await User.findOne({ email }).select('+password');
  console.log(user);
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

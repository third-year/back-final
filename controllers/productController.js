const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const Product = require("./../models/productModel");
const Review = require("../models/reviewModel");
const Favorite = require("../models/favoriteModel");
const { compare } = require("bcryptjs");
const User = require("../models/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
////////////////////////// GET ALL PRODUCT
exports.getAllProducts = catchAsync(async (req, res, next) => {
  // const products = await Product.find().populate({
  //   path: "userId",
  //   select: "-__v",
  // });

  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const featureResult = await features.query;

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;

  const products = featureResult.slice((page - 1) * limit, page * limit);

  let resultProducts = [];
  if (!req.headers.authorization) {
    for (let product of products) {
      pro = product.toObject();

      pro.isFav = false;
      resultProducts.push(pro);
    }
  }
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    for (let product of products) {
      const fav = await Favorite.find({
        product: product.id,
        user: decoded.id,
      });
      pro = product.toObject();
      if (fav.length > 0) {
        pro.isFav = true;
        resultProducts.push(pro);
        console.log(pro);
      }
      if (fav.length === 0) {
        pro.isFav = false;
        resultProducts.push(pro);
      }
    }
  }

  res.status(200).json({
    status: "success",
    results: resultProducts.length,
    data: { resultProducts },
  });
});

////////////////////////// GET PRODUCT
exports.getProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.id).populate("reviews");

  if (!product) {
    return next(new AppError("there is no product with this ID", 404));
  }

  if (!req.headers.authorization) {
    product = product.toObject();

    product.isFav = false;
  }

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const fav = await Favorite.find({
      product: product.id,
      user: decoded.id,
    });
    product = product.toObject();
    if (fav.length > 0) {
      product.isFav = true;
    }
    if (fav.length === 0) {
      product.isFav = false;
    }
  }

  res.status(200).json({
    status: "success",
    data: { product },
  });
});

////////////////////////// CREATE PRODUCT
exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create({
    userId: req.user.id,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
    quantity: req.body.quantity,
    address: req.body.address,
    category: req.body.category,
    status: req.body.status,
  });

  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
});

////////////////////////// UPDATE PRODUCT
exports.updataProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: product,
  });
});

////////////////////////// DELETE PRODUCT
exports.deleteProduct = catchAsync(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

////////////////////////// USER'S PRODUCTS
exports.userProducts = catchAsync(async (req, res, next) => {
  const userProducts = await Product.find({ userId: req.params.userId });

  if (!userProducts) {
    return next(
      new AppError("There is no products for the user with this ID", 404)
    );
  }

  res.status(200).json({
    status: "success",
    results: userProducts.length,
    user: req.user,
    data: { userProducts },
  });
});

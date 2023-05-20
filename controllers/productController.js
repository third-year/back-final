const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const Product = require("./../models/productModel");
const Review = require("../models/reviewModel");

////////////////////////// GET ALL PRODUCT
exports.getAllProducts = catchAsync(async (req, res, next) => {
  // const products = await Product.find().populate({
  //   path: "userId",
  //   select: "-__v",
  // });

  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate(Product);
  const products = await features.query;

  res.status(200).json({
    status: "success",
    results: products.length,
    data: { products },
  });
});

////////////////////////// GET PRODUCT
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('reviews');

  if (!product) {
    return next(new AppError("there is no product with this ID", 404));
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
    categories: req.body.categories,
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

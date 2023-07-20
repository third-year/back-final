const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Review = require("./../models/reviewModel");

exports.getAllReview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.productId) filter = { product: req.params.productId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    satuts: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("there is no review with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { review },
  });
});

exports.updataReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!review) {
    return new AppError("The Review not exists", 404);
  }
  console.log(review);
  res.status(200).json({
    status: "success",
    data: review,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return new AppError("The Review not exists", 404);
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

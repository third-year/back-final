const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const Delivery = require("../models/deliveryModel");
const Order = require("../models/orderModel");

exports.takeOrder = catchAsync(async (req, res, next) => {
  const delivery = await Delivery.find({ order: req.params.orderId });

  console.log(delivery);
  if (delivery.length > 0) {
    return next(new AppError("Someone is delivering this order already", 404));
  }

  const newDelivery = await Delivery.create({
    order: req.params.orderId,
    deliveryMan: req.user.id,
  });

  await Order.findByIdAndUpdate(
    req.params.orderId,
    { toBeDelivered: true },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: newDelivery,
  });
});

exports.completed = catchAsync(async (req, res, next) => {
  const update = await Delivery.findByIdAndUpdate(
    req.params.deliveryId,
    {
      completed: true,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: update,
  });
});

exports.myCompletedDelivery = catchAsync(async (req, res, next) => {
  const delivery = await Delivery.find({
    deliveryMan: req.user.id,
    completed: true,
  }).populate({
    path: "order",
    populate: [
      { path: "product", model: "Product" },
      { path: "productOwner", model: "User" },
      { path: "orderOwner", model: "User" },
    ],
  });

  res.status(200).json({
    status: "success",
    results: delivery.length,
    data: delivery,
  });
});

exports.myNotCompletedDelivery = catchAsync(async (req, res, next) => {
  const delivery = await Delivery.find({
    deliveryMan: req.user.id,
    completed: false,
  }).populate({
    path: "order",
    populate: [
      { path: "product", model: "Product" },
      { path: "productOwner", model: "User" },
      { path: "orderOwner", model: "User" },
    ],
  });

  res.status(200).json({
    status: "success",
    results: delivery.length,
    data: delivery,
  });
});

exports.getDelivery = catchAsync(async (req, res, next) => {
  const delivery = await Delivery.findById(req.params.deliveryId).populate({
    path: "order",
    populate: [
      { path: "product", model: "Product" },
      { path: "productOwner", model: "User" },
      { path: "orderOwner", model: "User" },
    ],
  });

  res.status(200).json({
    status: "success",
    data: delivery,
  });
});

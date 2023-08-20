const Order = require("./../models/orderModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Bank = require("../models/bankModel");
const Delivery = require("../models/deliveryModel");
const geolib = require("geolib");

//// GET ALL ORDER
exports.getAllOrder = catchAsync(async (req, res, next) => {
  const orders = await Order.find().populate("product").populate("orderOwner");

  res.status(200).json({
    satuts: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId)
    .populate("product")
    .populate("orderOwner");

  const deliveryManForThisOrder = await Delivery.find({
    order: req.params.orderId,
  }).populate("deliveryMan");

  res.status(200).json({
    status: "success",
    order: order,
    deliveryMan: deliveryManForThisOrder,
  });
});

////create order
exports.createOrders = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new AppError("There is no such product", 404));
  }

  const productQuantity = product.quantity;
  const productPrice = product.price;
  const productOwnerId = product.userId;

  const orderQuantity = req.body.quantitySell;
  const orderOwnerId = req.user.id;

  if (productQuantity < orderQuantity) {
    return next(new AppError("There is not enough from this product", 404));
  }

  const totalPrice = orderQuantity * productPrice;
  const orderOwner = await User.findById(orderOwnerId);
  const orderOwnerWallet = orderOwner.wallet;

  if (orderOwnerWallet < totalPrice) {
    return next(
      new AppError(
        "There is not enough cash in your wallet please charge first",
        400
      )
    );
  }

  if (productOwnerId.valueOf() === orderOwnerId) {
    return next(new AppError("You are not allowed to buy this item", 401));
  }

  const productLocation = product.address;
  const distance =
    geolib.getDistance(
      {
        latitude: req.body.destinationAddress[0],
        longitude: req.body.destinationAddress[1],
      },
      {
        latitude: productLocation[0],
        longitude: productLocation[1],
      }
    ) / 1000;

  let deliveryPrice = 0;
  if (distance < 10) {
    deliveryPrice = 8000;
  }
  if (distance >= 5 && distance <= 10) {
    deliveryPrice = 12000;
  }
  if (distance > 10) {
    deliveryPrice = 15000;
  }

  const newOrder = await Order.create({
    product: req.params.productId,
    productOwner: productOwnerId,
    orderOwner: orderOwnerId,
    quantitySell: orderQuantity,
    destinationAddress: req.body.destinationAddress,
    distance: distance,
    deliveryPrice: deliveryPrice,
  });

  const productOwner = await User.findById(productOwnerId);

  const productOwnerNewWallet = productOwner.wallet + totalPrice;

  const orderOwnerNewWallet = orderOwner.wallet - totalPrice;

  const updateProductOwnerWallet = await User.findByIdAndUpdate(
    productOwnerId,
    { wallet: productOwnerNewWallet },
    {
      new: true,
      runValidators: false,
    }
  );
  console.log("9");
  await Product.findByIdAndUpdate(
    req.params.productId,
    {
      quantity: productQuantity - orderQuantity,
    },
    {
      new: true,
      runValidators: false,
    }
  );
  console.log("10");
  const updateOrderOwnerWallet = await User.findByIdAndUpdate(
    orderOwnerId,
    { wallet: orderOwnerNewWallet },
    { new: true, runValidators: false }
  );

  const newBankOperation = await Bank.create({
    from: orderOwnerId,
    to: productOwnerId,
    money: totalPrice,
    order: newOrder.id,
    product: req.params.productId,
  });

  res.status(201).json({
    status: "success",
    order: newOrder,
  });
});

////////////////////////// DELETE ORDER
exports.deleteOrder = catchAsync(async (req, res, next) => {
  await Order.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

//////////////////////// GET MY ORDERS  ///// THE ONE'S I ORDERED
exports.myOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ orderOwner: req.user.id }).populate(
    "product"
  );

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: orders,
  });
});

//////////////////////// GET OTHERS ORDERS FROM ME
exports.othersOrdersFromMe = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ productOwner: req.user.id })
    .select("-productOwner")
    .populate("product")
    .populate("orderOwner");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: orders,
  });
});

//////////////////// GET ALL THE ORDERS WHERE (toBeDelivered = FALSE) NOT DELIVERED YET
exports.notDeliveredOrders = catchAsync(async (req, res, next) => {
  const notDeliveredOrders = await Order.find({ toBeDelivered: false })
    .populate("product")
    .populate("productOwner")
    .populate("orderOwner");

  res.status(200).json({
    status: "success",
    results: notDeliveredOrders.length,
    data: notDeliveredOrders,
  });
});

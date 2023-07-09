const express = require("express");
const orderController = require("./../controllers/orderController");
const authController = require("./../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(authController.protect, orderController.getAllOrder)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    orderController.createOrders
  );
router
  .route("/:productId")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    orderController.createOrders
  );

router.get(
  "/my-orders",
  authController.protect,
  authController.restrictTo("user"),
  orderController.myOrders
);

router.get(
  "/others-orders-from-me",
  authController.protect,
  authController.restrictTo("user"),
  orderController.othersOrdersFromMe
);

router.get(
  "/not-delivered",
  authController.protect,
  authController.restrictTo("delivery"),
  orderController.notDeliveredOrders
);

module.exports = router;

const express = require("express");
const deliveryController = require("./../controllers/deliveryController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post(
  "/take-order/:orderId",
  authController.protect,
  authController.restrictTo("delivery"),
  deliveryController.takeOrder
);

router.post(
  "/completed/:deliveryId",
  authController.protect,
  authController.restrictTo("delivery"),
  deliveryController.completed
);

router.get(
  "/completed",
  authController.protect,
  authController.restrictTo("delivery"),
  deliveryController.myCompletedDelivery
);

router.get(
  "/not-completed",
  authController.protect,
  authController.restrictTo("delivery"),
  deliveryController.myNotCompletedDelivery
);

router.get(
  "/:deliveryId",
  authController.protect,
  authController.restrictTo("delivery"),
  deliveryController.getDelivery
);
module.exports = router;

const express = require("express");
const orderController = require("./../controllers/orderController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.route('/')
.get(authController.protect,orderController.getAllOrder)
.post(authController.protect,authController.restrictTo('user'),orderController.createOrders)
router.route('/:id')
.patch(authController.protect,authController.restrictTo('user'),orderController.updataOrder)
.delete(authController.protect,authController.restrictTo('user'),orderController.deleteOrder)




module.exports = router;
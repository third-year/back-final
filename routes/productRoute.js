const express = require("express");
const productController = require("./../controllers/productController");
const authController = require("./../controllers/authController");
const reviewRoute = require('./reviewRoute');

const router = express.Router();

router.use('/:productId/reviews',reviewRoute);

router
  .route("/")
  .get(productController.getAllProducts)
  .post(authController.protect, productController.createProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.isProductOwner,
    productController.updataProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "user"),
    authController.isProductOwner,
    productController.deleteProduct);

module.exports = router;

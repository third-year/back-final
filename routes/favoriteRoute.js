const express = require("express");
const favoriteController = require("./../controllers/favoriteController");
const authController = require("./../controllers/authController");
const router = express.Router();

//const router = express.Router({mergeParams:true});

router
  .route("/")
  .get(authController.protect, favoriteController.getAllFavorite);

router
  .route("/:productId")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    favoriteController.createFavorite
  )
  .delete(
    authController.protect,
    authController.restrictTo("user"),
    favoriteController.deleteFavorite
  );

module.exports = router;

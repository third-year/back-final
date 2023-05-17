const express = require("express");
const favoriteController = require("./../controllers/favoriteController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.route('/')
.get(authController.protect,favoriteController.getAllFavorite)
.post(authController.protect,authController.restrictTo('user'),favoriteController.createFavorite)
router.route('/:id')
.delete(authController.protect,authController.restrictTo('user'),favoriteController.deleteFavorite)




module.exports = router;
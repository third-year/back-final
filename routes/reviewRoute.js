const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router({mergeParams:true});

router.route('/')
.get(reviewController.getAllReview)
.post(authController.protect,authController.restrictTo('user'),reviewController.createReview)
router.route('/:id')
.patch(authController.protect,authController.restrictTo('user',reviewController.updataReview))
.get(reviewController.getReview)
.delete(authController.protect,authController.restrictTo('user', 'admin'),reviewController.deleteReview);




module.exports = router;
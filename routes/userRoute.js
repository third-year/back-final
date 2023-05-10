
const express = require("express");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.get('/checkResetToken/:token', authController.checkTokenIfValid, authController.checkResetToken);
router.post('/resetPassword/:token', authController.checkTokenIfValid, authController.resetPassword);

module.exports = router;

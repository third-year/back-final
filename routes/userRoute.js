const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/login-as-admin', authController.loginAsAdmin);

router.get('/getUsers', userController.getAllUsers);
router.post('/forgotPassword', authController.forgotPassword);
router.get('/checkResetToken/:token', authController.checkTokenIfValid, authController.checkResetToken);
router.post('/resetPassword/:token', authController.checkTokenIfValid, authController.resetPassword);
router.patch('/updatePassword', authController.protect, authController.updatePassword);
router.patch('/updateProfile',  authController.protect, userController.updateProfile);
router.delete('/deleteAccount',  authController.protect, userController.deleteAccount);

module.exports = router;

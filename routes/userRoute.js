const express = require('express');
const authContorller = require('./../controllers/authController');

const router = express.Router();

router.post('/signup',authContorller.signup);

module.exports = router;
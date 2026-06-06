const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

router.post('/otp/send', otpController.sendOtp);
router.post('/otp/verify-and-submit', otpController.verifyOtpAndSubmitLead);

module.exports = router;

const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp } = require('../controllers/emailOptController');

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to user's email
 * @access  Public
 */
router.post('/send-otp', sendOtp);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP submitted by user
 * @access  Public
 */
router.post('/verify-otp', verifyOtp);

module.exports = router;
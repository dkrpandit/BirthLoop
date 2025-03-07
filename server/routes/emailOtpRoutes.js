const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp ,sendOtpForForgotPassword} = require('../controllers/emailOptController');

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

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send OTP to user's email for password reset
 * @access  Public
 */
router.post('/forgot-password', sendOtpForForgotPassword);

module.exports = router;
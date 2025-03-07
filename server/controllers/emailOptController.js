const nodemailer = require('nodemailer');
const User = require('../models/User');
const EmailOTP = require('../models/EmailOTP');

/**
 * Generates a random OTP of specified length
 * @param {number} length - Length of the OTP (default: 6)
 * @returns {string} - Generated OTP
 */
const generateOTP = (length = 6) => {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits.charAt(randomIndex);
    }

    return otp;
};

/**
 * Create a reusable email transporter
 * @returns {Object} - Nodemailer transporter object
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dharmendra763297@gmail.com',
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

/**
 * Send an email with the OTP
 * @param {string} email - Recipient email
 * @param {string} otp - OTP to include in the email
 * @returns {Promise} - Promise resolving to the email sending result
 */
const sendOTPEmail = (email, otp) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: '"BirthLoop" <dharmendra763297@gmail.com>',
        to: email,
        subject: 'Verify Your BirthLoop Account',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px;">
        <div style="text-align: center; padding: 15px; background-color: #4a86e8; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">BirthLoop</h1>
        </div>
        
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: #333;">Verification Code</h2>
          <p style="font-size: 16px; color: #555; margin-bottom: 25px;">
            Please use the following OTP to verify your account:
          </p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 28px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
            ${otp}
          </div>
          
          <p style="font-size: 14px; color: #777; margin-top: 25px;">
            This OTP is valid for 10 minutes. Please do not share this code with anyone.
          </p>
        </div>
        
        <div style="text-align: center; padding: 15px; background-color: #f5f5f5; border-radius: 0 0 8px 8px; font-size: 12px; color: #777;">
          <p>© ${new Date().getFullYear()} BirthLoop. All rights reserved.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      </div>
    `
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};

/**
 * Controller to send OTP to user's email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate email
        if (!email || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        // Check if email already exists in User model
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Generate a 6-digit OTP
        const otp = generateOTP();

        // First delete any existing OTPs for this email
        await EmailOTP.deleteMany({ email });

        // Store new OTP in database
        await EmailOTP.create({
            email,
            otp
            // createdAt and expires is handled by the schema default
        });

        // Send OTP via email
        await sendOTPEmail(email, otp);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp
        });

    } catch (error) {
        console.error("Error in sending OTP:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send OTP. Please try again later."
        });
    }
};
/**
 * Controller to send OTP to user's email for forgot password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendOtpForForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate email
        if (!email || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        // Check if email exists in User model
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email not found"
            });
        }

        // Generate a 6-digit OTP
        const otp = generateOTP();

        // First delete any existing OTPs for this email
        await EmailOTP.deleteMany({ email });

        // Store new OTP in database
        await EmailOTP.create({
            email,
            otp
            // createdAt and expires is handled by the schema default
        });

        // Send OTP via email
        await sendOTPEmail(email, otp);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp
        });

    } catch (error) {
        console.error("Error in sending OTP:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send OTP. Please try again later."
        });
    }
};

/**
 * Controller to verify OTP submitted by user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate request data
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        // Find the stored OTP document
        const otpRecord = await EmailOTP.findOne({ email, otp });
        
        // Check if OTP exists and matches
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP or OTP has expired. Please try again."
            });
        }

        // OTP is valid - remove it so it can't be used again
        await EmailOTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });

    } catch (error) {
        console.error("Error in verifying OTP:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying OTP. Please try again."
        });
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
    sendOtpForForgotPassword
};
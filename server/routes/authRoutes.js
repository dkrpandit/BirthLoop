const express = require('express');
const passport = require('passport');
const { signup, login, googleLoginSuccess ,forgotPassword} = require('../controllers/authController');

const router = express.Router();

// Email/Password Signup and Login
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }), googleLoginSuccess
);


module.exports = router;
// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

const auth = require('../middleware/auth');

// Middleware to check for admin rights - implement this as needed
// For example, this could verify if the user has admin role

/**
 * @route POST /api/notifications/process
 * @desc Manually trigger the notification processing (Admin only)
 * @access Private/Admin
 */
router.post('/process', auth, (req, res) => {
  return notificationController.manualTrigger(req, res);
});

/**
 * @route POST /api/notifications/test/:friendId
 * @desc Send a test notification for a specific friend
 * @access Private
 */
router.post('/test/:friendId', auth, (req, res) => {
  return notificationController.testNotification(req, res);
});

module.exports = router;
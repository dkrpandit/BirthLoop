// scheduler.js
const cron = require('node-cron');
const notificationController = require('../controllers/notificationController');

/**
 * Set up scheduled tasks for the BirthLoop application
 */
const setupScheduledTasks = () => {
  // Schedule birthday notification check to run every day at 00:01 AM
  // This runs before any notification times and prepares the day's notifications
  cron.schedule('1 0 * * *', async () => {
    console.log('Running scheduled birthday notification check...');
    try {
      const result = await notificationController.processDailyNotifications();
      console.log('Notification check completed:', result);
    } catch (error) {
      console.error('Error in scheduled notification check:', error);
    }
  });

  // Optionally, you can run another check mid-day to catch any missed notifications
  // or handle notifications for users in different timezones
  cron.schedule('0 12 * * *', async () => {
    console.log('Running mid-day notification check...');
    try {
      const result = await notificationController.processDailyNotifications();
      console.log('Mid-day notification check completed:', result);
    } catch (error) {
      console.error('Error in mid-day notification check:', error);
    }
  });

  console.log('Scheduled tasks have been set up');
};

module.exports = setupScheduledTasks;
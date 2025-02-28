const Friend = require('../models/Friend');
const nodemailer = require('nodemailer');

/**
 * Notification Controller for BirthLoop
 * Sends birthday reminders according to each user's notification preferences
 */
class NotificationController {
    /**
     * Initialize the notification service with email transport
     */
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dharmendra763297@gmail.com', // Use your actual email for testing
                pass: 'bczhbxdtuicfbiix' // Replace with your app password
                //  user: process.env.EMAIL_USER,
                //  pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    /**
     * Process all pending notifications that should be sent today
     * This should be scheduled to run once a day, ideally early morning
     */
    async processDailyNotifications() {
        try {
            const today = new Date();
            const upcomingBirthdays = await this.findUpcomingBirthdays();

            console.log(`Found ${upcomingBirthdays.length} upcoming birthdays to process for notifications`);

            // Process each notification
            for (const notification of upcomingBirthdays) {
                await this.sendNotification(notification.user, notification.friend);
            }

            return { success: true, notificationsSent: upcomingBirthdays.length };
        } catch (error) {
            console.error('Error processing daily notifications:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Find all upcoming birthdays that need notifications today
     * based on each friend's notification preferences
     */
    async findUpcomingBirthdays() {
        try {
            const today = new Date();
            const notificationsToSend = [];

            // Get all friends with enabled notifications
            const friends = await Friend.find({
                'notificationPreferences.enabled': true
            }).populate('userId');

            for (const friend of friends) {
                if (!friend.userId) continue;

                const user = friend.userId;
                const birthDate = new Date(friend.birthDate);
                const notificationDays = friend.notificationPreferences.days || 1;

                // Check if notification should be sent today
                if (this.shouldSendNotificationToday(birthDate, notificationDays, today)) {
                    // Check if notification was already sent today
                    if (friend.lastNotificationSent) {
                        const lastSent = new Date(friend.lastNotificationSent);
                        if (lastSent.toDateString() === today.toDateString()) {
                            // Already sent today, skip
                            continue;
                        }
                    }

                    // Check if the notification time has passed
                    if (this.hasNotificationTimePassed(friend.notificationPreferences.time)) {
                        notificationsToSend.push({ user, friend });
                    }
                }
            }

            return notificationsToSend;
        } catch (error) {
            console.error('Error finding upcoming birthdays:', error);
            throw error;
        }
    }

    /**
     * Check if a notification should be sent today based on birthday and notification preferences
     */
    shouldSendNotificationToday(birthDate, notificationDays, today = new Date()) {
        // Get current year's birthday
        const currentYearBday = new Date(birthDate);
        currentYearBday.setFullYear(today.getFullYear());

        // If birthday has already passed this year, look at next year's birthday
        if (currentYearBday < today) {
            currentYearBday.setFullYear(today.getFullYear() + 1);
        }

        // Calculate days difference
        const diffTime = currentYearBday.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Should send notification if days difference matches notification preference
        return diffDays === notificationDays;
    }

    /**
     * Check if the configured notification time has passed for today
     */
    hasNotificationTimePassed(timeString = '09:00') {
        const now = new Date();
        const [hours, minutes] = timeString.split(':').map(Number);

        const notificationTime = new Date();
        notificationTime.setHours(hours, minutes, 0, 0);

        return now >= notificationTime;
    }

    /**
     * Send a notification to a user about a friend's upcoming birthday
     */
    async sendNotification(user, friend) {
        try {
            console.log("user:", user, "friend:", friend)
            // Calculate the birthday date
            const today = new Date();
            const birthDate = new Date(friend.birthDate);
            const birthdayDate = new Date(birthDate);
            birthdayDate.setFullYear(today.getFullYear());

            // If birthday has already passed this year, it's for next year
            if (birthdayDate < today) {
                birthdayDate.setFullYear(today.getFullYear() + 1);
            }

            // Format the birthday date
            // Format the birthday date in Indian style
            // Ensures correct Indian date format with commas
            const formattedBirthdayDate = `${birthdayDate.toLocaleDateString('en-IN', { weekday: 'long' })}, ` +
                `${birthdayDate.getDate()} ` +
                `${birthdayDate.toLocaleDateString('en-IN', { month: 'long' })} ` +
                `${birthdayDate.getFullYear()}`;

            // Calculate age
            let age = birthdayDate.getFullYear() - birthDate.getFullYear();
            // Compose email
            const mailOptions = {
                from: `"BirthLoop" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: `🎂 Birthday Reminder: ${friend.name}'s birthday is coming up!`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
            <div style="text-align: center; background: linear-gradient(to right, #4a90e2, #7e57c2); padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0;">Birthday Reminder</h1>
            </div>
            
            <p style="font-size: 16px; color: #333;">Hi ${user.name},</p>
            
            <p style="font-size: 16px; color: #333;">This is a friendly reminder that <strong>${friend.name}'s</strong> birthday is coming up on <strong>${formattedBirthdayDate}</strong>.</p>
            
            <p style="font-size: 16px; color: #333;">${friend.name} will be turning <strong>${age}</strong> years old!</p>
            
            ${friend.notes ? `<p style="font-size: 16px; color: #333;"><strong>Your notes:</strong> ${friend.notes}</p>` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL || 'https://birthloop.com'}" style="background-color: #4a90e2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Open BirthLoop</a>
            </div>
            
            <p style="font-size: 14px; color: #888; text-align: center; margin-top: 30px;">
              You're receiving this email because you've set up birthday reminders in BirthLoop.
              <br>
              To manage your notification settings, please log in to your account.
            </p>
          </div>
        `
            };

            // Send email
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`Birthday notification sent for ${friend.name} to ${user.email}: ${info.messageId}`);

            // Update the lastNotificationSent date
            await Friend.findByIdAndUpdate(friend._id, {
                lastNotificationSent: new Date()
            });

            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error(`Error sending notification for ${friend.name}:`, error);
            return { success: false, error: error.message };
        }
    }

    /**
     * API endpoint to manually trigger notification checks
     * Only for development/testing purposes
     */
    async manualTrigger(req, res) {
        try {
            const result = await this.processDailyNotifications();
            return res.json(result);
        } catch (error) {
            console.error('Error in manual trigger:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Test notification for a specific friend
     * Sends a test notification regardless of timing settings
     */
    async testNotification(req, res) {
        try {
            // const user = req.user;
            const { friendId } = req.params;
            const friend = await Friend.findById(friendId).populate('userId');

            if (!friend) {
                return res.status(404).json({ success: false, message: 'Friend not found' });
            }
            const user = friend.userId;
            const result = await this.sendNotification(user, friend);
            return res.json({
                success: result.success,
                message: result.success ? 'Test notification sent successfully' : 'Failed to send test notification',
                details: result
            });
        } catch (error) {
            console.error('Error sending test notification:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

// Create and export a singleton instance
const notificationController = new NotificationController();
module.exports = notificationController;
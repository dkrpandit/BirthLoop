const express = require('express');
const router = express.Router();
const {
    createFriend, getAllFriends, getFriendById, updateFriend, deleteFriend, 
    getUpcomingBirthdays, getFriendsByGroup, updateNotificationPreferences
} = require('../controllers/friendController');
const auth = require('../middleware/auth');


router.post('/friends', auth, createFriend);
router.get('/friends', auth, getAllFriends);
router.get('/friends/:id', auth, getFriendById);
router.put('/friends/:id', auth, updateFriend);
router.delete('/friends/:id', auth, deleteFriend);
router.get('/friends/upcoming-birthdays', auth, getUpcomingBirthdays);
router.get('/friends/group/:groupId', auth, getFriendsByGroup);
router.put('/friends/:id/notification-preferences', auth, updateNotificationPreferences);

module.exports = router;

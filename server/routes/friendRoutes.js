const express = require('express');
const router = express.Router();
const {
    createFriend, getAllFriends, getFriendById, updateFriend, deleteFriend,
    getUpcomingBirthdays, getFriendsByGroup, updateNotificationPreferences,toggleNotification
} = require('../controllers/friendController');
const auth = require('../middleware/auth');


router.post('/', auth, createFriend);
router.get('/', auth, getAllFriends);
router.get('/:id', auth, getFriendById);
router.put('/:id', auth, updateFriend);
router.delete('/:id', auth, deleteFriend);
router.get('/upcoming/birthdays', auth, getUpcomingBirthdays);
router.get('/group/:groupId', auth, getFriendsByGroup);
router.put('/:id/notification-preferences', auth, updateNotificationPreferences);
router.patch('/:friendId/toggle-notification', auth, toggleNotification);

// router.post('/', createFriend);
// router.get('/', getAllFriends);
// router.get('/:id', getFriendById);
// router.put('/:id', updateFriend);
// router.delete('/:id', deleteFriend);
// router.get('/upcoming/birthdays', getUpcomingBirthdays);
// router.get('/group/:groupId', getFriendsByGroup);
// router.put('/:id/notification-preferences', updateNotificationPreferences);

module.exports = router;

const Friend = require('../models/Friend');


const createFriend = async (req, res) => {
    try {
        const friendData = {
            ...req.body,
            userId: req.user._id // Assuming you have user data from auth middleware
        };
        const friend = new Friend(friendData);
        await friend.save();
        res.status(201).json(friend);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get all friends for a user
const getAllFriends = async (req, res) => {
    try {
        const friends = await Friend.find({ userId: req.user._id })
            .populate("userId")
            .sort({ name: 1 });

        res.json(friends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get a single friend by ID
const getFriendById = async (req, res) => {
    try {
        const friend = await Friend.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }
        res.json(friend);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a friend
const updateFriend = async (req, res) => {
    try {
        const friend = await Friend.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }
        res.json(friend);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete a friend
const deleteFriend = async (req, res) => {
    try {
        const friend = await Friend.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }
        res.json({ message: 'Friend deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUpcomingBirthdays = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        // console.log("Requested days:", days);

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        // console.log("User ID from request:", req.user._id);

        const friends = await Friend.find({ userId: req.user._id });

        // Adding more debug logs here
        // console.log("All Friends:", friends);

        const upcomingBirthdays = friends
            .map(friend => {
                console.log(`Processing friend: ${friend.name}`);
                return new Friend(friend);
            })
            .filter(friend => friend !== null && friend.isBirthdayUpcoming(days)) // Only include valid friends
            .sort((a, b) => {
                const dateA = new Date(a.birthDate);
                const dateB = new Date(b.birthDate);
                dateA.setFullYear(new Date().getFullYear());
                dateB.setFullYear(new Date().getFullYear());
                return dateA - dateB;
            });

        // console.log("Upcoming Birthdays:", upcomingBirthdays);
        res.json(upcomingBirthdays);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get friends by group
const getFriendsByGroup = async (req, res) => {
    try {
        const friends = await Friend.find({
            userId: req.user._id,
            groups: req.params.group
        }).sort({ name: 1 });
        res.json(friends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update notification preferences
const updateNotificationPreferences = async (req, res) => {
    try {
        const friend = await Friend.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { notificationPreferences: req.body },
            { new: true, runValidators: true }
        );
        if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }
        res.json(friend);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const toggleNotification = async (req, res) => {
    try {
        const { friendId } = req.params;
        
        // Find the friend by ID
        const friend = await Friend.findById(friendId);
        if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        // Toggle the enabled status
        friend.notificationPreferences.enabled = !friend.notificationPreferences.enabled;
        await friend.save();

        return res.status(200).json({
            message: 'Notification preference updated successfully',
            enabled: friend.notificationPreferences.enabled
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = { createFriend, getAllFriends, getFriendById, updateFriend, deleteFriend, getUpcomingBirthdays, getFriendsByGroup, updateNotificationPreferences ,toggleNotification};
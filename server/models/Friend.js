const mongoose = require('mongoose');

const NotificationPreferenceSchema = new mongoose.Schema({
    days: [Number], // Array of days before birthday to notify (e.g., [1, 7, 30])
    time: {
        type: String,
        default: '09:00' // Default notification time
    },
    enabled: {
        type: Boolean,
        default: true
    }
});

const FriendSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    groups: [{
        type: String,
        trim: true
    }],
    notificationPreferences: {
        type: NotificationPreferenceSchema,
        default: () => ({})
    },
    lastNotificationSent: {
        type: Date
    },
    notes: {
        type: String,
        // trim: true
    },
    preferredWishTemplate: {
        type: String // Reference to template ID or name
    },
    relationship: {
        type: String,
        enum: ['family', 'friend', 'colleague', 'other'],
        default: 'friend'
    },
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Indexes for efficient querying
FriendSchema.index({ userId: 1, birthDate: 1 }); // For finding upcoming birthdays
FriendSchema.index({ userId: 1, groups: 1 }); // For group-based queries
FriendSchema.index({ userId: 1, name: 1 }); // For name-based searches

// Virtual field to get age
FriendSchema.virtual('age').get(function() {
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Method to check if birthday is upcoming within specified days
FriendSchema.methods.isBirthdayUpcoming = function(days = 30) {
    const today = new Date();
    let birthDate = new Date(this.birthDate);
    birthDate.setFullYear(today.getFullYear());
    if (birthDate < today) {
        birthDate.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = Math.abs(birthDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
};



const Friend = mongoose.model('Friend', FriendSchema);

module.exports = Friend;
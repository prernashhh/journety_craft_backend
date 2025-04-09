const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    }],
    itineraries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itinerary',
    }]
}, {
    timestamps: true
});

// Ensure each user can only have one wishlist
WishlistSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    destinations: [
        {
            location: String,
            arrivalDate: Date,
            departureDate: Date,
            accommodation: String,
        }
    ],
    events: [
        {
            name: String,
            date: Date,
            location: String,
            description: String,
        }
    ],
    price: {
        type: Number,
        required: true,
    },
    days: {
        type: Number,
        required: true,
    },
    nights: {
        type: Number,
        required: true,
    },
    rewardPoints: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Confirmed', 'Completed'],
        default: 'Draft',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Itinerary', ItinerarySchema);
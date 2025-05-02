const mongoose = require('mongoose');

const CustomItinerarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    selectedPopularPlaces: [{
        type: String
    }],
    dateRange: {
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date,
            required: true
        }
    },
    hotelRating: {
        type: String,
        enum: ['3-star', '4-star', '5-star'],
        required: true
    },
    travelMode: {
        type: String,
        enum: ['flight', 'train', 'bus', 'cab'],
        required: true
    },
    specialRequirements: [{
        type: String
    }],
    selectedAttractions: [{
        type: String
    }],
    additionalNotes: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending Review', 'In Progress', 'Confirmed', 'Rejected'],
        default: 'Pending Review'
    },
    estimatedPrice: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CustomItinerary', CustomItinerarySchema);
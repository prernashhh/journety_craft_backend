const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        city: { type: String, required: true },
        country: { type: String, required: true },
    },
    category: {
        type: String,
        required: true,
        enum: ['Cultural', 'Adventure', 'Food', 'Sightseeing', 'Workshop', 'Other']
    },
    price: {
        amount: { type: Number, required: true },
        currency: { type: String, default: 'INR' }
    },
    duration: {
        hours: { type: Number, required: true },
        minutes: { type: Number, default: 0 }
    },
    capacity: {
        type: Number,
        required: true
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['registered', 'waitlisted', 'cancelled'],
            default: 'registered'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        }
    }],
    images: [{
        url: { type: String },
        alt: { type: String }
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'cancelled', 'completed'],
        default: 'draft'
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Index for better query performance
EventSchema.index({ date: 1, status: 1 });
EventSchema.index({ 'location.city': 1, 'location.country': 1 });

// Virtual for checking if event is full
EventSchema.virtual('isFull').get(function() {
    return this.participants.length >= this.capacity;
});

// Method to check available spots
EventSchema.methods.getAvailableSpots = function() {
    return this.capacity - this.participants.length;
};

module.exports = mongoose.model('Event', EventSchema);
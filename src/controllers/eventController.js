const Event = require('../models/Event');

const eventController = {
    // Get all events
    getAllEvents: async (req, res) => {
        try {
            const events = await Event.find();
            res.json(events);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get event by ID
    getEventById: async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) return res.status(404).json({ message: 'Event not found' });
            res.json(event);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Create a new event
    createEvent: async (req, res) => {
        try {
            const newEvent = new Event(req.body);
            await newEvent.save();
            res.status(201).json(newEvent);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Update an event
    updateEvent: async (req, res) => {
        try {
            const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedEvent);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Delete an event
    deleteEvent: async (req, res) => {
        try {
            await Event.findByIdAndDelete(req.params.id);
            res.json({ message: 'Event deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = eventController;
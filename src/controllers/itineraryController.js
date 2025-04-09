const Itinerary = require('../models/Itinerary');

const itineraryController = {
    // Create new itinerary - only trip managers can create itineraries
    createItinerary: async (req, res) => {
        try {
            // Log received data for debugging
            console.log('Received data:', req.body);
            
            // Basic validation
            if (!req.body.title || !req.body.destination || !req.body.startDate || !req.body.endDate) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            
            // Format validation
            if (req.body.startDate > req.body.endDate) {
                return res.status(400).json({ error: 'Start date cannot be after end date' });
            }
            
            // Use the authenticated user's ID from req.user
            const newItinerary = new Itinerary({
                ...req.body,
                user: req.user._id
            });
            
            const savedItinerary = await newItinerary.save();
            res.status(201).json(savedItinerary);
        } catch (err) {
            console.error('Error creating itinerary:', err);
            
            // Return more specific error for MongoDB validation errors
            if (err.name === 'ValidationError') {
                const errors = Object.values(err.errors).map(e => e.message);
                return res.status(400).json({ error: errors.join(', ') });
            }
            
            res.status(400).json({ error: err.message });
        }
    },

    // Get all itineraries - both user types can access this
    getAllItineraries: async (req, res) => {
        try {
            const itineraries = await Itinerary.find()
                .populate('user', 'name email role'); // Populate organizer info
            res.json(itineraries);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get itineraries by a user
    getUserItineraries: async (req, res) => {
        try {
            const itineraries = await Itinerary.find({ user: req.user._id });
            res.json(itineraries);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Get an itinerary by ID
    getItineraryById: async (req, res) => {
        try {
            const itinerary = await Itinerary.findById(req.params.id)
                .populate('user', 'name email role'); // Populate organizer info
            
            if (!itinerary) return res.status(404).json({ error: 'Itinerary not found' });
            res.json(itinerary);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update an itinerary
    updateItinerary: async (req, res) => {
        try {
            const itinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!itinerary) return res.status(404).json({ error: 'Itinerary not found' });
            res.json(itinerary);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete an itinerary
    deleteItinerary: async (req, res) => {
        try {
            const itinerary = await Itinerary.findByIdAndDelete(req.params.id);
            if (!itinerary) return res.status(404).json({ error: 'Itinerary not found' });
            res.json({ message: 'Itinerary deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update the getItineraries function to populate organizer
    getItineraries: async (req, res) => {
        try {
            const itineraries = await Itinerary.find()
                .populate('organizer', 'name role')
                .sort('-createdAt');
            
            res.json(itineraries);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update getSingleItinerary function
    getSingleItinerary: async (req, res) => {
        try {
            const itinerary = await Itinerary.findById(req.params.id)
                .populate('organizer', 'name role'); 
            
            if (!itinerary) {
                return res.status(404).json({ message: 'Itinerary not found' });
            }
            
            res.json(itinerary);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = itineraryController;
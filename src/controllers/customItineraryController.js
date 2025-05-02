const CustomItinerary = require('../models/CustomItinerary');

const customItineraryController = {
    // Create new custom itinerary request
    createCustomItinerary: async (req, res) => {
        try {
            const newCustomItinerary = new CustomItinerary({
                ...req.body,
                user: req.user._id
            });

            const savedItinerary = await newCustomItinerary.save();
            res.status(201).json(savedItinerary);
        } catch (error) {
            console.error('Error creating custom itinerary:', error);
            res.status(400).json({ error: error.message });
        }
    },

    // Get all custom itineraries for a user
    getUserCustomItineraries: async (req, res) => {
        try {
            const customItineraries = await CustomItinerary.find({ user: req.user._id })
                .sort('-createdAt');
            res.json(customItineraries);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get a specific custom itinerary
    getCustomItineraryById: async (req, res) => {
        try {
            const customItinerary = await CustomItinerary.findById(req.params.id);
            if (!customItinerary) {
                return res.status(404).json({ error: 'Custom itinerary not found' });
            }
            if (customItinerary.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Not authorized to view this itinerary' });
            }
            res.json(customItinerary);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update custom itinerary status (for trip managers)
    updateCustomItineraryStatus: async (req, res) => {
        try {
            const { status, reviewNotes } = req.body;
            const itinerary = await CustomItinerary.findById(req.params.id);

            if (!itinerary) {
                return res.status(404).json({ error: 'Custom itinerary not found' });
            }

            itinerary.status = status;
            itinerary.reviewNotes = reviewNotes;
            itinerary.reviewedBy = req.user._id;

            await itinerary.save();
            res.json(itinerary);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete a custom itinerary
    deleteCustomItinerary: async (req, res) => {
        try {
            await req.itinerary.remove();
            res.json({ message: 'Custom itinerary deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all custom itineraries
    getAllCustomItineraries: async (req, res) => {
        try {
            const itineraries = await CustomItinerary.find()
                .populate('user', 'name email')
                .populate('reviewedBy', 'name role')
                .sort('-createdAt');
            res.json(itineraries);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = customItineraryController;
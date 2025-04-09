const Wishlist = require('../models/Wishlist');
const Event = require('../models/Event');
const Itinerary = require('../models/Itinerary');

const wishlistController = {
    // Get user's wishlist
    getWishlist: async (req, res) => {
        try {
            let wishlist = await Wishlist.findOne({ user: req.user._id })
                .populate('events')
                .populate('itineraries');
            
            // If no wishlist exists, create an empty one
            if (!wishlist) {
                wishlist = await Wishlist.create({
                    user: req.user._id,
                    events: [],
                    itineraries: []
                });
            }
            
            res.json(wishlist);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Add event to wishlist
    addEventToWishlist: async (req, res) => {
        try {
            const { eventId } = req.body;
            
            // Verify event exists
            const eventExists = await Event.findById(eventId);
            if (!eventExists) {
                return res.status(404).json({ error: 'Event not found' });
            }
            
            // Find or create wishlist
            let wishlist = await Wishlist.findOne({ user: req.user._id });
            if (!wishlist) {
                wishlist = await Wishlist.create({
                    user: req.user._id,
                    events: [eventId],
                    itineraries: []
                });
            } else {
                // Check if event already in wishlist
                if (wishlist.events.includes(eventId)) {
                    return res.status(400).json({ error: 'Event already in wishlist' });
                }
                
                // Add to wishlist
                wishlist.events.push(eventId);
                await wishlist.save();
            }
            
            res.json({ message: 'Event added to wishlist', wishlist });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Remove event from wishlist
    removeEventFromWishlist: async (req, res) => {
        try {
            const { eventId } = req.params;
            
            // Find wishlist
            const wishlist = await Wishlist.findOne({ user: req.user._id });
            if (!wishlist) {
                return res.status(404).json({ error: 'Wishlist not found' });
            }
            
            // Remove from wishlist
            wishlist.events = wishlist.events.filter(
                event => event.toString() !== eventId
            );
            await wishlist.save();
            
            res.json({ message: 'Event removed from wishlist', wishlist });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Add itinerary to wishlist
    addItineraryToWishlist: async (req, res) => {
        try {
            const { itineraryId } = req.body;
            
            // Verify itinerary exists
            const itineraryExists = await Itinerary.findById(itineraryId);
            if (!itineraryExists) {
                return res.status(404).json({ error: 'Itinerary not found' });
            }
            
            // Find or create wishlist
            let wishlist = await Wishlist.findOne({ user: req.user._id });
            if (!wishlist) {
                wishlist = await Wishlist.create({
                    user: req.user._id,
                    events: [],
                    itineraries: [itineraryId]
                });
            } else {
                // Check if itinerary already in wishlist
                if (wishlist.itineraries.includes(itineraryId)) {
                    return res.status(400).json({ error: 'Itinerary already in wishlist' });
                }
                
                // Add to wishlist
                wishlist.itineraries.push(itineraryId);
                await wishlist.save();
            }
            
            res.json({ message: 'Itinerary added to wishlist', wishlist });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Remove itinerary from wishlist
    removeItineraryFromWishlist: async (req, res) => {
        try {
            const { itineraryId } = req.params;
            
            // Find wishlist
            const wishlist = await Wishlist.findOne({ user: req.user._id });
            if (!wishlist) {
                return res.status(404).json({ error: 'Wishlist not found' });
            }
            
            // Remove from wishlist
            wishlist.itineraries = wishlist.itineraries.filter(
                itinerary => itinerary.toString() !== itineraryId
            );
            await wishlist.save();
            
            res.json({ message: 'Itinerary removed from wishlist', wishlist });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Check if item is in wishlist
    checkWishlistItem: async (req, res) => {
        try {
            const { type, itemId } = req.params;
            
            if (type !== 'event' && type !== 'itinerary') {
                return res.status(400).json({ error: 'Invalid type parameter' });
            }
            
            const wishlist = await Wishlist.findOne({ user: req.user._id });
            if (!wishlist) {
                return res.json({ inWishlist: false });
            }
            
            let inWishlist = false;
            if (type === 'event') {
                inWishlist = wishlist.events.includes(itemId);
            } else {
                inWishlist = wishlist.itineraries.includes(itemId);
            }
            
            res.json({ inWishlist });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = wishlistController;
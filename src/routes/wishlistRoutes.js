const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const wishlistController = require('../controllers/wishlistController');

// Get wishlist
router.get('/', protect, wishlistController.getWishlist);

// Add event to wishlist
router.post('/events', protect, wishlistController.addEventToWishlist);

// Remove event from wishlist
router.delete('/events/:eventId', protect, wishlistController.removeEventFromWishlist);

// Add itinerary to wishlist
router.post('/itineraries', protect, wishlistController.addItineraryToWishlist);

// Remove itinerary from wishlist
router.delete('/itineraries/:itineraryId', protect, wishlistController.removeItineraryFromWishlist);

// Check if item is in wishlist
router.get('/check/:type/:itemId', protect, wishlistController.checkWishlistItem);

module.exports = router;
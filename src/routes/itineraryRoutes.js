
const express = require('express');
const router = express.Router();
const { protect, isTripManager } = require('../middleware/auth');
const itineraryController = require('../controllers/itineraryController');

// Create an itinerary - only trip managers
router.post('/', protect, isTripManager, itineraryController.createItinerary);

// Get all itineraries - all authenticated users
router.get('/', protect, itineraryController.getAllItineraries);

// Get user's itineraries - all authenticated users
router.get('/my-itineraries', protect, itineraryController.getUserItineraries);

// Get an itinerary by ID - all authenticated users
router.get('/:id', protect, itineraryController.getItineraryById);

// Update an itinerary - only trip managers
router.put('/:id', protect, isTripManager, itineraryController.updateItinerary);

// Delete an itinerary - only trip managers
router.delete('/:id', protect, isTripManager, itineraryController.deleteItinerary);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const customItineraryController = require('../controllers/customItineraryController');

router.post('/', protect, customItineraryController.createCustomItinerary);
router.get('/', protect, customItineraryController.getUserCustomItineraries);
router.get('/:id', protect, customItineraryController.getCustomItineraryById);

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  getConversations, 
  getMessagesBetweenUsers, 
  sendMessage,
  markMessagesAsRead
} = require('../controllers/messageController');

// Get all conversations for the current user
router.get('/conversations', protect, getConversations);

// Get messages between current user and another user
router.get('/:otherUserId', protect, getMessagesBetweenUsers);

// Mark messages as read
router.put('/:otherUserId/read', protect, markMessagesAsRead);

// Send a message
router.post('/', protect, sendMessage);

module.exports = router;
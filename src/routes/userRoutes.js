// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); 
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    followUser, 
    unfollowUser, 
    getFollowing, 
    getFollowers,
    checkFollowStatus,
    getMutualFollowers,
    updateUserInterests
} = require('../controllers/userController');

// Place special routes BEFORE the /:id route to prevent path conflicts
// User account management
router.post('/', protect, createUser);
router.get('/', protect, getAllUsers);

// Special routes for current user
router.get('/me/following', protect, getFollowing); 
router.get('/me/followers', protect, getFollowers); 
router.get('/me/mutual-followers', protect, getMutualFollowers); 
router.put('/me/interests', protect, updateUserInterests); // Add this route

// Follow/unfollow routes
router.post('/follow/:userId', protect, followUser);
router.delete('/follow/:userId', protect, unfollowUser);

// User profile routes
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;


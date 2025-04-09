const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'Invalid token. User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

// New middleware to check if user is a trip manager
const isTripManager = (req, res, next) => {
    if (req.user && req.user.role === 'trip_manager') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Trip manager role required.' });
    }
};

// Middleware to check if user is either a trip manager or a specific resource owner
const isOwnerOrTripManager = (req, res, next) => {
    if (req.user && (req.user.role === 'trip_manager' || req.resourceOwnerId === req.user._id.toString())) {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
};

module.exports = { protect, isTripManager, isOwnerOrTripManager };
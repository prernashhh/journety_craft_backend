const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const validateRegistration = (name, email, password) => {
    const errors = {};
    
    // Name validation
    if (!name || name.trim().length === 0) {
        errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
        errors.email = 'Invalid email format';
    }

    // Password validation
    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Update the register function to accept role and interests
const register = async (req, res) => {
    try {
        const { name, email, password, role, interests } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'error',
                error: 'Missing required fields',
                details: {
                    name: !name ? 'Name is required' : null,
                    email: !email ? 'Email is required' : null,
                    password: !password ? 'Password is required' : null
                }
            });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                error: 'User already exists',
                details: { email: 'Email is already registered' }
            });
        }

        // Create user with role and interests (default to 'traveller' if not specified)
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password,
            role: role || 'traveller',
            interests: interests || []
        });

        // Generate token
        const token = generateToken(user._id);

        // Send response
        res.status(201).json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    interests: user.interests
                },
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            status: 'error',
            error: 'Registration failed',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Update other relevant functions to include role in response
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// In the getProfile function, update to include following/followers count
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            followingCount: user.following?.length || 0,
            followersCount: user.followers?.length || 0,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { 
                name: req.body.name,
                email: req.body.email 
            },
            { new: true, runValidators: true }
        );

        res.json({
            id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Google auth to include role selection
const googleAuth = async (req, res) => {
    try {
        const { name, email, uid, photoURL, role } = req.body;

        if (!email || !uid) {
            return res.status(400).json({ error: 'Missing required fields from Google authentication' });
        }

        // Check if user already exists
        let user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
                name: name || 'Google User',
                email: email.toLowerCase(),
                googleId: uid,
                profilePicture: photoURL || '',
                role: role || 'traveller', // Default to traveller if not specified
                password: uid + process.env.JWT_SECRET, // Create a secure password they'll never use
            });
        } else {
            // Update existing user with Google ID if needed
            if (!user.googleId) {
                user.googleId = uid;
                await user.save();
            }
        }

        // Generate token
        const token = generateToken(user._id);

        // Send response
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture || '',
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            error: 'Google authentication failed',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    interests: user.interests,
                    followers: user.followers,
                    following: user.following
                }
            }
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    googleAuth,
    getMe
};
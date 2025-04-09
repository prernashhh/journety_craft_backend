const User = require('../models/User'); // Import User model

// Create User
const createUser = async (req, res) => {
    console.log("Inside createUser Controller");

    try {
        const { username, email, password } = req.body;
        console.log("Received Data:", { username, email, password });

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ username, email, password });

        await newUser.save();

        console.log("User Created:", newUser);

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error in createUser:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get User by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { username, email },
            { new: true } // Return the updated user
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Follow a user
const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Cannot follow yourself
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    
    // Check if already following
    const currentUser = await User.findById(req.user._id);
    if (currentUser.following.includes(userId)) {
      return res.status(400).json({ error: 'Already following this user' });
    }
    
    // Update following list for current user
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { following: userId } }
    );
    
    // Update followers list for target user
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { followers: req.user._id } }
    );
    
    res.status(200).json({ message: 'Successfully followed user' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update following list for current user
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: userId } }
    );
    
    // Update followers list for target user
    await User.findByIdAndUpdate(
      userId,
      { $pull: { followers: req.user._id } }
    );
    
    res.status(200).json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get following list
const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('following', 'name email role');
      
    res.status(200).json(user.following || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get followers list
const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers', 'name email role');
      
    res.status(200).json(user.followers || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if current user follows a specific user
const checkFollowStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const currentUser = await User.findById(req.user._id);
    const isFollowing = currentUser.following.includes(userId);
    
    res.json({ following: isFollowing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update the getMutualFollowers function

// Get mutual followers (users who follow each other)
const getMutualFollowers = async (req, res) => {
  try {
    console.log('Getting mutual followers for user:', req.user._id);
    
    // Get the current user with populated following and followers
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Current user following count:', currentUser.following.length);
    console.log('Current user followers count:', currentUser.followers.length);

    // Get all followers and following as strings for easier comparison
    const following = currentUser.following.map(id => id.toString());
    const followers = currentUser.followers.map(id => id.toString());
    
    console.log('Following IDs:', following);
    console.log('Follower IDs:', followers);
    
    // Find users who are in both arrays (mutual followers)
    const mutualIds = following.filter(id => followers.includes(id));
    
    console.log('Mutual follower IDs:', mutualIds);
    
    // Fetch complete user info for these mutual followers
    const mutualFollowers = await User.find({ 
      _id: { $in: mutualIds } 
    }, {
      name: 1,
      email: 1,
      role: 1,
      profilePicture: 1
    });

    console.log('Found mutual followers:', mutualFollowers.length);
    res.status(200).json(mutualFollowers);
  } catch (error) {
    console.error('Error getting mutual followers:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateUserInterests = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { interests: req.body.interests },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Interests updated successfully", user });
    } catch (error) {
        console.error("Error updating interests:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Export all functions
module.exports = { 
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
};

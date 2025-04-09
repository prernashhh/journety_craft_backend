const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Get all conversations for a user
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get latest message from each conversation 
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new ObjectId(userId) },
            { receiver: new ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", new ObjectId(userId)] },
              then: "$receiver",
              else: "$sender"
            }
          },
          lastMessage: { $first: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          name: '$userDetails.name',
          email: '$userDetails.email',
          profilePicture: '$userDetails.profilePicture'
        }
      }
    ]);

    // Format the response
    const formattedConversations = conversations.map(conv => ({
      id: conv._id,
      user: {
        _id: conv._id,
        name: conv.name || 'Unknown User',
        email: conv.email || '',
        profilePicture: conv.profilePicture || ''
      },
      lastMessage: conv.lastMessage?.content || '',
      lastMessageTime: conv.lastMessage?.createdAt || new Date(),
      unreadCount: 0 // Add unread counts in a future update
    }));

    res.status(200).json(formattedConversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get messages between two users
const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user._id;

    // Verify if the users follow each other before allowing messages
    const currentUser = await User.findById(currentUserId);
    const otherUser = await User.findById(otherUserId);

    if (!currentUser || !otherUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if they follow each other
    const currentUserFollowingIds = currentUser.following.map(id => id.toString());
    const otherUserFollowingIds = otherUser.following.map(id => id.toString());
    
    const mutualFollow = 
      currentUserFollowingIds.includes(otherUserId.toString()) && 
      otherUserFollowingIds.includes(currentUserId.toString());

    if (!mutualFollow) {
      return res.status(403).json({ 
        error: 'You can only message users who follow you and you follow back' 
      });
    }

    // Get messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    // Format messages for frontend
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      content: msg.content,
      createdAt: msg.createdAt,
      senderId: msg.sender.toString(),
      recipientId: msg.receiver.toString(),
      read: msg.read
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: error.message });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user._id;

    // Validate input
    if (!recipientId || !content) {
      return res.status(400).json({ error: 'Recipient ID and message content are required' });
    }

    // Verify if the users follow each other before allowing messages
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if they follow each other
    const senderFollowingIds = sender.following.map(id => id.toString());
    const recipientFollowingIds = recipient.following.map(id => id.toString());
    
    const mutualFollow = 
      senderFollowingIds.includes(recipientId.toString()) && 
      recipientFollowingIds.includes(senderId.toString());

    if (!mutualFollow) {
      return res.status(403).json({ 
        error: 'You can only message users who follow you and you follow back' 
      });
    }

    // Create and save the message
    const message = new Message({
      sender: senderId,
      receiver: recipientId,
      content
    });

    await message.save();
    
    // Format the response
    const formattedMessage = {
      _id: message._id,
      content: message.content,
      createdAt: message.createdAt,
      senderId: message.sender.toString(),
      recipientId: message.receiver.toString(),
      read: message.read
    };
    
    res.status(201).json(formattedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mark messages as read
const markMessagesAsRead = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user._id;

    // Mark messages from the other user to current user as read
    await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getConversations,
  getMessagesBetweenUsers,
  sendMessage,
  markMessagesAsRead
};
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth } = require('../middleware/authMiddleware'); 
const jwt = require('jsonwebtoken');
const Budget = require('../models/Budget'); 

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, 'unbreakable key', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected route: Get user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    // Access the authenticated user's information from req.userData
    const { userId } = req.userData;

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's profile information
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.patch('/profile', requireAuth, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findById(req.userData.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (email) user.email = email;
    if (password) user.password = password; 
    await user.save();
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.userData.userId;

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated budget items
    const result = await Budget.deleteMany({ userId });

    // Check if any budget items were deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No budget items found for the user' });
    }

    res.status(200).json({ message: 'User and associated budget items deleted successfully' });
  } catch (error) {
    console.error('Error deleting user and associated budget items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

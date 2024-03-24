const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const Income = require('../models/Income');

// Get user's monthly income
router.get('/money', requireAuth, async (req, res) => {
  try {
    const userId = req.userData.userId;
    const income = await Income.findOne({ userId });
    if (!income) {
      return res.status(404).json({ message: 'Monthly income not found' });
    }
    res.status(200).json([income]); // Wrap the income object in an array to match the frontend response
  } catch (error) {
    console.error('Error fetching monthly income:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add or update user's monthly income
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.userData.userId;
    const { monthlyIncome } = req.body;

    let income = await Income.findOne({ userId });
    if (!income) {
      // If income record doesn't exist, create a new one
      income = new Income({ userId, monthlyIncome });
    } else {
      // If income record exists, update it
      income.monthlyIncome = monthlyIncome;
    }

    await income.save();
    res.status(200).json({ message: 'Monthly income updated successfully' });
  } catch (error) {
    console.error('Error updating monthly income:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete user's monthly income
router.delete('/', requireAuth, async (req, res) => {
  try {
    const userId = req.userData.userId;
    const income = await Income.findOneAndDelete({ userId });
    if (!income) {
      return res.status(404).json({ message: 'Monthly income not found' });
    }
    res.status(200).json({ message: 'Monthly income deleted successfully' });
  } catch (error) {
    console.error('Error deleting monthly income:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

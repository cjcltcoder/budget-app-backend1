const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Add this line to import mongoose
const Budget = require('../models/Budget');
const { requireAuth } = require('../middleware/authMiddleware');

// Middleware to validate ObjectId format
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Get all budget categories
router.get('/categories', requireAuth, async (req, res) => {
  try {
    const categories = await Budget.find({ userId: req.userData.userId }, 'category budget');
    console.log('Fetched categories:', categories);
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new budget item
router.post('/', requireAuth, async (req, res) => {
  try {
    const { category, budget, userId } = req.body; // Extract user ID from request body
    const newBudget = new Budget({ category, budget, userId }); // Include user ID when creating new budget item
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Update a budget item
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { category, budget, userId } = req.body; // Extract user ID from request body
    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: userId }, // Find budget item by ID and user ID
      { category, budget },
      { new: true }
    );
    if (!updatedBudget) {
      return res.status(404).json({ message: 'Budget item not found' });
    }
    res.status(200).json(updatedBudget);
  } catch (error) {
    console.error('Error updating budget item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Delete a budget item
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid _id format' });
    }

    const deletedBudget = await Budget.findOneAndDelete({ _id: id, userId: req.userData.userId });
    if (!deletedBudget) {
      return res.status(404).json({ message: 'Budget item not found' });
    }
    res.status(200).json({ message: 'Budget item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const { requireAuth } = require('../middleware/authMiddleware'); // Import the requireAuth middleware

// Get all budget categories
router.get('/categories', requireAuth, async (req, res) => {
  try {
    const categories = await Budget.find({ userId: req.userData.userId }, 'category budget');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new budget item
router.post('/', requireAuth, async (req, res) => {
  try {
    const { category, budget } = req.body;
    const newBudget = new Budget({ category, budget, userId: req.userData.userId });
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a budget item
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { category, budget } = req.body;
    const updatedBudget = await Budget.findOneAndUpdate({ _id: req.params.id, userId: req.userData.userId }, { category, budget }, { new: true });
    if (!updatedBudget) {
      return res.status(404).json({ message: 'Budget item not found' });
    }
    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a budget item
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deletedBudget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.userData.userId });
    if (!deletedBudget) {
      return res.status(404).json({ message: 'Budget item not found' });
    }
    res.status(200).json({ message: 'Budget item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const { requireAuth } = require('../middleware/authMiddleware');

// Middleware to validate ObjectId format
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Get all budget categories
router.get('/categories', requireAuth, async (req, res) => {
  try {
    const categories = await Budget.find({ userId: req.userData.userId }).select('category budget tags').exec();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new budget item
router.post('/', requireAuth, async (req, res) => {
  try {
    const { category, budget, userId, tag } = req.body;
    const newBudget = new Budget({ category, budget, userId, tag });
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Update a budget item
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { category, budget, userId, newTag, tagToDelete } = req.body; 

    let updateQuery = { category, budget }; 

    // If newTag is provided, add it to the tags array
    if (newTag) {
      updateQuery.$addToSet = { tags: newTag }; 
    }

    // If tagToDelete is provided, remove it from the tags array
    if (tagToDelete) {
      updateQuery.$pull = { tags: tagToDelete }; // Use $pull to remove the tagToDelete from tags array
    }

    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId },
      updateQuery, // Use the updateQuery object
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

// router.delete('/:id/tags/:tagToDelete', requireAuth, async (req, res) => {
//   try {
//     const { id, tagToDelete } = req.params;
//     const userId = req.user.id; // Assuming userId is available from authentication middleware

//     const updatedBudget = await Budget.findOneAndUpdate(
//       { _id: id, userId },
//       { $pull: { tags: tagToDelete } }, // Remove the specified tag from the tags array
//       { new: true }
//     );

//     if (!updatedBudget) {
//       return res.status(404).json({ message: 'Budget item not found or tag not present' });
//     }

//     res.status(200).json(updatedBudget);
//   } catch (error) {
//     console.error('Error deleting tag:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


// Delete a budget item
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.userData.userId;
    const budgetItemId = req.params.id;

    const deletedBudgetItem = await Budget.findOneAndDelete({ _id: budgetItemId, userId });

    if (!deletedBudgetItem) {
      return res.status(404).json({ message: 'Budget item not found' });
    }

    res.status(200).json({ message: 'Budget item deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

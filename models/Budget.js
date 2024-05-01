const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  tags: [String]
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
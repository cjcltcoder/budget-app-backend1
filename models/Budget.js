const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  }
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
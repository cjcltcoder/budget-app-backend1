const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  monthlyIncome: { type: Number, required: true },
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;

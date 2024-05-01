const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.DB_NAME
})
.then(() => {
  console.log('MongoDB connected successfully');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  
});

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/budgets', budgetRoutes); 
app.use('/income', incomeRoutes);

module.exports = app;

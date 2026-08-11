const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sisindri:9988@flash2martcluster.dqcaeea.mongodb.net/?appName=flash2martCluster';

// MongoDB Connection
mongoose.connect(MONGO_URI)
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error pls clear:', err));

// Routes
const deliveryRoutes = require('./routes/deliveryRoutes');
app.use('/api/delivery', deliveryRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Flash2Mart Backend is Running Successfully! 🚀');
});

// Server Listen
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

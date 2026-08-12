const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Env variable నుండి మాత్రమే Mongo URI తీసుకోండి
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is missing in Environment Variables!');
}

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

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

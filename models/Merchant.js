const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const merchantSchema = new mongoose.Schema({
  storeName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  ownerName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  phone: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

// పాస్‌వర్డ్ సెక్యూర్ గా Hash చేయడం కోసం
merchantSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Merchant', merchantSchema);
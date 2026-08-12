const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Merchant = require('../models/Merchant');

// MERCHANT REGISTER API
router.post('/register', async (req, res) => {
  try {
    const { storeName, ownerName, phone, category, location, password } = req.body;

    if (!storeName || !ownerName || !phone || !category || !location || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'దయచేసి అన్ని వివరాలను ఎంటర్ చేయండి.' 
      });
    }

    const existingMerchant = await Merchant.findOne({ phone });
    if (existingMerchant) {
      return res.status(400).json({ 
        success: false, 
        message: 'ఈ మొబైల్ నంబర్ ఇప్పటికే రిజిస్టర్ చేయబడింది.' 
      });
    }

    const newMerchant = new Merchant({
      storeName,
      ownerName,
      phone,
      category,
      location,
      password
    });

    await newMerchant.save();

    res.status(201).json({ 
      success: true, 
      message: 'మర్చంట్ రిజిస్ట్రేషన్ విజయవంతమైంది!' 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'సర్వర్ ఎర్రర్: ' + error.message 
    });
  }
});

// MERCHANT LOGIN API
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'దయచేసి ఫోన్ నంబర్ మరియు పాస్‌వర్డ్ ఎంటర్ చేయండి.' 
      });
    }

    const merchant = await Merchant.findOne({ phone });
    if (!merchant) {
      return res.status(404).json({ 
        success: false, 
        message: 'ఈ నంబర్‌తో ఏ అకౌంట్ కనుగొనబడలేదు.' 
      });
    }

    const isMatch = await bcrypt.compare(password, merchant.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'పాస్‌వర్డ్ సరిపోలేదు.' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'లాగిన్ విజయవంతమైంది!',
      data: {
        id: merchant._id,
        storeName: merchant.storeName,
        ownerName: merchant.ownerName,
        phone: merchant.phone,
        category: merchant.category,
        location: merchant.location
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'సర్వర్ ఎర్రర్: ' + error.message 
    });
  }
});

module.exports = router;
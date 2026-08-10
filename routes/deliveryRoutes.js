const express = require('express');
const router = express.Router(); // <--- ఈ లైన్ కచ్చితంగా ఉండాలి!
const DeliveryPartner = require('../models/DeliveryPartner');
const bcrypt = require('bcryptjs');

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, phone, vehicleNumber, password } = req.body;

    const existingPartner = await DeliveryPartner.findOne({ phone });
    if (existingPartner) {
      return res.status(400).json({ success: false, message: 'ఈ ఫోన్ నంబర్‌తో ఇప్పటికే ఖాతా ఉంది!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newPartner = new DeliveryPartner({
      name,
      phone,
      vehicleNumber,
      password: hashedPassword,
    });

    await newPartner.save();

    res.status(201).json({ success: true, message: 'రిజిస్ట్రేషన్ విజయవంతమైంది!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'సర్వర్ ఎర్రర్', error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    const partner = await DeliveryPartner.findOne({ phone });
    if (!partner) {
      return res.status(404).json({ success: false, message: 'ఈ ఫోన్ నంబర్‌తో ఖాతా లేదు!' });
    }

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'తప్పు పాస్‌వర్డ్ ఎంటర్ చేశారు!' });
    }

    res.status(200).json({
      success: true,
      message: 'లాగిన్ విజయవంతమైంది!',
      partner: {
        id: partner._id,
        name: partner.name,
        phone: partner.phone,
        vehicleNumber: partner.vehicleNumber,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'సర్వర్ ఎర్రర్', error: error.message });
  }
});

module.exports = router;
// Login Route
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'దయచేసి ఫోన్ నంబర్ మరియు పాస్‌వర్డ్ ఎంటర్ చేయండి!' });
    }

    // ఫోన్ నంబర్ డేటాబేస్‌లో ఉందో లేదో చెక్ చేయడం
    const partner = await DeliveryPartner.findOne({ phone });
    if (!partner) {
      return res.status(404).json({ success: false, message: 'ఈ ఫోన్ నంబర్‌తో ఖాతా లేదు!' });
    }

    // పాస్‌వర్డ్ సరిపోలిందో లేదో చెక్ చేయడం
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
    console.error("Login Route Error:", error); // ఇది రైల్వే లాగ్స్‌లో అసలు ఎర్రర్ చూపిస్తుంది
    res.status(500).json({ success: false, message: 'సర్వర్ ఎర్రర్: ' + error.message });
  }
});
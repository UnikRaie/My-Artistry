// routes/payments.js

const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const auth = require('../middleware/auth'); 

// Fetch payment details
router.get('/payments-info', auth, async (req, res) => {
  const userId = req.userId; 

  try {
    // Find payments where paidtoId or paidbyId matches the userId
    const payments = await Payment.find({
      $or: [{ paidtoId: userId }, { paidbyId: userId }]
    }).populate('booking');

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

module.exports = router;

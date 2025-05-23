const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/Users');
const router = express.Router();

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by email in the token
    const user = await UserModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user's password
    user.password = newPassword;
    await user.save();

    res.json("Password has been reset successfully.");
  } catch (err) {
    console.error("Error resetting password:", err);
    if (err.name === 'JsonWebTokenError') {
      res.status(400).json({ error: "Invalid token" });
    } else if (err.name === 'TokenExpiredError') {
      res.status(400).json({ error: "Token expired" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

module.exports = router;

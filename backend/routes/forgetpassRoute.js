
const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserModel = require('../models/Users');
const router = express.Router();
require('dotenv').config();


// Function to generate a JWT token with user email as payload
const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  //  email configuration

  host:'smtp.gmail.com',
  port: '587',
  secure: false,
  auth: {
    user: 'myartistry404@gmail.com', // Your email address
    pass: 'Shutthefuckup@36' // Your email password
  }
});

router.post('/forget-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate JWT token
    const token = generateToken(email);

    // Send password reset instructions via email
    const mailOptions = {
      from: 'mymusic.fyp@gmail.com', // Your email address
      to: user.email,
      subject: 'Password Reset Instructions',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n`
        + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
        + `http://localhost:3000/reset-password?token=${token}\n\n`
        + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);
    res.json("Password reset instructions sent to your email.");
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

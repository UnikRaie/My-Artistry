// routes/registerRoute.js
const express = require('express');
const router = express.Router();
const UserModel = require('../models/Users');
const ArtistModel = require('../models/Artist'); // Import Artist model
const hirerModel = require('../models/Hirer'); // Import Hirer model


// ===============Creating New Users===========================
// Handle POST requests to '/register'
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the user with the given email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
      
    }

    // Create a new user
    const newUser = new UserModel({
      name,
      email,
      password,
      role,
    });

    // Save the user to the database
    await newUser.save();

    // Create corresponding artist or hirer record based on role
    if (role === 'artist') {
      const newArtist = new ArtistModel({
        
        userId: newUser._id,
        name: newUser.name, // Use newUser's name
        email: newUser.email, // Use newUser's email
      });
      await newArtist.save();
    } else if (role === 'hirer') {
      const newHirer = new hirerModel({
        name: newUser.name, // Use newUser's name
        email: newUser.email, // Use newUser's email
        userId: newUser._id,
        
      });
      await newHirer.save();
    }

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

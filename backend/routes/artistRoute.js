

const express = require('express');
const router = express.Router();
const ArtistModel = require('../models/Artist'); 
const auth= require('../middleware/auth.js');




//  to fetch artist information
router.get('/a', auth, async (req, res) => {
  try {
    const userId = req.userId; // Use the user ID extracted from the token
    const artist = await ArtistModel.findOne({ userId: userId }).populate('userId', 'name email phoneNo'); // Populate user details if needed
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    res.json(artist);
  } catch (error) {
    console.error('Error fetching artist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//================Update Profile=================
router.post('/update', auth, async(req, res)=>{
  try {
    const userId = req.userId;

    const artist = await ArtistModel.findOne({ userId: userId }); 
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    // Extract data from request body
    const { name, email, genres, type, pricePerShow, location, phoneNo, bio, specialization } = req.body;

    // Update user profile information
    
    const updatedArtistData = {
      name,
      email,
      specialization,
      genres,
      type,
      pricePerShow,
      location,
      phoneNo,
      bio
    
    };

    // Find the user by ID and update their profile
    const updateArtist = await ArtistModel.findOneAndUpdate({userId: userId } , updatedArtistData, { new: true });

    if (!updateArtist) {
      // If user is not found, return an error response
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // User profile updated successfully
    res.status(200).json({ success: true, message: 'Profile updated successfully', user: updateArtist });
  } catch (error) {
    // If any error occurs during the process, return an error response
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }

});

module.exports = router;

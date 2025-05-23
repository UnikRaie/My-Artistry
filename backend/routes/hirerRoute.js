

const express = require('express');
const router = express.Router();
const HirerModel = require('../models/Hirer.js'); 
const auth= require('../middleware/auth.js');


//  to fetch hirer information
router.get('/hirer', auth, async (req, res) => {
  try {
    const userId = req.userId; // Use the user ID extracted from the token
    console.log(userId)
   const User = await HirerModel.findOne({ userId: userId })
    if (!User) {
      return res.status(404).json({ message: 'Hirer not found' });
    }
    
    res.json (User);
  } catch (error) {
    console.error('Error fetching hirer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//================Update Profile=================
router.post('/updatehirer', auth, async(req, res)=>{
  try {
    const userId = req.userId;

    const hirer = await HirerModel.findOne({ userId: userId }); 
    if (!hirer) {
      return res.status(404).json({ message: 'hirer not found' });
    }
    
    // Extract data from request body
    const { name, email, location, phoneNo, bio } = req.body;

    // Update user profile information
    
    const updatedHirerData = {
      name,
      email,
      location,
      phoneNo,
      bio
    
    };

    // Find the user by ID and update their profile
    const updateHirer = await HirerModel.findOneAndUpdate({userId: userId } , updatedHirerData, { new: true });

    if (!updateHirer) {
      // If user is not found, return an error response
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // User profile updated successfully
    res.status(200).json({ success: true, message: 'Profile updated successfully', user: updateHirer });
  } catch (error) {
    // If any error occurs during the process, return an error response
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }

});

module.exports = router;

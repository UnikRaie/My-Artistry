const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth")
const ArtistModel = require('../models/Artist.js'); 
const HirerModel = require('../models/Hirer.js'); 
const UserModel = require('../models/Users.js'); 
const RatingModel = require('../models/Rating'); 

//route to fetch rating data
// Route to fetch rating data
router.get('/fetch-rating/:Rated_to_id', async (req, res) => {
  try {
    const { Rated_to_id } = req.params;
    console.log(Rated_to_id) 
    const Ratingsinfo = await RatingModel.find({ Rated_to_id: Rated_to_id }); // Use the correct parameter name

    res.json(Ratingsinfo);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});




// Route to handle rating and comment submission
router.post('/submit_Ratings',auth, async (req, res) => {
    try {
      const  userId = req.userId;
      console.log(userId)
      const user = await UserModel.findOne({ _id: userId });
      console.log(user.role)
      let User;
      if(user.role === "artist"){
            User = await ArtistModel.findOne({ userId: userId });
      }
      else{
        User = await HirerModel.findOne({ userId: userId });
      }

      const { rating, comment ,Rated_to_id} = req.body;
      console.log(Rated_to_id)
      const Rated_by_pic = User.profilePic;
      const Rated_by_id = User.userId;
      const Rated_by_Name = User.name;
  
      // Save the rating and comment to the database
      const newRating = new RatingModel({ 
        Rated_by_id,
        Rated_by_Name,
        Rated_by_pic,
        Rated_to_id,
        rating, 
        comment,
        CreatedAt: new Date()
     });
      await newRating.save();
  
      res.status(201).json({ success:true, message: 'Rating and comment saved successfully' });
    } catch (error) {
      console.error('Error saving rating and comment:', error);
      res.status(500).json({ message: 'An error occurred while saving rating and comment' });
    }
  });
  


module.exports = router;

const express = require('express');
const router = express.Router();
const UserModel = require('../models/Users'); 
const auth= require('../middleware/auth.js');

//===============get Login email=======
router.get('/Login_email', auth, async (req, res) => {
    try {
      const userId = req.userId; // Use the user ID extracted from the token
      const User = await UserModel.findOne({ _id: userId }) 
      if (!User) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(User.email);
    } catch (error) {
      console.error('Error fetching artist:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  // ===================update login email========
  router.post('/email_update',auth, async(req,res) =>{
    // Extract data from request body
    const {Login_email } = req.body;
    console.log(Login_email);
    try {
        const userId = req.userId; // Use the user ID extracted from the token
        console.log(userId);
        const User = await UserModel.findOne({ _id: userId }) 
        if (!User) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        User.email = Login_email
        console.log(User.email)
        await User.save();
    
        // User email updated successfully
        res.status(200).json({ success: true, message: 'email updated successfully'});
      } catch (error) {
        // If any error occurs during the process, return an error response
        console.error('Error updating:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    
  } );
 
  //=========================================ChangeLogin Password===============
  router.post('/change_password',auth, async(req,res) =>{
    // Extract data from request body
    const {current_password, new_password } = req.body;
    
    try {
        const userId = req.userId; // Use the user ID extracted from the token
        console.log(userId);
        const User = await UserModel.findOne({ _id: userId }) 
        if (!User) {
          return res.status(404).json({ message: 'User not found' });
        }
        if(!current_password === User.password){
            return res.status(404).json({success:false, message: 'Password Do not match' });
        }
        User.password = new_password
        await User.save();
    
        // User password updated successfully
        res.status(200).json({ success: true, message: 'password updated successfully'});
      } catch (error) {
        // If any error occurs during the process, return an error response
        console.error('Error updating:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    
  } );
 
  module.exports = router;
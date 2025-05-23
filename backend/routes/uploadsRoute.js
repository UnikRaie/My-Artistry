const express = require('express');
const router = express.Router();
const multer  = require('multer');
const auth = require('../middleware/auth')
const ArtistModel = require('../models/Artist'); 
const HirerModel = require('../models/Hirer'); 
const UserModel = require('../models/Users'); 
const path = require('path')




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/Images') // Destination folder where files will be saved
    },
    filename: function (req, file, cb) {
        
        cb(null, file.fieldname + "-"+Date.now()+path.extname(file.originalname))
    }
  });
  
  const upload = multer({ storage: storage });
  
  // Endpoint to handle profile photo upload
router.post('/uploadProfilePhoto',auth, upload.single('file'), async(req, res) => {
    console.log(req.file)
    const userId =req.userId
    const Artist = await UserModel.findOne({_id: userId})
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    if (Artist.role === "artist" ){
       try{

        const artist = await ArtistModel.findOne({ userId: userId }); 
       
        if (!artist) {
         return res.status(404).json({ message: 'Artist not found' });
         }

         //update the artist profile pic filemname in db
         artist.profilePic = req.file.filename
         await artist.save();
         res.status(200).send('Profile photo uploaded and saved successfully');
    }catch(err){
        console.error('Error saving profile photo to user:', error);
        res.status(500).send('Internal server hello error');
    } } 
    else{
        try{

        const hirer = await HirerModel.findOne({ userId: userId }); 
        if (!hirer) {
         return res.status(404).json({ message: 'Hirer not found' });
         }

         //update the hirer profile pic filemname in db
         hirer.profilePic = req.file.filename
         await hirer.save();
         res.status(200).send('Profile photo uploaded and saved successfully');
    }catch(err){
        console.error('Error saving profile photo to user:', error);
        res.status(500).send('Internal server hello error');
    }

    }
    
    
  });
  
  // Endpoint to handle cover photo upload
  router.post('/uploadCoverPhoto',auth, upload.single('file'),async (req, res) => {
    const userId =req.userId
    const Artist = await UserModel.findOne({_id: userId})
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    if (Artist.role === "artist" ){
       try{

        const artist = await ArtistModel.findOne({ userId: userId }); 
        if (!artist) {
         return res.status(404).json({ message: 'Artist not found' });
         }

         //update the artist cover pic filemname in db
         artist.coverPic = req.file.filename
         await artist.save();
         res.status(200).send('cover photo uploaded and saved successfully');
    }catch(err){
        console.error('Error saving profile photo to user:', error);
        res.status(500).send('Internal server error');
    } } 
    else{
        try{

        const hirer = await HirerModel.findOne({ userId: userId }); 
        if (!hirer) {
         return res.status(404).json({ message: 'Hirer not found' });
         }

         //update the hirer cover pic filemname in db
         hirer.coverPic = req.file.filename
         await hirer.save();
         res.status(200).send('cover photo uploaded and saved successfully');
    }catch(err){
        console.error('Error saving profile photo to user:', error);
        res.status(500).send('Internal server error');
    }

    }
  });

///For video uploading

const videostorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/Videos') // Destination folder where files will be saved
  },
  filename: function (req, file, cb) {
      
      cb(null, file.fieldname + "-"+Date.now()+path.extname(file.originalname))
  }
});

const videoupload = multer({ storage: videostorage });

router.post('/uploadVideo', auth, videoupload.single('video'), async (req, res) => {
  try {
    const userId = req.userId;
    const artist = await ArtistModel.findOne({ userId: userId });
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Push the new video filename to the videos array
    artist.videos.push(req.file.filename);
    
    // Save the artist object with the updated videos array
    await artist.save();
    
    res.send('Video uploaded successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to handle video deletion
router.post('/d', async (req, res) => {
  try {
    // Extract userId and videoIndex from request parameters
    const { user, deleteIndex } = req.body;

    console.log(user);
    console.log(deleteIndex)

    // Find the user's videos by userId
    const artist = await ArtistModel.findOne({ userId:user });

    if (!artist) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the video at the specified index from the user's videos array
    artist.videos.splice(deleteIndex, 1);

    // Save the updated user videos
    await artist.save();

    return res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

  module.exports = router;
const express = require('express');
const router = express.Router();
const BookingModel = require('../models/Booking');
const HirerModel= require('../models/Hirer')
const auth = require('../middleware/auth')
const UserModel = require('../models/Users')
const ArtistModel = require('../models/Artist')
const nodemailer = require('nodemailer');
const { createNotification } = require('../notificationService');


// Nodemailer configuration
const transporter = nodemailer.createTransport({
  //  email configuration

  host:'smtp.gmail.com',
  port: '587',
  secure: false,
  auth: {
    user: 'mymusic.fyp@gmail.com', // Your email address
    pass: 'jnqt vxcf dmwv kgtu' // Your email password
  }
});

//========================fetching view profile info================
router.get('/view-profile/:id',async (req, res)=>{
  try {
     const { id } = req.params; // using the id from the client side
     const firstuser = await UserModel.findOne({ _id: id });
     const role = firstuser.role
     if(role  === 'artist'){
          const User = await ArtistModel.findOne({ userId: id }) 
          if (!User) {
            return res.status(404).json({ message: 'Artist not found' });
          }
      
         res.json({User, role});
     }
     else{
          const User = await HirerModel.findOne({ userId: id })
            if (!User) {
            
              return res.status(404).json({ message: 'Hirer not found' });
            }
            
            res.json ({User, role});
     }
    
  } catch (error) {
    console.error('Error fetching User:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})


//==============================booking User=========================
router.post('/booking-form',auth, async (req, res) =>{
    try{
    const userId = req.userId
    
    const user = await UserModel.findOne({ _id: userId });

    let User;
    if (user.role === 'artist') {
        User = await ArtistModel.findOne({ userId: userId });
    } else {
        User = await HirerModel.findOne({ userId: userId });
    }
    
    const {artistName, artistId, artistpic, price,eventDateTime,
      venue,venueAddress,eventName,outOfValley,accommodationFood,instruments } =req.body;
    console.log(User.userId)
    hirerbyId = User.userId;
    hirerbyName = User.name;
    hirerbypic = User.profilePic;


    const existingBooking = await BookingModel.findOne({ artistId: artistId, eventDateTime: eventDateTime });
    if (existingBooking) {
        return res.status(400).json({ success: false, message: 'Artist is aleardy booked for this date' });
    }


    const new_booking = new BookingModel({
        artistName,
        artistId,
        artistpic,
        hirerbyId,
        hirerbyName,
        hirerbypic,
        price,
        eventDateTime,
        venue,
        venueAddress,
        eventName,
        outOfValley,
        accommodationFood,
        instruments 
    })
    await new_booking.save()
    res.status(201).json({ message: 'Booking successfull', new_booking });

    const artist = await ArtistModel.findOne({ userId:artistId});

    // Send  booking request via email
    const mailOptions = {
      from: 'mymusic.fyp@gmail.com', // Your email address
      to: artist.email,
      subject: ` Booking request by ${ hirerbyName}`,
      text: `${ hirerbyName}Requested to Book You.Please check the app for further Details`
    };
    await transporter.sendMail(mailOptions);
    await createNotification(artistId,`${ hirerbyName}Requested to Book You` );

}catch(error){
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
}
});

// PUT request to update booking status
router.put('/bookingStatus/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
      const booking = await BookingModel.findByIdAndUpdate(id, { status }, { new: true });
      res.json({success: true, message:'status updated'});
      const User = await UserModel.findOne({_id: booking.hirerbyId})
      
      if (status ==="confirmed"){
      // mailing after confirmation
    const mailOptions = {
      from: 'mymusic.fyp@gmail.com', // Your email address
      to: User.email,
      subject: `Booking Confirmed`,
      text: `${ booking.artistName} Confirmed your booking request.Please check the app for further Details`
    };
    await transporter.sendMail(mailOptions);
       // Notify hirer and artist
    await createNotification(booking.hirerbyId, `Your booking for ${booking.eventName} has been confirmed.`);
    
      }
    if(status === "canceled"){
      // mailing after confirmation
    const mailOptions = {
      from: 'mymusic.fyp@gmail.com', // Your email address
      to: User.email,
      subject: `Booking Canceled`,
      text: `${ booking.artistName} canceled your booking request.Please check the app for further Details`
    };
    await transporter.sendMail(mailOptions);
       // Notify hirer and artist
    await createNotification(booking.hirerbyId, `Your booking for ${booking.eventName} has been canceled by ${booking.artistName}.`);

    }
  } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ error: 'Failed to update booking' });
  }
});

// fetch booking info
// GET /bookings-info
router.get('/bookings-info', auth, async (req, res) => {
  const userId = req.userId;

  try {
    // Find bookings where hirer or artist is the user
    const bookings = await BookingModel.find({
      $or: [{ hirerbyId: userId }, { artistId: userId }]
    });

    // Enrich bookings with extra data
    const enrichedBookings = await Promise.all(bookings.map(async booking => {
      // Fetch artist and hirer user info from Users model
      const artistUser = await UserModel.findById(booking.artistId).lean();
      const hirerUser = await UserModel.findById(booking.hirerbyId).lean();

      return {
        ...booking.toObject(),
        artistName: artistUser?.name || booking.artistName,
        artistpic: artistUser?.profilePic || booking.artistpic,
        hirerbyName: hirerUser?.name || booking.hirerbyName,
        hirerbypic: hirerUser?.profilePic || booking.hirerbypic
      };
    }));

    res.json({ userId, bookings: enrichedBookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});




module.exports = router;
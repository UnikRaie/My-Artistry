const express   =require("express")
const mongoose = require('mongoose')
const cors =require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
bodyParser


const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use(cors())
app.use(express.static('uploads'));

mongoose.connect("mongodb://127.0.0.1:27017/MyArtistry")
.then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use('/api', require("./routes/registerRoute"));// for handling register
app.use('/api', require("./routes/forgetpassRoute"));//for handling forget password
app.use('/api', require("./routes/ResetpassRoute"));// for handling reset password
app.use('/api',require("./routes/loginRoute"));//for handling login
app.use('/api',require("./routes/artistRoute"));//for handling artist data
app.use('/api',require("./routes/hirerRoute"));
app.use('/api',require("./routes/securityRoute"));// for handling security info like login email and password changing
app.use('/api',require("./routes/uploadsRoute"));// for handling the uploads like cover pic , profile pic and videos
app.use('/api',require("./routes/searchRoute"));//for handling search data or for Find Artist page
app.use('/api',require("./routes/bookingRoute"));//for hbooking
app.use('/api',require("./routes/ratingRoute"));//for rating and review
app.use('/khalti',require("./routes/khaltiRoute"));
app.use('/api',require("./routes/notificationRoute"));
app.use('/api',require("./routes/paymentRoute"));





app.listen(3001,() =>{
    console.log("Server is running in port 3001")
})
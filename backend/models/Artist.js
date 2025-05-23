const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
   
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Users"
    },
    name: {
        type: String,
        required: true,
           
    },
    specialization:{
        type : String,
        required: true,
        default: "Guitarist"
    },
    genres: {
        type: String,
        required: true,
        default:"Rock"
        
    },
    pricePerShow: {
        type: Number,
        default:1
        
    },
    type: {
        type: String,
        required: true,
        enum:["Solo","Band"],
        default:"Solo"
    },
    location: {
        type: String,
        required: true,
        default:"empty"

    },
    email: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true,
        default:"empty",
        
    },
    bio: {
        type: String,
        default:"empty"
    },
    videos: {
        type: [String],
        default:[]
    },
    profilePic: {
        type: String,
        default:"default_profile.png"
    },
    coverPic: {
        type: String,
        default:"default_cover.png"
    }
});

const ArtistModel = mongoose.model("Artist", ArtistSchema);
module.exports = ArtistModel;

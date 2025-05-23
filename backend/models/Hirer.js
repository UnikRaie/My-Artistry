const mongoose = require('mongoose');

const HirerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // Assuming you have a User model for user data
        required: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String
    },
    bio: {
        type: String
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

const HirerModel = mongoose.model('Hirer', HirerSchema);
module.exports = HirerModel;

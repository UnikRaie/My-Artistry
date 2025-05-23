const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
    {
        hirerbyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        artistId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        hirerbyName: {
            type: String,
            required: true
        },
        hirerbypic: {
            type: String,
        },
        artistName: {
            type: String,
            required: true
        },
        artistpic: {
            type: String,
        },
        price: {
            type: Number,
            required: true
        },
        eventDateTime: {
            type: Date,
            required: true
        },
        venue: {
            type: String,
            required: true
        },
        venueAddress: {
            type: String,
            required: true
        },
        eventName: {
            type: String,
            required: true
        },
        outOfValley: {
            type: Boolean,
            default: false
        },
        accommodationFood: {
            type: Boolean,
            default: false
        },
        instruments: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Cancelled'],
            default: 'Pending'
        }
    },
    { timestamps: true }
);

const BookingModel = mongoose.model("Booking", BookingSchema);
module.exports = BookingModel;

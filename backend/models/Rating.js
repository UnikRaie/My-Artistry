const mongoose = require('mongoose')

const RatingSchema = new mongoose.Schema(
    {
        Rated_by_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        Rated_by_Name:{
            type:String,
            required: true
        },
        Rated_by_pic:{
            type:String,
            required: true

        },
        Rated_to_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        rating: {
          type: Number,
          required: true
        },
        comment: {
          type: String,
            required: true
        },
        CreatedAt:{
          type: Date,
          required: true
        }
      }
      
)

const RatingModel = mongoose.model("Rating & Reviews",RatingSchema)
module.exports = RatingModel;
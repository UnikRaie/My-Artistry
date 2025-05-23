"use client"

import { useState } from "react"
import axios from "axios"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


function RatingReviewForm({ userID }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const Rated_to_id = userID
  const token = localStorage.getItem("token")

  const handleRatingChange = (newRating) => {
    setRating(newRating)
  }

  const handleCommentChange = (e) => {
    setComment(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0 || comment.trim() === "") {
      setError("Rating and comment cannot be empty")
      return
    }

    setIsSubmitting(true)

    try {
      // Send a POST request to your backend endpoint
      const response = await axios.post(
        `${BACKEND_URL}/api/submit_Ratings`,
        {
          rating,
          comment,
          Rated_to_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // If the request is successful, reset the fields
      if (response.status === 201) {
        // Reset the rating and comment fields
        setRating(0)
        setComment("")
        setError("") // Clear any existing errors
        window.location.reload()
      }
    } catch (error) {
      console.error("Error submitting rating and comment:", error)
      setError("Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Rating:</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <Star
              key={starValue}
              className={`w-8 h-8 cursor-pointer ${
                rating >= starValue ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
              }`}
              onClick={() => handleRatingChange(starValue)}
            />
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-2">
          Review:
        </label>
        <Textarea
          id="comment"
          placeholder="Write your review here..."
          rows={4}
          value={comment}
          onChange={handleCommentChange}
          className="resize-none"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}

export default RatingReviewForm

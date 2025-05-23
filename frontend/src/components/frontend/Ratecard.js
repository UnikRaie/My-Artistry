"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Star, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "axios"
import { useTheme } from "next-themes"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Create a custom axios instance with interceptors to prevent undefined IDs
const api = axios.create({
  baseURL: BACKEND_URL || "http://localhost:3001",
})

// Add request interceptor to prevent requests with undefined parameters
api.interceptors.request.use(
  (config) => {
    // Check if the URL contains "undefined"
    if (config.url && config.url.includes("undefined")) {
      console.error("BLOCKED API CALL WITH UNDEFINED:", config.url)
      // Reject the request
      return Promise.reject(new Error("API call with undefined parameter blocked"))
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default function RateCard({ userID }) {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    const fetchRatings = async () => {
      if (!userID) {
        console.error("Cannot fetch ratings: userID prop is undefined")
        setLoading(false)
        return
      }

      try {
        console.log(`RateCard: Fetching ratings for user ID: ${userID}`)
        const response = await api.get(`/api/fetch-rating/${userID}`)
        console.log("RateCard: Ratings fetched successfully:", response.data)
        setRatings(response.data)
      } catch (error) {
        console.error("RateCard: Error fetching ratings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRatings()
  }, [userID])

  if (loading) {
    return <div className="text-center py-4 text-muted-foreground">Loading ratings...</div>
  }

  if (ratings.length === 0) {
    return (
      <Card className="mb-4">
        <div className="p-6 text-center text-muted-foreground">No reviews yet. Be the first to leave a review!</div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => (
        <Card key={rating._id} className="mb-4">
          <div className="flex flex-col md:flex-row items-start px-4 py-3 gap-4">
            <Avatar className="w-[70px] h-[70px]">
              <AvatarImage
                src={`${BACKEND_URL || "http://localhost:3001"}/Images/${rating.Rated_by_pic}`}
                alt={rating.Rated_by_Name}
                className="object-cover"
              />
              <AvatarFallback className="text-lg">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <p className="text-base font-semibold">{rating.Rated_by_Name || "Anonymous"}</p>
              <p className="text-sm text-muted-foreground mt-1">{rating.comment}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">{new Date(rating.CreatedAt).toLocaleDateString()}</p>
            </div>

            <div className="flex gap-1 items-center pt-2 md:pt-6 text-yellow-500">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className={`w-6 h-6 ${index < rating.rating ? "fill-yellow-400" : "fill-muted"}`} />
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

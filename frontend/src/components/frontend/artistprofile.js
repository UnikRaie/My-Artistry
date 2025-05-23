"use client"

import { useState, useEffect, useRef } from "react" // Import useRef
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Upload, Star, MapPin, Mail, Phone, Music, User, DollarSign } from "lucide-react"
import Footer from "./Footer"
import RCard from "./ratecard"
import Navbar from "./Navbar"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom" // Import navigate hook
import { useTheme } from "next-themes"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Mock sample user data (will be replaced by API data)
const defaultProfilePic = "/default_profile.png"
const defaultCoverPic = "/default_cover.png"

// Create a custom axios instance with interceptors to prevent undefined IDs
const api = axios.create({
  baseURL: BACKEND_URL,
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

const ArtistProfile = () => {
  const navigate = useNavigate() // Initialize navigate function
  const [userData, setUserData] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [message, setMessage] = useState("")
  const [rating, setRating] = useState(0) // State to store the average rating
  const { theme, setTheme } = useTheme()
  const token = localStorage.getItem("token")
  const fileInputRef = useRef(null) // Create a ref for the file input
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("about")
  const [userId, setUserId] = useState(null) // Store user ID in state for debugging

  // First, fetch user data
  useEffect(() => {
    // Immediately invoke async function
    ;(async () => {
      try {
        setIsLoading(true)
        console.log("Fetching user data...")

        // Step 1: Get user data
        const userResponse = await api.get("/api/a", {
          headers: { Authorization: `Bearer ${token}` },
        })

        console.log("User data loaded:", userResponse.data)

        // Step 2: Extract user ID
        if (!userResponse.data || !userResponse.data.userId || !userResponse.data.userId._id) {
          throw new Error("User ID not found in response")
        }

        const id = userResponse.data.userId._id
        console.log("User ID extracted:", id)

        // Step 3: Store user data and ID
        setUserData(userResponse.data)
        setUserId(id)

        // Step 4: Calculate average rating (if needed for display in the stats card)
        try {
          console.log(`Fetching ratings for user ID: ${id}`)
          const ratingResponse = await api.get(`/api/fetch-rating/${id}`)

          if (Array.isArray(ratingResponse.data) && ratingResponse.data.length > 0) {
            const totalRating = ratingResponse.data.reduce((sum, item) => sum + item.rating, 0)
            const averageRating = totalRating / ratingResponse.data.length
            setRating(Number.parseFloat(averageRating.toFixed(1)))
          }
        } catch (ratingError) {
          console.error("Error fetching ratings for average:", ratingError)
          setRating(0)
        }
      } catch (error) {
        console.error("Error in initialization:", error)
        toast.error("Failed to load profile data")
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0])
    setMessage("") // Clear any previous messages
  }

  const handleVideoUpload = async () => {
    if (!videoFile) {
      setMessage("Please select a video file")
      return
    }

    const formData = new FormData()
    formData.append("video", videoFile)

    try {
      const response = await api.post("/api/uploadVideo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(response.data)
      toast.success("Video uploaded successfully")

      // Reload user data
      const userResponse = await api.get("/api/a", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUserData(userResponse.data)
      setVideoFile(null)
    } catch (error) {
      console.error("Error uploading video:", error)
      setMessage("Error uploading video")
      toast.error("Failed to upload video")
    }
  }

  const handleDelete = async (index) => {
    if (!userId) {
      toast.error("User ID not available")
      return
    }

    try {
      const response = await api.post("/api/d", {
        user: userId,
        deleteIndex: index,
      })
      console.log("Video deleted successfully")
      toast.success("Video deleted successfully")

      // Reload user data
      const userResponse = await api.get("/api/a", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUserData(userResponse.data)
    } catch (error) {
      console.error("Error deleting video:", error)
      toast.error("Failed to delete video")
    }
  }

  const handleSettingsClick = () => {
    navigate("/artist-setting") // Navigate to artist settings
  }

  const handleUploadMediaClick = () => {
    fileInputRef.current.click() // Trigger the file input click
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Debug info
  console.log("Current user ID:", userId)
  console.log("Current theme:", theme)

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Cover Section */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px]">
        <img
          src={userData ? `${BACKEND_URL}/Images/${userData.coverPic}` : defaultCoverPic}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 transform -translate-x-1/2 sm:left-10 sm:translate-x-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-background shadow-lg">
          <img
            src={userData ? `${BACKEND_URL}/Images/${userData.profilePic}` : defaultProfilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-20 sm:mt-28 px-4 sm:px-6 lg:px-24 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">{userData ? userData.name : "Artist Name"}</h1>
            <div className="flex items-center justify-center sm:justify-start mt-2 gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{userData ? userData.location : "Location"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
            <Button
              variant="outline"
              className="text-sm md:text-base gap-2"
              onClick={handleUploadMediaClick} // Trigger file input
            >
              <Upload className="w-4 h-4" />
              Upload Media
            </Button>
            <input
              type="file"
              ref={fileInputRef} // Attach the ref
              style={{ display: "none" }} // Hide the input
              onChange={handleVideoChange} // Handle file selection
            />
            <Button className="text-sm md:text-base gap-2" onClick={handleSettingsClick}>
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 justify-center sm:justify-start mb-8">
          {userData?.genres?.split(",").map((genre, index) => (
            <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
              {genre}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold">{userData?.stats?.followers || 0}</div>
              <div className="text-muted-foreground">Followers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold">{userData?.stats?.performances || 0}</div>
              <div className="text-muted-foreground">Performances</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold flex items-center justify-center">
                {rating} <Star className="w-5 h-5 ml-1 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="text-muted-foreground">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="about" className="w-full mb-12" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Artist Information</h3>
                <div className="grid gap-6 text-lg">
                  <InfoRow
                    icon={<Music className="w-5 h-5" />}
                    label="Specialization"
                    value={userData?.specialization}
                  />
                  <InfoRow icon={<Music className="w-5 h-5" />} label="Genre" value={userData?.genres} />
                  <InfoRow icon={<User className="w-5 h-5" />} label="Type" value={userData?.type} />
                  <InfoRow icon={<DollarSign className="w-5 h-5" />} label="Price" value={userData?.pricePerShow} />
                  <InfoRow icon={<MapPin className="w-5 h-5" />} label="Location" value={userData?.location} />
                  <InfoRow icon={<Mail className="w-5 h-5" />} label="Email" value={userData?.email} />
                  <InfoRow icon={<Phone className="w-5 h-5" />} label="Phone no" value={userData?.phoneNo} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Biography</h3>
                <p className="leading-relaxed">{userData?.bio || "No biography available."}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">My Videos</h3>
                  <Button onClick={handleUploadMediaClick}>Upload Video</Button> {/* Fixed here */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userData?.videos?.map((videoUrl, index) => (
                    <div key={index} className="relative group">
                      <video controls className="w-full h-60 rounded-lg">
                        <source src={`${BACKEND_URL}/Videos/${videoUrl}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <Button
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(index)} // Call handleDelete directly with the index
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                  {(!userData?.videos || userData.videos.length === 0) && (
                    <p className="text-muted-foreground col-span-2 text-center py-8">No videos uploaded yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                {userId ? (
                  <RCard userID={userId} />
                ) : (
                  <div className="text-center py-4 text-destructive">User ID not available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    <div className="text-foreground">{icon}</div>
    <div className="font-semibold">{label}:</div>
    <div>{value || "Not provided"}</div>
  </div>
)

export default ArtistProfile

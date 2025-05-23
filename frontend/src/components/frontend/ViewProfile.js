
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, MapPin, Mail, Phone, Music, User, DollarSign } from "lucide-react"
import Footer from "./Footer"
import Navbar from "./Navbar"
import RatingReviewForm from "./Rating&review"
import RatingCard from "./ratecard"
import { useTheme } from "next-themes"

// Default images
const defaultProfilePic = "/default_profile.png"
const defaultCoverPic = "/default_cover.png"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const ViewProfile = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [userData, setUserData] = useState(null)
  const [userRole, setUserRole] = useState("")
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)

  const param = new URLSearchParams(window.location.search)
  const userID = param.get("id")

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/view-profile/${userID}`)
      .then((response) => {
        setUserData(response.data.User)
        setUserRole(response.data.role)
        // Fetch average rating and total reviews
        fetchAverageRatingAndTotalReviews(userID)
      })
      .catch((error) => {
        console.error("Error fetching user data:", error)
      })
  }, [userID])

  const fetchAverageRatingAndTotalReviews = (userID) => {
    axios
      .get(`${BACKEND_URL}/api/fetch-rating/${userID}`)
      .then((response) => {
        const ratings = response.data
        const total = ratings.length
        const average = total > 0 ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / total : 0
        setAverageRating(average)
        setTotalReviews(total)
      })
      .catch((error) => {
        console.error("Error fetching ratings data:", error)
      })
  }

  const goBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Back Button */}
      <div className="absolute top-20 left-4 md:left-8 z-10">
        <Button variant="outline" size="icon" onClick={goBack} className="rounded-full shadow-md">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Cover Section */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px]">
        <img
          src={userData?.coverPic ? `${BACKEND_URL}/Images/${userData.coverPic}` : defaultCoverPic}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 transform -translate-x-1/2 sm:left-10 sm:translate-x-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-background shadow-lg">
          <img
            src={userData?.profilePic ? `${BACKEND_URL}/Images/${userData.profilePic}` : defaultProfilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-20 sm:mt-28 px-4 sm:px-6 lg:px-24 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{userData?.name || "Artist Name"}</h1>
            <div className="flex items-center justify-center sm:justify-start mt-2 gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{userData?.location || "Location"}</span>
            </div>
          </div>

          {/* Rating Display */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({totalReviews} reviews)</span>
          </div>
        </div>

        {userRole === "artist" && (
          <div className="flex flex-wrap gap-6 justify-center sm:justify-start mb-8">
            {userData?.genres?.split(",").map((genre, index) => (
              <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                {genre.trim()}
              </Badge>
            ))}
          </div>
        )}

        <Tabs defaultValue="about" className="w-full mb-12">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="about">About</TabsTrigger>
            {userRole === "artist" && <TabsTrigger value="videos">Videos</TabsTrigger>}
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Information</h3>
                <div className="grid gap-6 text-lg">
                  {userRole === "artist" && (
                    <>
                      <InfoRow
                        icon={<Music className="w-5 h-5" />}
                        label="Specialization"
                        value={userData?.specialization}
                      />
                      <InfoRow icon={<Music className="w-5 h-5" />} label="Genre" value={userData?.genres} />
                      <InfoRow icon={<User className="w-5 h-5" />} label="Type" value={userData?.type} />
                      <InfoRow icon={<DollarSign className="w-5 h-5" />} label="Price" value={userData?.pricePerShow} />
                    </>
                  )}
                  <InfoRow icon={<MapPin className="w-5 h-5" />} label="Location" value={userData?.location} />
                  <InfoRow icon={<Mail className="w-5 h-5" />} label="Email" value={userData?.email} />
                  <InfoRow icon={<Phone className="w-5 h-5" />} label="Phone" value={userData?.phoneNo} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Biography</h3>
                <p className="text-muted-foreground leading-relaxed">{userData?.bio || "No biography available."}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {userRole === "artist" && (
            <TabsContent value="videos">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Videos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userData?.videos && userData.videos.length > 0 ? (
                      userData.videos.map((videoUrl, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden shadow-md">
                          <video controls className="w-full h-60 object-cover">
                            <source src={`${BACKEND_URL}/Videos/${videoUrl}`} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-2 text-center text-muted-foreground py-8">No videos available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="reviews">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                  <div className="flex items-center mb-6">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(averageRating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="ml-2 text-muted-foreground">({totalReviews} reviews)</span>
                  </div>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    <RatingCard userID={userID} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                  <RatingReviewForm userID={userID} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    <div className="text-muted-foreground">{icon}</div>
    <div className="font-semibold">{label}:</div>
    <div>{value || "Not provided"}</div>
  </div>
)

export default ViewProfile

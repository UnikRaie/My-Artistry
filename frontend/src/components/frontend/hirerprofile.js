import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, MapPin, Mail, Phone, User, Building } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


// Import components
import Navbar from "./Navbar"
import Footer from "./Footer"
import RateCard from "./Ratecard"

// Default images
const defaultProfilePic = "/default_profile.png"
const defaultCoverPic = "/default_cover.png"

const HirerProfile = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const token = localStorage.getItem("token")
  const user = userData && userData.userId && userData.userId._id

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = () => {
    axios
      .get(`${BACKEND_URL}/api/hirer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserData(response.data)
      })
      .catch((error) => {
        console.error("Error fetching user data:", error)
      })
  }

  const handleSettingsClick = () => {
    navigate("/hirer-setting") // Navigate to hirer settings
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Cover Section */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px]">
        <img
          src={userData && userData.coverPic ? `${BACKEND_URL}/Images/${userData.coverPic}` : defaultCoverPic}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 transform -translate-x-1/2 sm:left-10 sm:translate-x-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
          <img
            src={
              userData && userData.profilePic
                ? `${BACKEND_URL}/Images/${userData.profilePic}`
                : defaultProfilePic
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-20 sm:mt-28 px-4 sm:px-6 lg:px-24 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl md:text-4xl font-bold dark:text-white">
              {userData ? userData.name : "Hirer Name"}
            </h1>
            <div className="flex items-center justify-center sm:justify-start mt-2 gap-2">
              <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">{userData ? userData.location : "Location"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
            <Button className="text-sm md:text-base gap-2" onClick={handleSettingsClick}>
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="text-center p-4 dark:border-gray-700">
            <div className="text-2xl font-bold dark:text-white">{userData?.stats?.events || 0}</div>
            <div className="text-gray-500 dark:text-gray-400">Events Hosted</div>
          </Card>
          <Card className="text-center p-4 dark:border-gray-700">
            <div className="text-2xl font-bold dark:text-white">{userData?.stats?.artists || 0}</div>
            <div className="text-gray-500 dark:text-gray-400">Artists Hired</div>
          </Card>
          <Card className="text-center p-4 dark:border-gray-700">
            <div className="text-2xl font-bold dark:text-white">{userData?.stats?.rating || 0}</div>
            <div className="text-gray-500 dark:text-gray-400">Average Rating</div>
          </Card>
        </div>

        <Tabs defaultValue="about" className="w-full mb-12">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card className="dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Hirer Information</h3>
                <div className="grid gap-6 text-lg">
                  <InfoRow
                    icon={<Building className="w-5 h-5" />}
                    label="Organization"
                    value={userData?.organization}
                  />
                  <InfoRow icon={<User className="w-5 h-5" />} label="Type" value={userData?.type} />
                  <InfoRow icon={<MapPin className="w-5 h-5" />} label="Location" value={userData?.location} />
                  <InfoRow icon={<Mail className="w-5 h-5" />} label="Email" value={userData?.email} />
                  <InfoRow icon={<Phone className="w-5 h-5" />} label="Phone" value={userData?.phoneNo} />
                </div>
              </CardContent>
            </Card>

            <Card className="dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Biography</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {userData?.bio || "No biography available."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Reviews</h3>
                <div className="grid gap-4">
                  {userData?.reviews ? (
                    userData.reviews.map((review, index) => <RateCard key={index} userID={review.userID} />)
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
                  )}
                </div>
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
    <div className="dark:text-gray-300">{icon}</div>
    <div className="font-semibold dark:text-gray-200">{label}:</div>
    <div className="dark:text-gray-300">{value || "Not provided"}</div>
  </div>
)

export default HirerProfile

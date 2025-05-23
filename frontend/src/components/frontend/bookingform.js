
import { useState, useEffect } from "react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ArrowLeft } from "lucide-react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { useTheme } from "next-themes"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function BookingForm() {
  const { theme } = useTheme()
  const token = localStorage.getItem("token")
  const param = new URLSearchParams(window.location.search)
  const artist_userID = param.get("id")
  const artist_name = param.get("name")
  const artist_price = param.get("price")

  const [formData, setFormData] = useState({
    artistName: artist_name,
    artistId: artist_userID,
    price: artist_price,
    eventDateTime: "",
    venue: "",
    venueAddress: "",
    eventName: "",
    outOfValley: false,
    accommodationFood: false,
    instruments: false,
  })

  const [artistProfilePic, setArtistProfilePic] = useState("")

  useEffect(() => {
    // Fetch artist profile data
    const fetchArtistProfile = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/view-profile/${artist_userID}`)
        const profilePicPath = response.data.User.profilePic
        setArtistProfilePic(`${BACKEND_URL}/Images/${profilePicPath}`)
      } catch (error) {
        console.error("Error fetching artist profile:", error)
        toast.error("Failed to load artist profile picture.", {
          position: "bottom-right",
        })
      }
    }

    fetchArtistProfile()
  }, [artist_userID])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${BACKEND_URL}/api/booking-form`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log(response)
      toast.success("Your Booking Form is Send Wait for Artist Confirmation", {
        position: "bottom-right",
      })

      // Add a slight delay before redirecting to ensure the toast is visible
      setTimeout(() => {
        window.location.href = "/my-booking"
      }, 2000)
    } catch (error) {
      console.error("Error submitting form:", error)

      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message, {
          position: "bottom-right",
        })
      } else if (error.request) {
        toast.error("No response from server. Please check your connection and try again.", {
          position: "bottom-right",
        })
      } else {
        toast.error("Error submitting form. Please try again later.", {
          position: "bottom-right",
        })
      }
    }
  }

  const goBack = () => {
    window.history.back()
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-start items-center mb-4">
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="order-2 md:order-1">
              <img
                src={artistProfilePic || "/placeholder.svg"}
                alt="Artist profile"
                className="rounded-lg object-cover w-full h-full aspect-[2/3]"
              />
            </div>

            {/* Form Section */}
            <div className="order-1 md:order-2 space-y-6">
              <div className="space-y-2 text-center">
                <h1
                  className="text-3xl font-bold tracking-tight"
                  style={{
                    textShadow:
                      theme === "dark" ? "2px 2px 4px rgba(255, 255, 255, 0.1)" : "2px 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Book {artist_name}
                </h1>
                <p className="text-muted-foreground">Fill out the form to book your artist.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="event-name" className="text-sm font-medium">
                    Event Name
                  </label>
                  <input
                    id="event-name"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Enter event name"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="venue" className="text-sm font-medium">
                    Venue
                  </label>
                  <input
                    id="venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="Enter venue name"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="venue-address" className="text-sm font-medium">
                    Venue Address
                  </label>
                  <input
                    id="venue-address"
                    name="venueAddress"
                    value={formData.venueAddress}
                    onChange={handleChange}
                    placeholder="Enter venue address"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="eventDateTime" className="text-sm font-medium">
                    Event Date & Time
                  </label>
                  <input
                    id="eventDateTime"
                    name="eventDateTime"
                    type="datetime-local"
                    value={formData.eventDateTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="out-of-valley"
                      name="outOfValley"
                      checked={formData.outOfValley}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                    />
                    <label htmlFor="out-of-valley" className="text-sm font-medium">
                      Out of Valley
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="accommodation-food"
                      name="accommodationFood"
                      checked={formData.accommodationFood}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                    />
                    <label htmlFor="accommodation-food" className="text-sm font-medium">
                      Accommodation and Food
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="instruments"
                      name="instruments"
                      checked={formData.instruments}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                    />
                    <label htmlFor="instruments" className="text-sm font-medium">
                      Instruments
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xl font-bold">Price: Rs {artist_price}</label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors mt-4"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === "dark" ? "dark" : "light"}
      />
    </>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Wrench,
  Bed,
  Plane,
  Building,
  CheckCircle2,
} from "lucide-react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import nodata from "../../assets/nodata.jpg"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function MyBooking() {
  const [bookings, setBookings] = useState([])
  const [profilePics, setProfilePics] = useState({})
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")
  const [currentUserId, setCurrentUserId] = useState("")
  const navigate = useNavigate()

  const handlePayment = async (id) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/khalti/payment`, { bookingId: id })
      if (response.data.success) {
        window.location.href = response.data.payment.payment_url
      } else {
        console.error("Payment initiation failed:", response.data.message)
      }
    } catch (error) {
      console.error("Payment Error:", error)
      toast.error("Payment Failed")
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/bookings-info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const bookingsData = response.data.bookings
      setBookings(bookingsData)
      setCurrentUserId(response.data.userId)
      fetchProfilePics(bookingsData, response.data.userId)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast.error("Failed to fetch bookings. Please try again later.")
    }
  }

  const fetchProfilePics = async (bookings, userId) => {
    const newPics = { ...profilePics }

    await Promise.all(
      bookings.map(async (booking) => {
        const idToFetch = role === "artist" && userId === booking.artistId ? booking.hirerbyId : booking.artistId

        if (!newPics[idToFetch]) {
          try {
            const res = await axios.get(`${BACKEND_URL}/api/view-profile/${idToFetch}`)
            newPics[idToFetch] = res.data.User.profilePic
          } catch (error) {
            console.error(`Error fetching profile for ${idToFetch}:`, error)
            newPics[idToFetch] = null
          }
        }
      }),
    )

    setProfilePics(newPics)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const confirmBooking = async (id) => {
    try {
      await axios.put(`${BACKEND_URL}/api/bookingStatus/${id}`, { status: "confirmed" })
      toast.success("Booking confirmed successfully")
      fetchBookings()
    } catch (error) {
      console.error("Error confirming booking:", error)
      toast.error("Failed to confirm booking. Please try again later.")
    }
  }

  const cancelBooking = async (id) => {
    try {
      await axios.put(`${BACKEND_URL}/api/bookingStatus/${id}`, { status: "canceled" })
      toast.success("Booking cancelled successfully")
      fetchBookings()
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast.error("Failed to cancel booking. Please try again later.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto px-6 md:px-8 py-10 md:py-20 mt-6">
        {bookings.length === 0 ? (
          <div className="text-center mx-auto">
            <img src={nodata || "/placeholder.svg"} className="max-h-[400px] max-w-[400px] mx-auto" alt="No data" />
            <p className="text-2xl font-['Dosis'] mt-4">No bookings yet</p>
            <p className="mt-2">The booking information will be shown here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings
              .slice()
              .reverse()
              .map((booking) => {
                const profileId =
                  role === "artist" && currentUserId === booking.artistId ? booking.hirerbyId : booking.artistId

                const profilePic = profilePics[profileId]
                  ? `${BACKEND_URL}/Images/${profilePics[profileId]}`
                  : "/placeholder.svg"

                return (
                  <div
                    key={booking._id}
                    className="border-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col"
                  >
                    <div className="relative group flex-1 flex flex-col">
                      <Link
                        to={
                          role === "artist" && currentUserId === booking.artistId
                            ? `/view-profile?id=${booking.hirerbyId}`
                            : `/view-profile?id=${booking.artistId}`
                        }
                        className="block"
                      >
                        <div className="w-full h-52 overflow-hidden">
                          <img
                            alt={`Booking for ${booking.eventName}`}
                            className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                            src={profilePic || "/placeholder.svg"}
                          />
                        </div>
                      </Link>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold line-clamp-2">
                          {role === "artist" && currentUserId === booking.artistId
                            ? `Request to you by ${booking.hirerbyName}`
                            : `Your Request to ${booking.artistName}`}
                        </h3>
                        <p className="text-gray-500 mt-3">For Event: {booking.eventName}</p>
                        <div className="mt-3 space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <Building className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <p className="text-sm text-gray-500 truncate">{booking.venue}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <p className="text-sm text-gray-500">
                              {new Intl.DateTimeFormat("en-US", {
                                timeZone: "Asia/Kathmandu",
                                dateStyle: "medium",
                              }).format(new Date(booking.eventDateTime))}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <p className="text-sm text-gray-500">
                              {new Date(booking.eventDateTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-500 line-clamp-2">{booking.venueAddress}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <p className="text-sm text-gray-500">Rs {booking.price}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Wrench className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <p className="text-sm text-gray-500">
                              {booking.instruments ? "Includes instruments" : "No instruments"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Plane className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <p className="text-sm text-gray-500">
                              {booking.outOfValley ? "Out of valley" : "Within valley"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Bed className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <p className="text-sm text-gray-500">
                              {booking.accommodationFood
                                ? "Includes accommodation and food"
                                : "No accommodation and food"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-6">
                          {booking.status === "Pending" ? (
                            role === "artist" && currentUserId === booking.artistId ? (
                              <div className="flex gap-3">
                                <button
                                  className="px-5 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex-1"
                                  onClick={() => confirmBooking(booking._id)}
                                >
                                  Confirm
                                </button>
                                <button
                                  className="px-5 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex-1"
                                  onClick={() => cancelBooking(booking._id)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Clock className="h-6 w-6 text-orange-500" />
                                <p className="text-lg text-orange-500 ml-3">Pending</p>
                              </div>
                            )
                          ) : (
                            <div className="flex items-center mt-3">
                              {booking.status === "confirmed" ? (
                                <>
                                  <CheckCircle className="h-6 w-6 text-green-500" />
                                  <p className="text-lg text-green-500 ml-3">Confirmed</p>
                                </>
                              ) : booking.status === "paid" ? (
                                <>
                                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                                  <p className="text-lg text-green-600 ml-3">Payment Completed</p>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-6 w-6 text-red-500" />
                                  <p className="text-lg text-red-500 ml-3">Cancelled</p>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        {(booking.status === "confirmed" || booking.status === "paid") &&
                          booking.hirerbyId === currentUserId &&
                          (booking.status === "paid" || booking.paymentStatus === "paid" ? (
                            <div className="flex items-center justify-center mt-6 py-3 px-5 bg-green-100 text-green-700 rounded-md">
                              <CheckCircle2 className="h-5 w-5 mr-2" />
                              <span className="font-medium">Payment Completed</span>
                            </div>
                          ) : (
                            <button
                              className="mt-6 w-full py-3 px-5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                              onClick={() => handlePayment(booking._id)}
                            >
                              Pay Via Khalti
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        )}
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
      />
    </div>
  )
}

export default MyBooking

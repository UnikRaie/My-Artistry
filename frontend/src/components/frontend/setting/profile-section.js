import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import defaultprofile from "../../../assets/default_profile.png"
import defaultcover from "../../../assets/default_cover.png"
import { Upload, Camera } from "lucide-react"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


function ProfileSection({ token, fetchUrl }) {
  const [userData, setUserData] = useState({
    profilePic: "",
    coverPic: "",
  })

  const [profileFile, setProfileFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [profileChanged, setProfileChanged] = useState(false)
  const [coverChanged, setCoverChanged] = useState(false)
  const [profilePreview, setProfilePreview] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)

  useEffect(() => {
    if (fetchUrl) {
      fetchUserData()
    }
  }, [fetchUrl])

  const fetchUserData = () => {
    axios
      .get(fetchUrl, {
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

  const handleProfileChange = (e) => {
    const file = e.target.files[0]
    setProfileFile(file)
    setProfileChanged(true)
    setProfilePreview(URL.createObjectURL(file))
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    setCoverFile(file)
    setCoverChanged(true)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleProfileUpload = async () => {
    const formData = new FormData()
    formData.append("file", profileFile)

    try {
      await axios.post(`${BACKEND_URL}/api/uploadProfilePhoto`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success("Profile photo successfully updated", { position: "top-right" })
      fetchUserData()
      setProfileChanged(false)
      setProfilePreview(null)
    } catch (error) {
      console.error("Error uploading profile photo:", error)
      toast.error("Failed to upload profile photo", { position: "top-right" })
    }
  }

  const handleCoverUpload = async () => {
    const formData = new FormData()
    formData.append("file", coverFile)

    try {
      await axios.post(`${BACKEND_URL}/api/uploadCoverPhoto`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success("Cover photo successfully updated", { position: "top-right" })
      fetchUserData()
      setCoverChanged(false)
      setCoverPreview(null)
    } catch (error) {
      console.error("Error uploading cover photo:", error)
      toast.error("Failed to upload cover photo", { position: "top-right" })
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Profile Picture</h3>
          <div className="flex flex-col items-center space-y-4">
            <div
              className="relative rounded-full overflow-hidden border-4 border-primary/20 w-32 h-32 cursor-pointer"
              onClick={() => document.getElementById("profileInput").click()}
            >
              <img
                src={
                  profilePreview
                    ? profilePreview
                    : userData.profilePic
                    ? `${BACKEND_URL}/Images/${userData.profilePic}`
                    : defaultprofile
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Change Image</span>
              </div>
            </div>

            <input id="profileInput" type="file" className="hidden" onChange={handleProfileChange} />

            {profileChanged ? (
              <Button onClick={handleProfileUpload} variant="default">
                <Upload className="mr-2 h-4 w-4" /> Confirm Upload
              </Button>
            ) : (
              <Button variant="outline" onClick={() => document.getElementById("profileInput").click()}>
                <Camera className="mr-2 h-4 w-4" /> Select Image
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cover Photo Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Cover Photo</h3>
          <div className="flex flex-col items-center space-y-4">
            <div
              className="relative w-full h-48 border-4 border-primary/20 cursor-pointer"
              onClick={() => document.getElementById("coverInput").click()}
            >
              <img
                src={
                  coverPreview
                    ? coverPreview
                    : userData.coverPic
                    ? `${BACKEND_URL}/Images/${userData.coverPic}`
                    : defaultcover
                }
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Change Cover Image</span>
              </div>
            </div>

            <input id="coverInput" type="file" className="hidden" onChange={handleCoverChange} />

            {coverChanged ? (
              <Button onClick={handleCoverUpload} variant="default">
                <Upload className="mr-2 h-4 w-4" /> Confirm Upload
              </Button>
            ) : (
              <Button variant="outline" onClick={() => document.getElementById("coverInput").click()}>
                <Camera className="mr-2 h-4 w-4" /> Select Cover
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileSection

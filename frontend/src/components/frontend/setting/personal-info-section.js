
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"

function PersonalInfoSection({ token, fetchUrl, updateUrl, userRole }) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    specialization: "",
    genres: "",
    type: "",
    pricePerShow: "",
    location: "",
    phoneNo: "",
    bio: "",
  })

  const [formChanged, setFormChanged] = useState(false)

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
        setFormChanged(false)
      })
      .catch((error) => {
        console.error("Error fetching user data:", error)
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
    setFormChanged(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post(updateUrl, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success("Profile successfully updated", {
          position: "top-right",
        })
        setFormChanged(false)
      })
      .catch((err) => {
        console.log(err)
        toast.error("Failed to update profile", {
          position: "top-right",
        })
      })
  }

  // Determine if we should show artist-specific fields
  const isArtist = userRole !== "hirer"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={userData.name} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={userData.email} onChange={handleInputChange} />
            </div>

            {isArtist && (
              <div className="space-y-2">
                <Label htmlFor="genres">Genres</Label>
                <Input id="genres" name="genres" value={userData.genres} onChange={handleInputChange} />
              </div>
            )}

            {isArtist && (
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  name="specialization"
                  value={userData.specialization}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {isArtist && (
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input id="type" name="type" value={userData.type} onChange={handleInputChange} />
              </div>
            )}

            {isArtist && (
              <div className="space-y-2">
                <Label htmlFor="pricePerShow">Price Per Show</Label>
                <Input
                  id="pricePerShow"
                  name="pricePerShow"
                  type="number"
                  value={userData.pricePerShow}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={userData.location} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNo">Phone Number</Label>
              <Input id="phoneNo" name="phoneNo" type="tel" value={userData.phoneNo} onChange={handleInputChange} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={userData.bio}
                onChange={handleInputChange}
                className="min-h-[120px]"
              />
            </div>
          </div>

          <CardFooter className="px-0 pt-6">
            <Button type="submit" disabled={!formChanged} className="ml-auto">
              {formChanged ? (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              ) : (
                "No Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}

export default PersonalInfoSection

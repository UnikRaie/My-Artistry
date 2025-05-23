import Navbar from "./Navbar"
import Footer from "./Footer"
import { Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileSection from "./setting/profile-section"
import PersonalInfoSection from "./setting/personal-info-section"
import SecuritySection from "./setting/security-section"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function SettingArtist() {
  const token = localStorage.getItem("token")

  // Artist-specific API endpoints
  const fetchUrl = `${BACKEND_URL}/api/a`
  const updateUrl = `${BACKEND_URL}/api/update`

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-16"></div>
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center mb-6">
          <Settings className="mr-2 h-7 w-7" />
          <h2 className="text-3xl font-semibold" style={{ fontFamily: "dosis" }}>
            Settings
          </h2>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Login & Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSection token={token} fetchUrl={fetchUrl} />
          </TabsContent>

          <TabsContent value="personal">
            <PersonalInfoSection token={token} fetchUrl={fetchUrl} updateUrl={updateUrl} userRole="artist" />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySection token={token} />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}

export default SettingArtist

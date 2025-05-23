
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EyeIcon, EyeOffIcon, Mail, Lock } from "lucide-react"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


function SecuritySection({ token }) {
  const [Login_email, setLoginEmail] = useState("")
  const [emailChanged, setEmailChanged] = useState(false)

  const [current_password, setCurrentPassword] = useState("")
  const [new_password, setNewPassword] = useState("")
  const [confirm_password, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchLoginEmail()
  }, [])

  const fetchLoginEmail = () => {
    axios
      .get(`${BACKEND_URL}/api/Login_email`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoginEmail(response.data)
        setEmailChanged(false)
      })
      .catch((error) => {
        console.error("Error fetching login email:", error)
      })
  }

  const handleLoginEmailChange = (e) => {
    setLoginEmail(e.target.value)
    setEmailChanged(true)
  }

  const handleLoginEmail = (e) => {
    e.preventDefault()
    axios
      .post(
        `${BACKEND_URL}/api/email_update`,
        { Login_email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((result) => {
        toast.success("Login email successfully updated", {
          position: "top-right",
        })
        setEmailChanged(false)
      })
      .catch((err) => {
        console.log(err)
        toast.error("Failed to update login email", {
          position: "top-right",
        })
      })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const ChangePassword = async (e) => {
    e.preventDefault()
    setError("")

    // Check if any password field is empty
    if (!current_password || !new_password || !confirm_password) {
      setError("All password fields are required")
      return
    }

    // Check if new password and confirm password match
    if (new_password !== confirm_password) {
      setError("New password and confirm password do not match")
      return
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/change_password`,
        {
          current_password,
          new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.data.success) {
        toast.success("Password successfully changed", {
          position: "top-right",
        })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setError(response.data.message || "Failed to change password")
      }
    } catch (err) {
      console.log(err)
      setError("An error occurred while changing password")
    }
  }

  const passwordsEntered = current_password && new_password && confirm_password

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Login Email</CardTitle>
          <CardDescription>This email is used for logging into your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLoginEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loginEmail">Email Address</Label>
              <Input id="loginEmail" type="email" value={Login_email} onChange={handleLoginEmailChange} />
            </div>

            <Button type="submit" disabled={!emailChanged}>
              <Mail className="mr-2 h-4 w-4" /> Update Email
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={ChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={current_password}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={new_password}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirm_password}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={!passwordsEntered}>
              <Lock className="mr-2 h-4 w-4" /> Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SecuritySection

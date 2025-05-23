import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"

// Import images and constants
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"
import logo from "../assets/logo.png"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    
    // Clear error when user starts typing again
    if (error) setError(null)
  }

  const validateForm = () => {
    if (!formData.email) {
      setError("Email is required")
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }
    
    if (!formData.password) {
      setError("Password is required")
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setError(null)
    setIsLoading(true)

    try {
      const result = await axios.post(`${BACKEND_URL}/api/login`, { 
        email: formData.email, 
        password: formData.password,
        rememberMe
      })

      if (result.data.status === "Success") {
        const { token, role } = result.data
        
        // Store auth data
        localStorage.setItem("token", token)
        localStorage.setItem("role", role)
        
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email)
        } else {
          localStorage.removeItem("rememberedEmail")
        }

        // Redirect based on role
        const redirectPath = role === "artist"
          ? "/artist-profile"
          : role === "hirer"
          ? "/hirer-profile"
          : "/"

        navigate(redirectPath)
      } else {
        setError(result.data.message || "Login failed.")
      }
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401) {
        setError("Invalid email or password. Please try again.")
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (!navigator.onLine) {
        setError("Network error. Please check your internet connection.")
      } else {
        setError("Something went wrong. Please try again later.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Check for remembered email on component mount
  useState(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail")
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }))
      setRememberMe(true)
    }
  }, [])

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center bg-black">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Login card */}
      <Card className="relative z-10 mx-4 w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="flex justify-center mb-3">
            <img 
              src={logo || "/placeholder.svg"} 
              alt="Logo" 
              className="h-16 w-auto" 
            />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="bg-background"
                aria-invalid={error && !formData.email ? "true" : "false"}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forget-password"
                  className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="bg-background pr-10"
                  aria-invalid={error && !formData.password ? "true" : "false"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onCheckedChange={setRememberMe} 
              />
              <Label 
                htmlFor="remember" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </Label>
            </div>

            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <span className="relative bg-card px-2 text-xs text-muted-foreground">
              OR
            </span>
          </div>
          
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link 
              to="/register" 
              className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
            >
              Create an account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
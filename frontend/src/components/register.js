"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Import background image
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"


export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (registrationSuccess) {
      const timeout = setTimeout(() => {
        navigate("/login")
      }, 1500)

      return () => clearTimeout(timeout)
    }
  }, [registrationSuccess, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)

    if (!selectedRole) {
      toast.error("Please select a role (Artist or Hirer)")
      return
    }

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill all the required fields")
      return
    }

    setIsLoading(true)

    axios
    .post(`${BACKEND_URL}/api/register`, {
        name,
        email,
        password,
        role: selectedRole,
      })
      .then((result) => {
        console.log(result)
        setRegistrationSuccess(true)
        toast.success("User Registered Successfully! Now Login")
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message)
        } else {
          console.error("Error:", error)
          toast.error("Registration failed. Please try again.")
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Registration card */}
      <Card className="relative z-10 mx-4 w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={submitted && !name.trim() ? "border-red-500" : ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={submitted && !email.trim() ? "border-red-500" : ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={submitted && !password.trim() ? "border-red-500" : ""}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Are you an Artist or a Hirer?</Label>
              <RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="artist" id="artist" />
                  <Label htmlFor="artist" className="cursor-pointer">
                    Artist
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hirer" id="hirer" />
                  <Label htmlFor="hirer" className="cursor-pointer">
                    Hirer
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

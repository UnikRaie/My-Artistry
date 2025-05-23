"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, Bell, User, LogOut, HelpCircle, Check, Trash2, Settings } from "lucide-react"
import axios from "axios"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Proper shadcn component imports
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [loadingNotifications, setLoadingNotifications] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  // Check if user is logged in and fetch user data
  useEffect(() => {
    if (token) {
      setLoggedIn(true)
      fetchUserData()
      fetchNotifications()
    }
  }, [token])

  const fetchUserData = async () => {
    try {
      const endpoint = role === "hirer" ? `${BACKEND_URL}/api/hirer` : `${BACKEND_URL}/api/a`
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUserData(response.data)
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setNotifications(response.data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoadingNotifications(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/notifications/markAsRead`,
        { id: notificationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setNotifications(
        notifications.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification,
        ),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const clearAllNotifications = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/notifications/clearAll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setNotifications([])
    } catch (error) {
      console.error("Error clearing notifications:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("userId")
    setLoggedIn(false)
    navigate("/")
  }

  // Get profile path based on role
  const getProfilePath = () => {
    return role === "hirer" ? "/hirer-profile" : "/artist-profile"
  }

  // Get settings path based on role
  const getSettingsPath = () => {
    return role === "hirer" ? "/hirer-setting" : "/artist-setting"
  }

  const navLinks = loggedIn
    ? [
        { path: "/", label: "Home" },
        { path: "/find-artist", label: "Find Artist" },
        { path: "/my-booking", label: "My Booking" },
        { path: "/chat", label: "Chat" },
        { path: getProfilePath(), label: "Profile" },
      ]
    : [
        { path: "/", label: "Home" },
        { path: "/find-artist", label: "Find Artist" },
      ]

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!userData || !userData.name) return "U"
    return userData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const unreadCount = notifications.filter((notification) => notification.read === false).length

  return (
    <header className="bg-black shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-10" />
          <span className="font-bold text-lg text-white">MyArtistry</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-white relative py-1.5",
                location.pathname === path ? "text-white" : "text-gray-400",
              )}
            >
              {label}
              {location.pathname === path && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex gap-3 items-center">
          {loggedIn ? (
            <>
              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-medium">Notifications</h3>
                  </div>

                  <div className="max-h-80 overflow-y-auto p-2">
                    {loadingNotifications ? (
                      <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className="mb-2 p-3 rounded-md hover:bg-muted flex items-start gap-3"
                        >
                          <div
                            className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${notification.read ? "bg-gray-400" : "bg-blue-500"}`}
                          />
                          <div className="flex-grow">
                            <p className="text-sm font-medium">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => markAsRead(notification._id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Mark as read</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-2 border-t flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={clearAllNotifications}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear All
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <Avatar className="h-8 w-8">
                      {userData && userData.profilePic ? (
                        <AvatarImage src={`${BACKEND_URL}/Images/${userData.profilePic}`} alt={userData.name} />
                      ) : (
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      )}
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      {userData && userData.profilePic ? (
                        <AvatarImage src={`${BACKEND_URL}/Images/${userData.profilePic}`} alt={userData.name} />
                      ) : (
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      )}
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{userData ? userData.name : "Loading..."}</p>
                      <p className="text-xs text-muted-foreground">{userData ? userData.email : ""}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getProfilePath()} className="flex cursor-pointer items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={getSettingsPath()} className="flex cursor-pointer items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/help" className="flex cursor-pointer items-center">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Support</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-white border-white hover:bg-white hover:text-gray-900"
              >
                <Link to="/login">Log In</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-white">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gray-900 text-white">
              <SheetHeader>
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
                {loggedIn && userData && (
                  <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                    <Avatar className="h-10 w-10">
                      {userData.profilePic ? (
                        <AvatarImage src={`${BACKEND_URL}/Images/${userData.profilePic}`} alt={userData.name} />
                      ) : (
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      )}
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{userData.name}</p>
                      <p className="text-sm text-gray-400">{userData.email}</p>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col space-y-1">
                  {navLinks.map(({ path, label }) => (
                    <SheetClose asChild key={path}>
                      <Link
                        to={path}
                        className={cn(
                          "flex items-center py-3 px-4 rounded-md text-sm font-medium transition-colors",
                          location.pathname === path
                            ? "bg-gray-800 text-white"
                            : "hover:bg-gray-800 text-gray-400 hover:text-white",
                        )}
                      >
                        {label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                {loggedIn ? (
                  <div className="space-y-1 pt-4 border-t border-gray-800">
                    <SheetClose asChild>
                      <Link
                        to={getSettingsPath()}
                        className="flex items-center py-3 px-4 rounded-md text-sm font-medium transition-colors hover:bg-gray-800 text-gray-400 hover:text-white"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/help"
                        className="flex items-center py-3 px-4 rounded-md text-sm font-medium transition-colors hover:bg-gray-800 text-gray-400 hover:text-white"
                      >
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help & Support
                      </Link>
                    </SheetClose>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center py-3 px-4 rounded-md text-sm font-medium transition-colors hover:bg-gray-800 text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 pt-4 border-t border-gray-800">
                    <SheetClose asChild>
                      <Button asChild className="w-full">
                        <Link to="/login">Log In</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/signup">Sign Up</Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

"use client"

import { useState, useEffect } from "react"
import { db, auth } from "@/lib/firebase"
import { query, collection, where, orderBy, onSnapshot, getDocs, limit } from "firebase/firestore"
import { jwtDecode } from "jwt-decode"
import ChatSidebar from "./ChatSidebar"
import Chat from "./Chat"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus } from "lucide-react"
import { fetchCurrentUserProfile, searchArtists } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSearchParams, useNavigate } from "react-router-dom"
import Navbar from "../frontend/Navbar"

const ChatApp = () => {
  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState(null)
  const [selectedChat, setSelectedChat] = useState(null)
  const [chatPartners, setChatPartners] = useState([])
  const [userNames, setUserNames] = useState({})
  const [lastMessages, setLastMessages] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isChatLoggedIn, setIsChatLoggedIn] = useState(false)
  const [availableArtists, setAvailableArtists] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [loadingArtists, setLoadingArtists] = useState(false)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // Reset chat login state
      localStorage.setItem("isChatLoggedIn", "false")
      setIsChatLoggedIn(false)
      setSelectedChat(null)
    } catch (error) {
      console.error("Error during logout:", error)
      setError("Failed to logout")
    }
  }

  const filteredArtists = availableArtists.filter((artist) =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const startNewChat = (artistId) => {
    setSelectedChat(artistId)
    setIsNewChatOpen(false)
  }

  useEffect(() => {
    const partnerId = searchParams.get("partnerId")
    if (partnerId) {
      setSelectedChat(partnerId)
    }
  }, [searchParams])

  useEffect(() => {
    if (selectedChat) {
      navigate(`?partnerId=${selectedChat}`)
    } else {
      navigate("")
    }
  }, [selectedChat, navigate])

  // Fetch available artists when the new chat dialog opens
  useEffect(() => {
    if (isNewChatOpen) {
      setSearchTerm("")
      setLoadingArtists(true)
      searchArtists({ limit: 50 })
        .then((data) => {
          if (data && data.artists) {
            setAvailableArtists(data.artists)
          } else {
            console.error("Invalid response format from searchArtists:", data)
            setAvailableArtists([])
          }
        })
        .catch((err) => {
          console.error("Error fetching available artists:", err)
          setAvailableArtists([])
        })
        .finally(() => {
          setLoadingArtists(false)
        })
    }
  }, [isNewChatOpen])

  // Check if user is logged in
  useEffect(() => {
    // First check if the user is logged in to chat specifically
    const chatLoggedIn = localStorage.getItem("isChatLoggedIn") === "true"
    setIsChatLoggedIn(chatLoggedIn)

    // Check for token in localStorage
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        setUserId(decodedToken.userId)

        // Fetch user profile to get name
        fetchCurrentUserProfile()
          .then((profile) => {
            setUserName(profile.name)
            if (chatLoggedIn) {
              fetchUserChats(decodedToken.userId)
            }
            setLoading(false)
          })
          .catch((err) => {
            console.error("Error fetching user profile:", err)
            setError("Failed to load user profile")
            setLoading(false)
          })
      } catch (error) {
        console.error("Error decoding token:", error)
        setError("Invalid authentication token")
        setLoading(false)
      }
    } else {
      setLoading(false)
    }

    // Also listen for Google auth changes as a backup
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && !userId) {
        setUserId(user.uid)
        setUserName(user.displayName || `User ${user.uid.substring(0, 5)}`)
        if (chatLoggedIn) {
          fetchUserChats(user.uid)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchUserChats = async (currentUserId) => {
    try {
      // First check if the "messages" collection exists
      const messagesCollectionRef = collection(db, "messages")
      const testQuery = query(messagesCollectionRef, limit(1))

      try {
        await getDocs(testQuery)
        console.log("Messages collection exists and is accessible")
      } catch (err) {
        console.error("Error accessing messages collection:", err)
        setError("Cannot access Firestore database. Please check your Firebase security rules.")
        setLoading(false)
        return
      }

      // Now proceed with the actual queries
      const sentQuery = query(
        messagesCollectionRef,
        where("senderId", "==", currentUserId),
        orderBy("timestamp", "desc"),
        limit(20),
      )

      const receivedQuery = query(
        messagesCollectionRef,
        where("receiverId", "==", currentUserId),
        orderBy("timestamp", "desc"),
        limit(20),
      )

      // Listen for real-time updates
      const unsubscribeSent = onSnapshot(
        sentQuery,
        (snapshot) => {
          processMessageSnapshots(snapshot, currentUserId)
        },
        (err) => {
          console.error("Error in sent messages query:", err)
          setError("Error fetching sent messages: " + err.message)
          setLoading(false)
        },
      )

      const unsubscribeReceived = onSnapshot(
        receivedQuery,
        (snapshot) => {
          processMessageSnapshots(snapshot, currentUserId)
        },
        (err) => {
          console.error("Error in received messages query:", err)
          setError("Error fetching received messages: " + err.message)
          setLoading(false)
        },
      )

      return () => {
        unsubscribeSent()
        unsubscribeReceived()
      }
    } catch (error) {
      console.error("Error fetching chat partners:", error)
      setError("Failed to fetch your conversations: " + error.message)
      setLoading(false)
    }
  }

  const processMessageSnapshots = (snapshot, currentUserId) => {
    const partners = new Set([...chatPartners])
    const lastMsgs = { ...lastMessages }

    snapshot.forEach((doc) => {
      const msg = doc.data()
      let partnerId

      if (msg.senderId === currentUserId) {
        partnerId = msg.receiverId
        partners.add(partnerId)
      } else if (msg.receiverId === currentUserId) {
        partnerId = msg.senderId
        partners.add(partnerId)
      }

      // Track last message for each partner
      if (partnerId) {
        if (
          !lastMsgs[partnerId] ||
          (msg.timestamp &&
            lastMsgs[partnerId].timestamp &&
            msg.timestamp.toDate() > lastMsgs[partnerId].timestamp.toDate())
        ) {
          lastMsgs[partnerId] = {
            text: msg.text,
            timestamp: msg.timestamp,
          }
        }
      }
    })

    const partnerIds = Array.from(partners)
    setChatPartners(partnerIds)
    setLastMessages(lastMsgs)

    // Fetch names for partners from available artists
    searchArtists({ limit: 50 })
      .then((data) => {
        const names = {}
        partnerIds.forEach((id) => {
          const artist = data.artists.find((a) => a.userId === id)
          names[id] = artist ? artist.name : `User ${id.substring(0, 5)}`
        })
        setUserNames(names)
      })
      .catch((err) => {
        console.error("Error fetching artist names:", err)
        // Fallback to placeholder names
        const names = {}
        partnerIds.forEach((id) => {
          names[id] = `User ${id.substring(0, 5)}`
        })
        setUserNames(names)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading chat application...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-destructive/10 p-6 rounded-md text-center max-w-md">
          <h3 className="text-lg font-medium text-destructive mb-2">Error</h3>
          <p className="mb-4">{error}</p>
          <p className="text-sm mb-4">Please check your Firebase configuration and security rules.</p>
          <Button onClick={() => setError(null)}>Try Again</Button>
        </div>
      </div>
    )
  }

  // If user has a token but is not logged in with Google for chat
  if (userId && !isChatLoggedIn) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="bg-card p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-2">Welcome to Chat App</h1>
          <p className="text-muted-foreground mb-2">You're logged in as:</p>
          <p className="font-medium mb-6">{userName}</p>
          <p className="text-muted-foreground mb-6">Please enable chat access to continue</p>
          <Button
            onClick={() => {
              localStorage.setItem("isChatLoggedIn", "true")
              setIsChatLoggedIn(true)
              fetchUserChats(userId)
            }}
            className="w-full"
          >
            Enable Chat Access
          </Button>
        </div>
      </div>
    )
  }

  // If user is not logged in at all
  if (!userId) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="bg-card p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-2">Welcome to Chat App</h1>
          <p className="text-muted-foreground mb-6">Please log in to the main application first to access chat</p>
          <Button onClick={() => (window.location.href = "/")} className="w-full">
            Go to Login Page
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <SidebarProvider defaultOpen={!window.matchMedia("(max-width: 768px)").matches}>
        <div className="flex flex-grow w-full" style={{ paddingTop: "4rem" }}>
          {/* Sidebar */}
          <ChatSidebar
            chatPartners={chatPartners}
            userNames={userNames}
            selectedChat={selectedChat}
            onSelectChat={(partnerId) => setSelectedChat(partnerId)}
            lastMessages={lastMessages}
            onLogout={handleLogout}
            onNewChat={() => setIsNewChatOpen(true)}
          />

          {/* Main content (Chat area) */}
          <SidebarInset className="flex-grow bg-background">
            {/* Persistent sidebar trigger that's always visible */}
            <div className="absolute top-4 left-4 z-10 md:top-4 md:left-4">
              <SidebarTrigger className="bg-background shadow-sm border" />
            </div>

            {selectedChat ? (
              <Chat
                selectedChat={selectedChat}
                userId={userId}
                userName={userName}
                partnerName={userNames[selectedChat] || `User ${selectedChat.substring(0, 5)}`}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-6 max-w-md">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-xl font-medium mb-2">Select a conversation</h2>
                  <p className="text-muted-foreground mb-6">
                    Choose a chat from the sidebar or start a new conversation
                  </p>
                  <Button onClick={() => setIsNewChatOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Start New Chat
                  </Button>
                </div>
              </div>
            )}
          </SidebarInset>
        </div>

        {/* Dialog for New Chat */}
        <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Conversation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Input
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {loadingArtists ? (
                  <div className="flex justify-center py-4">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : filteredArtists.length > 0 ? (
                  filteredArtists.map((artist) => (
                    <div
                      key={artist.userId}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                      onClick={() => startNewChat(artist.userId)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {artist.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{artist.name}</p>
                        <p className="text-xs text-muted-foreground">{artist.specialization}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No artists found</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarProvider>
    </div>
  )
}

export default ChatApp

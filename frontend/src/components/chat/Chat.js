"use client"

import { useState, useEffect, useRef } from "react"
import { db } from "@/lib/firebase"
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  limit,
} from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import { format } from "date-fns"
import { useTheme } from "next-themes"

const Chat = ({ selectedChat, userId, userName, partnerName }) => {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { theme } = useTheme()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!selectedChat || !userId) return

    setLoading(true)
    setMessages([])
    setError(null)

    try {
      const messagesCollectionRef = collection(db, "messages")
      const testQuery = query(messagesCollectionRef, limit(1))

      getDocs(testQuery)
        .then(() => {
          console.log("Messages collection is accessible")

          const sentQuery = query(
            messagesCollectionRef,
            where("senderId", "==", userId),
            where("receiverId", "==", selectedChat),
            orderBy("timestamp", "asc"),
          )

          const receivedQuery = query(
            messagesCollectionRef,
            where("senderId", "==", selectedChat),
            where("receiverId", "==", userId),
            orderBy("timestamp", "asc"),
          )

          const unsubscribeSent = onSnapshot(
            sentQuery,
            (snapshot) => {
              const sentMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))

              setMessages((prev) => {
                const allMessages = [...prev.filter((msg) => msg.senderId !== userId), ...sentMessages]
                return allMessages.sort((a, b) => {
                  const timeA = a.timestamp ? a.timestamp.toDate().getTime() : 0
                  const timeB = b.timestamp ? b.timestamp.toDate().getTime() : 0
                  return timeA - timeB
                })
              })
              setLoading(false)
            },
            (err) => {
              console.error("Error in sent messages query:", err)
              setError("Error fetching messages: " + err.message)
              setLoading(false)
            },
          )

          const unsubscribeReceived = onSnapshot(
            receivedQuery,
            (snapshot) => {
              const receivedMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))

              setMessages((prev) => {
                const allMessages = [...prev.filter((msg) => msg.senderId === userId), ...receivedMessages]
                return allMessages.sort((a, b) => {
                  const timeA = a.timestamp ? a.timestamp.toDate().getTime() : 0
                  const timeB = b.timestamp ? b.timestamp.toDate().getTime() : 0
                  return timeA - timeB
                })
              })
              setLoading(false)
            },
            (err) => {
              console.error("Error in received messages query:", err)
              setError("Error fetching messages: " + err.message)
              setLoading(false)
            },
          )

          return () => {
            unsubscribeSent()
            unsubscribeReceived()
          }
        })
        .catch((err) => {
          console.error("Error accessing messages collection:", err)
          setError("Cannot access messages collection. Please check your Firebase security rules: " + err.message)
          setLoading(false)
        })
    } catch (error) {
      console.error("Error setting up message listeners:", error)
      setError("Failed to load conversation: " + error.message)
      setLoading(false)
    }
  }, [selectedChat, userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!userId || !selectedChat || !newMessage.trim()) {
      return
    }

    try {
      await addDoc(collection(db, "messages"), {
        senderId: userId,
        receiverId: selectedChat,
        text: newMessage,
        timestamp: serverTimestamp(),
        senderName: userName,
      })
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      setError("Failed to send message: " + error.message)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.timestamp ? format(message.timestamp.toDate(), "MMMM d, yyyy") : "Pending"

    if (!groups[date]) {
      groups[date] = []
    }

    groups[date].push(message)
    return groups
  }, {})

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-destructive/10 p-4 rounded-md text-center">
          <p className="text-destructive font-medium">{error}</p>
          <Button variant="outline" className="mt-2" onClick={() => setError(null)}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat header */}
      <div className="border-b p-3 flex flex-col items-center justify-center gap-2">

        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {partnerName?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{partnerName}</h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.keys(groupedMessages).length > 0 ? (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              {/* Date Separator */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <span className="relative bg-background px-3 text-xs text-muted-foreground">{date}</span>
              </div>

              {/* Messages */}
              {dateMessages.map((msg) => {
                const isOwnMessage = msg.senderId === userId
                return (
                  <div key={msg.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`relative max-w-[70%] rounded-2xl px-4 py-2 ${
                        isOwnMessage
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      }`}
                    >
                      <p className="break-words">{msg.text}</p>
                      <p
                        className={`text-[10px] mt-1 text-right ${
                          isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {msg.timestamp ? format(msg.timestamp.toDate(), "h:mm a") : "Sending..."}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>No messages yet</p>
              <p className="text-sm">Send a message to start the conversation</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t p-3">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Chat

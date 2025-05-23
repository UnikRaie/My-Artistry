"use client"

import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Search, Plus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"

const ChatSidebar = ({ chatPartners, userNames, selectedChat, onSelectChat, lastMessages, onLogout, onNewChat }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPartners, setFilteredPartners] = useState([])
  const { isMobile } = useSidebar()

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPartners(chatPartners)
      return
    }

    const filtered = chatPartners.filter((partnerId) => {
      const name = userNames[partnerId] || `User ${partnerId.substring(0, 5)}`
      return name.toLowerCase().includes(searchTerm.toLowerCase())
    })

    setFilteredPartners(filtered)
  }, [searchTerm, chatPartners, userNames])

  // Sort chat partners by last message timestamp (newest first)
  const sortedPartners = [...filteredPartners].sort((a, b) => {
    const timeA = lastMessages[a]?.timestamp ? new Date(lastMessages[a].timestamp.toDate()).getTime() : 0
    const timeB = lastMessages[b]?.timestamp ? new Date(lastMessages[b].timestamp.toDate()).getTime() : 0
    return timeB - timeA
  })

  return (
    <>
      <Sidebar className="mt-16"> {/* Added margin-top: 4rem (16 in Tailwind) */}
        <SidebarHeader>
          <div className="flex items-center justify-between p-2">
            <h2 className="text-xl font-bold truncate">Chats</h2>
          </div>
          <div className="px-2 pb-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <div className="flex justify-end px-2 py-1">
            <Button variant="ghost" size="sm" onClick={onNewChat} className="text-xs">
              <Plus className="h-4 w-4 mr-1" /> New Chat
            </Button>
          </div>

          <SidebarMenu>
            {sortedPartners.length > 0 ? (
              sortedPartners.map((partnerId) => {
                const lastMessage = lastMessages[partnerId]
                const timestamp = lastMessage?.timestamp
                  ? formatDistanceToNow(new Date(lastMessage.timestamp.toDate()), { addSuffix: true })
                  : ""

                return (
                  <SidebarMenuItem key={partnerId}>
                    <SidebarMenuButton
                      isActive={selectedChat === partnerId}
                      onClick={() => onSelectChat(partnerId)}
                      className="flex items-center gap-3 min-h-14 px-2 py-2"
                    >
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {userNames[partnerId]?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm truncate">
                            {userNames[partnerId] || `User ${partnerId.substring(0, 5)}`}
                          </p>
                          {timestamp && (
                            <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                              {timestamp}
                            </span>
                          )}
                        </div>
                        {lastMessage && (
                          <p className="text-xs text-muted-foreground truncate">
                            {lastMessage.text}
                          </p>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 mb-2" />
                <p>No conversations yet</p>
                <p className="text-xs">Start a new chat to begin messaging</p>
              </div>
            )}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-2">
          <p className="text-xs text-center text-muted-foreground truncate">
            Connected as {localStorage.getItem("userName") || "Artist"}
          </p>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}

export default ChatSidebar

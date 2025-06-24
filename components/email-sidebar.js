"use client"

import { useEffect, useState } from "react"
import { Star, CheckSquare, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmailDetailModal } from "@/components/email-detail-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMail } from "@/context/mailContext"

const emails = [
  {
    id: 1,
    sender: "Sarah Wilson",
    avatar: `https://api.dicebear.com/8.x/fun-emoji/svg?seed=${Math.random()}`
    ,
    subject: "Q4 Marketing Campaign Review",
    preview: "Hi team, I've attached the latest campaign metrics for review...",
    time: "2024-01-15T14:30:00Z",
    unread: true,
    starred: false,
    category: "Work",
    hasAttachment: true,
  },
  {
    id: 2,
    sender: "Netflix",
    avatar: `https://api.dicebear.com/8.x/fun-emoji/svg?seed=${Math.random()}`
    ,
    subject: "New releases this week",
    preview: "Check out the latest movies and shows added to Netflix...",
    time: "2024-01-15T13:00:00Z",
    unread: true,
    starred: true,
    category: "Personal",
    hasAttachment: false,
  },
  {
    id: 3,
    sender: "Bank of America",
    avatar: `https://api.dicebear.com/8.x/fun-emoji/svg?seed=${Math.random()}`
    ,
    subject: "Monthly Statement Available",
    preview: "Your monthly statement for December is now available...",
    time: "2024-01-15T09:15:00Z",
    unread: false,
    starred: false,
    category: "Finance",
    hasAttachment: true,
  },
  {
    id: 4,
    sender: "GitHub",
    avatar: `https://api.dicebear.com/8.x/fun-emoji/svg?seed=${Math.random()}`
    ,
    subject: "Security alert: New sign-in",
    preview: "We detected a new sign-in to your account from Chrome...",
    time: "2024-01-14T16:45:00Z",
    unread: false,
    starred: false,
    category: "Work",
    hasAttachment: false,
  },
  {
    id: 5,
    sender: "Amazon",
    avatar: `https://api.dicebear.com/8.x/fun-emoji/svg?seed=${Math.random()}`
    ,
    subject: "Your order has been shipped",
    preview: "Great news! Your order #123-456789 has been shipped...",
    time: "2024-01-14T11:20:00Z",
    unread: false,
    starred: true,
    category: "Shopping",
    hasAttachment: false,
  },
]

const categoryColors = {
  Work: "bg-blue-500",
  Personal: "bg-green-500",
  Finance: "bg-yellow-500",
  Shopping: "bg-pink-500",
}

export function EmailSidebar() {
  const [selectedEmail, setSelectedEmail] = useState(1)
  const [emailDetailOpen, setEmailDetailOpen] = useState(false)
  const [selectedEmailForDetail, setSelectedEmailForDetail] = useState(null)
  const { mailAccounts } = useMail()

  useEffect(() => {
    console.log(mailAccounts)
  }, [mailAccounts])

  const createTodo = (email) => {
    // This would integrate with your todo system
    console.log("Creating todo from email:", email.subject)
  }
  const changeEmailCategory = (emailId, newCategory) => {
    console.log(`Changing email ${emailId} category to ${newCategory}`)
    // This would update the email category in a real app
  }

  const refreshInbox = () => {
    console.log("Refreshing inbox...")
    // This would trigger a real inbox refresh in a real app
  }

  const handleEmailClick = (email) => {
    setSelectedEmail(email.id)
    setSelectedEmailForDetail(email)
    setEmailDetailOpen(true)
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now - date) / 36e5

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`
    }
  }

  return (
    <>
      <div className="w-full h-full bg-muted/20 flex flex-col overflow-hidden">
        <div className="p-4 border-b flex-shrink-0 bg-background">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Inbox</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{emails.filter((e) => e.unread).length} unread</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshInbox}
                className="h-6 w-6 p-0 hover:bg-accent"
                title="Refresh inbox"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {emails.map((email) => (
              <div
                key={email.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${email.unread ? " bg-[#000000] border-l-2 border-blue-400" : ""} mb-1`}
                onClick={() => handleEmailClick(email)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={email.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {email.sender
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm truncate ${email.unread ? "font-semibold" : ""}`}>{email.sender}</span>
                      <div className="flex items-center gap-1">
                        {email.starred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                        <span className="text-xs text-muted-foreground">{formatTime(email.time)}</span>
                      </div>
                    </div>

                    <p className={`text-sm mb-1 truncate ${email.unread ? "font-medium" : "text-muted-foreground"}`}>
                      {email.subject}
                    </p>

                    <p className="text-xs text-muted-foreground truncate mb-2">{email.preview}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 hover:bg-accent/50 px-1 py-0.5 transition-colors border rounded-full">
                              <div className={`h-2 w-2 rounded-full ${categoryColors[email.category]}`} />
                              <span className="text-xs text-muted-foreground">{email.category}</span>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-32">
                            {Object.keys(categoryColors).map((category) => (
                              <DropdownMenuItem
                                key={category}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  changeEmailCategory(email.id, category)
                                }}
                                className="flex items-center gap-2"
                              >
                                <div className={`h-2 w-2 rounded-full ${categoryColors[category]}`} />
                                <span className="text-xs">{category}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {email.hasAttachment && (
                          <div className="h-3 w-3 rounded bg-muted flex items-center justify-center">
                            <div className="h-1.5 w-1.5 bg-muted-foreground rounded-sm" />
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          createTodo(email)
                        }}
                        className="h-6 px-2 text-xs"
                      >
                        <CheckSquare className="h-3 w-3 mr-1" />
                        Todo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EmailDetailModal email={selectedEmailForDetail} open={emailDetailOpen} onOpenChange={setEmailDetailOpen} />
    </>
  )
}

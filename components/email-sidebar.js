"use client"

import { useEffect, useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Star, CheckSquare, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmailDetailModal } from "@/components/email-detail-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMail } from "@/context/mailContext"
import { getAllEmails, getInboxEmails, markEmailAsRead, changeEmailCategory } from "@/services/api/mail/index"
import axios from "axios"

export function EmailSidebar() {
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [emailDetailOpen, setEmailDetailOpen] = useState(false)
  const [selectedEmailForDetail, setSelectedEmailForDetail] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [changingCategoryForEmail, setChangingCategoryForEmail] = useState(null) // Track which email is changing category
  const { emails, setEmails, categories, mailAccounts } = useMail()

  // Get URL parameters for filtering
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const labelParam = searchParams.get('label')

  // Filter emails based on URL parameters
  const filteredEmails = useMemo(() => {
    if (!emails) return []

    let filtered = [...emails]

    // Filter by category if category parameter exists
    if (categoryParam) {
      // Find category by name (case-insensitive) or ID
      const targetCategory = categories.find(cat =>
        cat.name.toLowerCase() === categoryParam.toLowerCase() ||
        cat._id === categoryParam
      )

      if (targetCategory) {
        filtered = filtered.filter(email => email.UserCategory === targetCategory._id)
      } else {
        // If category not found, show empty results
        filtered = []
      }
    }

    // Filter by label if label parameter exists
    if (labelParam) {
      const labelLower = labelParam.toLowerCase()

      switch (labelLower) {
        case 'primary':
          filtered = filtered.filter(email => email.gmailCategory === 'primary')
          break
        case 'social':
          filtered = filtered.filter(email => email.gmailCategory === 'social')
          break
        case 'promotions':
          filtered = filtered.filter(email => email.gmailCategory === 'promotions')
          break
        case 'updates':
          filtered = filtered.filter(email => email.gmailCategory === 'updates')
          break
        case 'forums':
          filtered = filtered.filter(email => email.gmailCategory === 'forums')
          break
        default:
          break
      }
    }

    return filtered
  }, [emails, categories, categoryParam, labelParam])

  const fetchMails = async () => {
    try {
      console.log("fetching all emails")
      const response = await getAllEmails()
      setEmails(response || [])
      console.log("emails fetched")
    } catch (err) {
      console.error("Error loading emails:", err)
    }
  }

  useEffect(() => {
    fetchMails()
  }, [])

  const createTodo = (email) => {
    console.log("Creating todo from email:", email?.subject)
  }

  const changeCategory = async (account_id, emailId, newCategoryId) => {
    // Set loading state for this specific email
    setChangingCategoryForEmail(emailId)

    try {
      await changeEmailCategory(account_id, emailId, newCategoryId)
      console.log("hogya bc")
      await fetchMails() // Refresh emails after changing category
      console.log(`✅ Email ${emailId} category updated to ${newCategoryId}`)
    } catch (err) {
      console.error(`❌ Failed to change category for email ${emailId}:`, err)
    } finally {
      // Clear loading state
      setChangingCategoryForEmail(null)
    }
  }

  const refreshInbox = async () => {
    setIsRefreshing(true);

    try {
      console.log("Refreshing inboxes for all mail accounts...");

      const results = await Promise.allSettled(
        mailAccounts.map((mail) =>
          getInboxEmails(mail.id)
            .then(() => console.log(`✅ Inbox fetched for: ${mail.id}`))
            .catch((err) => console.error(`❌ Failed for: ${mail.id}`, err))
        )
      );

      const successCount = results.filter(r => r.status === "fulfilled").length;
      const failCount = results.filter(r => r.status === "rejected").length;
      console.log(`Inbox refresh complete: ${successCount} success, ${failCount} failed.`);

      const allEmails = await getAllEmails();
      setEmails(allEmails || []);
      console.log("📥 All emails fetched and set.");
    } catch (err) {
      console.error("🚨 Unexpected error during inbox refresh:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEmailClick = async (email) => {
    setSelectedEmail(email?._id)
    setSelectedEmailForDetail(email)
    setEmailDetailOpen(true)

    if (email.isUnread) {
      try {
        await markEmailAsRead(email?.gmailAccount, email?.messageId)
        setEmails((prevEmails) =>
          prevEmails.map((e) =>
            e._id === email._id ? { ...e, isUnread: false } : e
          )
        )
      } catch (err) {
        console.error("Error marking email as read:", err)
      }
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now - date) / 36e5
    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`
    else if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    else return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getCategoryDetails = (categoryId) => {
    return categories.find((cat) => cat._id === categoryId)
  }

  return (
    <>
      <div className="w-full h-full bg-muted/20 flex flex-col overflow-hidden">
        <div className="p-4 border-b flex-shrink-0 bg-background">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              Inbox <span className="text-muted">({filteredEmails.length})</span>
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredEmails?.filter((e) => e.isUnread).length} unread
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshInbox}
                disabled={isRefreshing}
                className="h-6 w-6 p-0 hover:bg-accent"
                title="Refresh inbox"
              >
                <RefreshCw className={`h-3 w-3 transition-transform duration-1000 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Show active filters */}
          {/* {(categoryParam || labelParam) && (
            <div className="mt-2 flex flex-wrap gap-1">
              {categoryParam && (
                <Badge variant="outline" className="text-xs">
                  Category: {categories.find(cat =>
                    cat.name.toLowerCase() === categoryParam.toLowerCase() ||
                    cat._id === categoryParam
                  )?.name || categoryParam}
                </Badge>
              )}
              {labelParam && (
                <Badge variant="outline" className="text-xs">
                  Label: {labelParam}
                </Badge>
              )}
            </div>
          )} */}
        </div>

        <div className="flex-1 overflow-y-auto">
          {emails.length === 0 && (
            <div className="h-full w-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-muted-foreground border-t-transparent" />
            </div>
          )}

          {emails.length > 0 && filteredEmails.length === 0 && (categoryParam || labelParam) && (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">No emails found</p>
                <p className="text-xs mt-1">Try adjusting your filters</p>
              </div>
            </div>
          )}

          <div className="p-2">
            {filteredEmails?.map((email) => {
              const category = getCategoryDetails(email?.UserCategory)
              const isChangingCategory = changingCategoryForEmail === email?.messageId

              const getInitials = (name) => {
                if (!name) return "";
                const words = name.split(" ").filter(Boolean).slice(0, 2);
                return words
                  .map(word => {
                    for (let i = 0; i < word.length; i++) {
                      if (/[a-zA-Z0-9]/.test(word[i])) return word[i];
                    }
                    return "";
                  })
                  .join("")
                  .toUpperCase();
              };

              return (
                <div
                  key={email?._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${email?.isUnread ? "bg-[#000000] border-l-2 border-blue-400" : ""} mb-1`}
                  onClick={() => handleEmailClick(email)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={email?.senderPicture || null} />
                      <AvatarFallback>
                        {getInitials(email?.senderName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm truncate ${email?.isUnread ? "font-semibold" : ""}`}>{email?.senderName}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{formatTime(email?.date)}</span>
                        </div>
                      </div>

                      <p className={`text-sm mb-1 truncate ${email?.isUnread ? "font-medium" : "text-muted-foreground"}`}>
                        {email?.subject}
                      </p>

                      <p className="text-xs text-muted-foreground truncate mb-2">{email?.snippet}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="flex items-center gap-2 hover:bg-accent/50 px-1 py-0.5 transition-colors border rounded-full"
                                disabled={isChangingCategory}
                              >
                                {isChangingCategory ? (
                                  <Loader2 className="h-2 w-2 animate-spin" />
                                ) : (
                                  <div className={`h-2 w-2 rounded-full ${category?.color || "bg-gray-500"}`} />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {isChangingCategory ? "Changing..." : (category?.name || "Uncategorized")}
                                </span>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-32">
                              {categories.map((cat) => (
                                <DropdownMenuItem
                                  key={cat._id}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation()
                                    changeCategory(email?.gmailAccount, email?.messageId, cat._id)
                                  }}
                                  className="flex items-center gap-2"
                                  disabled={isChangingCategory}
                                >
                                  <div className={`h-2 w-2 rounded-full ${cat.color}`} />
                                  <span className="text-xs">{cat.name}</span>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          {email?.attachments.length > 0 && (
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
              )
            })}
          </div>
        </div>
      </div>

      <EmailDetailModal email={selectedEmailForDetail} open={emailDetailOpen} onOpenChange={setEmailDetailOpen} />
    </>
  )
}
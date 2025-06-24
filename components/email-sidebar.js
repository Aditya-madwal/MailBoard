// "use client"

// import { useEffect, useState } from "react"
// import { Star, CheckSquare, RefreshCw } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { EmailDetailModal } from "@/components/email-detail-modal"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { useMail } from "@/context/mailContext"
// import { getAllEmails } from "@/services/api/mail/index"
// import { markEmailAsRead } from "@/services/api/mail/index"

// export function EmailSidebar() {
//   const [selectedEmail, setSelectedEmail] = useState(null)
//   const [emailDetailOpen, setEmailDetailOpen] = useState(false)
//   const [selectedEmailForDetail, setSelectedEmailForDetail] = useState(null)
//   const { emails, setEmails, categories, mailAccounts } = useMail()

//   useEffect(() => {
//     const fetchMails = async () => {
//       try {
//         const token = localStorage.getItem("token")
//         const response = await getAllEmails(token)
//         setEmails(response.inbox || [])
//       } catch (err) {
//         console.error("Error loading emails:", err)
//       }
//     }

//     fetchMails()
//   }, [])

//   const createTodo = (email) => {
//     console.log("Creating todo from email:", email?.subject)
//   }

//   const changeEmailCategory = (emailId, newCategoryId) => {
//     console.log(`Changing email ${emailId} category to ${newCategoryId}`)
//   }

//   const refreshInbox = async () => {
//     try {
//       const token = localStorage.getItem("token")
//       const response = await getAllEmails(token)
//       setEmails(response.inbox || [])
//     } catch (err) {
//       console.error("Error refreshing inbox:", err)
//     }
//   }

//   const handleEmailClick = async (email) => {
//     setSelectedEmail(email?._id)
//     setSelectedEmailForDetail(email)
//     setEmailDetailOpen(true)
//     // mark email as read
//     try {
//       await markEmailAsRead(email?.gmailAccount, email?.messageId)
//       // update local state
//       setEmails((prevEmails) =>
//         prevEmails.map((e) =>
//           e._id === email._id ? { ...e, isUnread: false } : e
//         )
//       )
//     } catch (err) {
//       console.error("Error marking email as read:", err)
//     }

//   }

//   const formatTime = (dateString) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffInHours = Math.abs(now - date) / 36e5
//     if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`
//     else if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
//     else return `${Math.floor(diffInHours / 24)}d ago`
//   }

//   const getCategoryDetails = (categoryId) => {
//     return categories.find((cat) => cat._id === categoryId)
//   }

//   return (
//     <>
//       <div className="w-full h-full bg-muted/20 flex flex-col overflow-hidden">
//         <div className="p-4 border-b flex-shrink-0 bg-background">
//           <div className="flex items-center justify-between">
//             <h2 className="font-semibold">Inbox</h2>
//             <div className="flex items-center gap-2">
//               <Badge variant="secondary">{emails?.filter((e) => e.isUnread).length} unread</Badge>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={refreshInbox}
//                 className="h-6 w-6 p-0 hover:bg-accent"
//                 title="Refresh inbox"
//               >
//                 <RefreshCw className="h-3 w-3" />
//               </Button>
//             </div>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           <div className="p-2">
//             {emails?.map((email) => {
//               const category = getCategoryDetails(email?.UserCategory)
//               return (
//                 <div
//                   key={email?._id}
//                   className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${email?.isUnread ? "bg-[#000000] border-l-2 border-blue-400" : ""} mb-1`}
//                   onClick={() => handleEmailClick(email)}
//                 >
//                   <div className="flex items-start gap-3">
//                     <Avatar className="h-8 w-8">
//                       <AvatarImage src={email?.senderPicture || "/placeholder.svg"} />
//                       <AvatarFallback>
//                         {email?.senderName?.split(" ").map((n) => n[0]).join("")}
//                       </AvatarFallback>
//                     </Avatar>

//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between mb-1">
//                         <span className={`text-sm truncate ${email?.isUnread ? "font-semibold" : ""}`}>{email?.senderName}</span>
//                         <div className="flex items-center gap-1">
//                           {/* Placeholder for star if needed */}
//                           <span className="text-xs text-muted-foreground">{formatTime(email?.date)}</span>
//                         </div>
//                       </div>

//                       <p className={`text-sm mb-1 truncate ${email?.isUnread ? "font-medium" : "text-muted-foreground"}`}>
//                         {email?.subject}
//                       </p>

//                       <p className="text-xs text-muted-foreground truncate mb-2">{email?.snippet}</p>

//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <button className="flex items-center gap-2 hover:bg-accent/50 px-1 py-0.5 transition-colors border rounded-full">
//                                 <div className={`h-2 w-2 rounded-full ${category?.color || "bg-gray-500"}`} />
//                                 <span className="text-xs text-muted-foreground">{category?.name || "Uncategorized"}</span>
//                               </button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="start" className="w-32">
//                               {categories.map((cat) => (
//                                 <DropdownMenuItem
//                                   key={cat._id}
//                                   onClick={(e) => {
//                                     e.stopPropagation()
//                                     changeEmailCategory(email?._id, cat._id)
//                                   }}
//                                   className="flex items-center gap-2"
//                                 >
//                                   <div className={`h-2 w-2 rounded-full ${cat.color}`} />
//                                   <span className="text-xs">{cat.name}</span>
//                                 </DropdownMenuItem>
//                               ))}
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                           {email?.attachments.length > 0 && (
//                             <div className="h-3 w-3 rounded bg-muted flex items-center justify-center">
//                               <div className="h-1.5 w-1.5 bg-muted-foreground rounded-sm" />
//                             </div>
//                           )}
//                         </div>

//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             createTodo(email)
//                           }}
//                           className="h-6 px-2 text-xs"
//                         >
//                           <CheckSquare className="h-3 w-3 mr-1" />
//                           Todo
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       </div>

//       <EmailDetailModal email={selectedEmailForDetail} open={emailDetailOpen} onOpenChange={setEmailDetailOpen} />
//     </>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Star, CheckSquare, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmailDetailModal } from "@/components/email-detail-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMail } from "@/context/mailContext"
import { getAllEmails, getInboxEmails, markEmailAsRead } from "@/services/api/mail/index"
import axios from "axios"

export function EmailSidebar() {
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [emailDetailOpen, setEmailDetailOpen] = useState(false)
  const [selectedEmailForDetail, setSelectedEmailForDetail] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { emails, setEmails, categories, mailAccounts } = useMail()

  useEffect(() => {
    const fetchMails = async () => {
      try {
        console.log("fetching all emails")
        const response = await getAllEmails()
        setEmails(response || [])
        console.log("emails fetched")
        // console.log(response)
      } catch (err) {
        console.error("Error loading emails:", err)
      }
    }
    fetchMails()
  }, [])

  const createTodo = (email) => {
    console.log("Creating todo from email:", email?.subject)
  }

  const changeEmailCategory = (emailId, newCategoryId) => {
    console.log(`Changing email ${emailId} category to ${newCategoryId}`)
  }

  // const refreshInbox = async () => {

  //   setIsRefreshing(true);

  //   try {
  //     // Use Promise.all to wait for all requests to complete
  //     await Promise.all(mailAccounts.map(async (mail) => {
  //       console.log("fetching inbox for", mail.id);

  //       try {
  //         const response = await getInboxEmails(mail.id);
  //         // alert("got it for " + mail.id);
  //       } catch (err) {
  //         console.error(`Error refreshing inbox for ${mail.id}:`, err);
  //         // alert(`error for ${mail.id}`);
  //         // Note: Individual failures won't stop other requests
  //       }
  //     }));

  //     // fetch all the emails from inbox database
  //     const response = await getAllEmails()
  //     setEmails(response || [])
  //     console.log("emails fetched")
  //   } catch (err) {
  //     console.error("Overall refresh error:", err);
  //   } finally {
  //     setIsRefreshing(false);
  //   }
  // };

  const refreshInbox = async () => {
    setIsRefreshing(true);

    try {
      console.log("Refreshing inboxes for all mail accounts...");

      // Wait for ALL inbox fetches to complete (including failures)
      const results = await Promise.allSettled(
        mailAccounts.map((mail) =>
          getInboxEmails(mail.id)
            .then(() => console.log(`✅ Inbox fetched for: ${mail.id}`))
            .catch((err) => console.error(`❌ Failed for: ${mail.id}`, err))
        )
      );

      // Optionally log summary:
      const successCount = results.filter(r => r.status === "fulfilled").length;
      const failCount = results.filter(r => r.status === "rejected").length;
      console.log(`Inbox refresh complete: ${successCount} success, ${failCount} failed.`);

      // Now safely fetch all emails from DB
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
    // mark email as read
    try {
      await markEmailAsRead(email?.gmailAccount, email?.messageId)
      // update local state
      setEmails((prevEmails) =>
        prevEmails.map((e) =>
          e._id === email._id ? { ...e, isUnread: false } : e
        )
      )
    } catch (err) {
      console.error("Error marking email as read:", err)
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
            <h2 className="font-semibold">Inbox</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{emails?.filter((e) => e.isUnread).length} unread</Badge>
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
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {emails?.map((email) => {
              const category = getCategoryDetails(email?.UserCategory)
              return (
                <div
                  key={email?._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${email?.isUnread ? "bg-[#000000] border-l-2 border-blue-400" : ""} mb-1`}
                  onClick={() => handleEmailClick(email)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={email?.senderPicture || "/placeholder.svg"} />
                      <AvatarFallback>
                        {email?.senderName?.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm truncate ${email?.isUnread ? "font-semibold" : ""}`}>{email?.senderName}</span>
                        <div className="flex items-center gap-1">
                          {/* Placeholder for star if needed */}
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
                              <button className="flex items-center gap-2 hover:bg-accent/50 px-1 py-0.5 transition-colors border rounded-full">
                                <div className={`h-2 w-2 rounded-full ${category?.color || "bg-gray-500"}`} />
                                <span className="text-xs text-muted-foreground">{category?.name || "Uncategorized"}</span>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-32">
                              {categories.map((cat) => (
                                <DropdownMenuItem
                                  key={cat._id}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    changeEmailCategory(email?._id, cat._id)
                                  }}
                                  className="flex items-center gap-2"
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
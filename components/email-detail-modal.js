import { useEffect, useState } from "react"
import {
    Star,
    Reply,
    ReplyAll,
    Forward,
    Archive,
    Trash2,
    Download,
    Paperclip,
    Calendar,
    CheckSquare,
    MoreHorizontal,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMail } from "@/context/mailContext"

export const EmailDetailModal = ({ email: initialEmail, open, onOpenChange }) => {
    const [email, setEmail] = useState(initialEmail)
    const [loading, setLoading] = useState(false)
    const [isStarred, setIsStarred] = useState(false)
    const { categories } = useMail()

    useEffect(() => {
        const fetchEmailDetail = async () => {
            if (!initialEmail?.body && initialEmail?.gmailAccount && initialEmail?.messageId) {
                setLoading(true)
                try {
                    const response = await fetch(`/api/mail/${initialEmail.gmailAccount}/inbox/${initialEmail.messageId}`)
                    const data = await response.json()
                    if (response.ok) {
                        setEmail(data)
                        setIsStarred(data.isStarred || false)
                    } else {
                        console.error("Error fetching email details:", data.error)
                    }
                } catch (error) {
                    console.error("Failed to fetch email:", error)
                } finally {
                    setLoading(false)
                }
            } else {
                setEmail(initialEmail)
                setIsStarred(initialEmail?.isStarred || false)
            }
        }

        if (open) {
            fetchEmailDetail()
        }
    }, [initialEmail, open])

    if (!email) return null

    const getCategoryDetails = (categoryId) => categories?.find((cat) => cat._id === categoryId)
    const formatDateTime = (dateString) => new Date(dateString).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
    const handleCreateTodo = () => console.log("Creating todo from email:", email?.subject)
    const category = getCategoryDetails(email.UserCategory)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0 pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={email?.senderPicture || "/placeholder.svg"} />
                                <AvatarFallback>
                                    {email?.senderName?.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-semibold">{email?.subject}</h2>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{email?.senderName}</span>
                                    <span>•</span>
                                    <span>{email?.senderEmail}</span>
                                    <span>•</span>
                                    <span>{formatDateTime(email?.date)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => setIsStarred(!isStarred)} className="h-8 w-8 p-0">
                                <Star className={`h-4 w-4 ${isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Archive className="h-4 w-4 mr-2" />
                                        Archive
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Add to Calendar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        {category && (
                            <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${category.color}`} />
                                <span className="text-xs text-muted-foreground">{category.name}</span>
                            </div>
                        )}

                        {email?.attachments?.length > 0 && (
                            <div className="flex items-center gap-1">
                                <Paperclip className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{email.attachments.length} attachments</span>
                            </div>
                        )}

                        {email?.isUnread && (
                            <Badge variant="secondary" className="text-xs">Unread</Badge>
                        )}
                    </div>
                </DialogHeader>

                <Separator />

                <div className="flex-1 overflow-y-auto py-4">
                    <div className="prose prose-sm max-w-none">
                        {/* <div className="whitespace-pre-wrap text-sm leading-relaxed">{email?.body || email?.snippet}</div> */}

                        <div>
                            <div
                                className="text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: email?.body || email?.snippet }}
                            ></div>
                        </div>

                    </div>

                    {email?.attachments?.length > 0 && (
                        <div className="mt-6 pt-4 border-t">
                            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                <Paperclip className="h-4 w-4" />
                                Attachments ({email.attachments.length})
                            </h4>
                            <div className="space-y-2">
                                {email.attachments.map((att, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center text-xs font-bold uppercase">
                                                {att.mimeType?.includes("pdf") && "PDF"}
                                                {att.mimeType?.includes("sheet") && "XLS"}
                                                {att.mimeType?.includes("zip") && "ZIP"}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">{att.filename}</div>
                                                <div className="text-xs text-muted-foreground">{(att.size / 1024 / 1024).toFixed(1)} MB</div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <Separator />

                <div className="flex-shrink-0 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Reply className="h-4 w-4 mr-2" />
                                Reply
                            </Button>
                            <Button variant="outline" size="sm">
                                <ReplyAll className="h-4 w-4 mr-2" />
                                Reply All
                            </Button>
                            <Button variant="outline" size="sm">
                                <Forward className="h-4 w-4 mr-2" />
                                Forward
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCreateTodo}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700"
                            >
                                <CheckSquare className="h-4 w-4 mr-2" />
                                Create Todo
                            </Button>
                            <Button variant="outline" size="sm">
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// export default EmailDetailModal

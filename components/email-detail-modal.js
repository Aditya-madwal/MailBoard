"use client"

import { useState } from "react"
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

export function EmailDetailModal({ email, open, onOpenChange }) {
    const [isStarred, setIsStarred] = useState(email?.starred || false)

    if (!email) return null

    const categoryColors = {
        Work: "bg-blue-500",
        Personal: "bg-green-500",
        Finance: "bg-yellow-500",
        Shopping: "bg-pink-500",
    }

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const handleCreateTodo = () => {
        console.log("Creating todo from email:", email.subject)
        // This would integrate with your todo system
    }

    const mockAttachments = [
        {
            name: "Q4_Campaign_Report.pdf",
            size: "2.4 MB",
            type: "application/pdf",
            url: "#",
        },
        {
            name: "Budget_Analysis.xlsx",
            size: "1.8 MB",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            url: "#",
        },
        {
            name: "Campaign_Images.zip",
            size: "15.2 MB",
            type: "application/zip",
            url: "#",
        },
    ]

    const mockEmailContent = `Hi team,

I hope this email finds you well. I wanted to share the comprehensive Q4 marketing campaign analysis that we've been working on over the past few weeks.

**Key Highlights:**
• Campaign reached 2.3M impressions across all channels
• Conversion rate improved by 34% compared to Q3
• Cost per acquisition decreased by 18%
• Social media engagement increased by 67%

**Detailed Breakdown:**

**Digital Channels Performance:**
- Google Ads: 45% of total conversions
- Facebook/Instagram: 28% of total conversions  
- LinkedIn: 15% of total conversions
- Email Marketing: 12% of total conversions

**Budget Allocation:**
The attached Excel file contains the detailed budget breakdown and ROI analysis for each channel. I'm particularly excited about the performance of our LinkedIn campaigns, which exceeded expectations by 23%.

**Next Steps:**
1. Review the attached PDF report for detailed metrics
2. Schedule a team meeting to discuss Q1 strategy
3. Implement the recommended optimizations for underperforming channels
4. Prepare budget proposal for Q1 campaigns

**Action Items:**
- Marketing Team: Review performance data by Friday
- Finance Team: Approve additional budget for high-performing channels
- Creative Team: Develop new ad creatives based on top-performing content

I've also included the campaign images archive for reference. Please let me know if you have any questions or need clarification on any of the data points.

Looking forward to discussing this further in our upcoming strategy meeting.

Best regards,
Sarah Wilson
Marketing Director
TechCorp Inc.

P.S. Don't forget about the marketing team holiday party next Friday! 🎉

---
This email contains confidential information. If you received this in error, please delete it immediately.`

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0 pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={email.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                    {email.sender
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-semibold truncate">{email.subject}</h2>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{email.sender}</span>
                                    <span>•</span>
                                    <span>{formatDateTime(email.time)}</span>
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

                    {/* Email metadata */}
                    <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${categoryColors[email.category]}`} />
                            <span className="text-xs text-muted-foreground">{email.category}</span>
                        </div>

                        {email.hasAttachment && (
                            <div className="flex items-center gap-1">
                                <Paperclip className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{mockAttachments.length} attachments</span>
                            </div>
                        )}

                        {email.unread && (
                            <Badge variant="secondary" className="text-xs">
                                Unread
                            </Badge>
                        )}
                    </div>
                </DialogHeader>

                <Separator />

                {/* Email content */}
                <div className="flex-1 overflow-y-auto py-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{mockEmailContent}</div>
                    </div>

                    {/* Attachments */}
                    {email.hasAttachment && mockAttachments.length > 0 && (
                        <div className="mt-6 pt-4 border-t">
                            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                <Paperclip className="h-4 w-4" />
                                Attachments ({mockAttachments.length})
                            </h4>
                            <div className="space-y-2">
                                {mockAttachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                                                {attachment.type.includes("pdf") && <div className="text-red-600 font-bold text-xs">PDF</div>}
                                                {attachment.type.includes("spreadsheet") && (
                                                    <div className="text-green-600 font-bold text-xs">XLS</div>
                                                )}
                                                {attachment.type.includes("zip") && (
                                                    <div className="text-purple-600 font-bold text-xs">ZIP</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">{attachment.name}</div>
                                                <div className="text-xs text-muted-foreground">{attachment.size}</div>
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

                {/* Action buttons */}
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

"use client"

import { useState } from "react"
import { Send, Paperclip, Sparkles, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useMail } from "@/context/mailContext"
import { useEffect } from "react"
import { generateEmailBody } from "@/services/api/mail/index"
import { sendEmail } from "@/services/api/mail/index"

export function ComposeDialog({ open, onOpenChange }) {
  const { mailAccounts } = useMail()
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
  })

  useEffect(() => {
    if (mailAccounts.length > 0 && !formData.from) {
      setFormData(prev => ({
        ...prev,
        from: mailAccounts[0].email,
      }))
    }
  }, [mailAccounts])

  const [attachments, setAttachments] = useState([])
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [isAiGenerating, setIsAiGenerating] = useState(false)

  // const emailAccounts = ["john.doe@gmail.com", "work@company.com", "personal@gmail.com"]
  const emailAccounts = mailAccounts.map((account) => account.email)

  const handleAiGenerate = async () => {
    setIsAiGenerating(true)
    try {
      const emailBody = await generateEmailBody(formData.subject)
      console.log(emailBody)
      setFormData((prev) => ({
        ...prev,
        body: emailBody,
      }))
    } catch (e) {
      alert(e)
    } finally {
      setIsAiGenerating(false)
    }
    // Simulate AI generation
  }

  const handleSend = () => {
    console.log("Sending email:", formData)
    onOpenChange(false)
    const fromMailId = mailAccounts.find(account => account.email === formData.from)?.id
    if (!fromMailId) {
      console.error("Selected email account not found")
      return
    }
    try {
      response = sendEmail(fromMailId, formData)
    } catch (e) {

    }
    // Reset form
    setFormData({
      from: "john.doe@gmail.com",
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      body: "",
    })
    setAttachments([])
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* From Field */}
          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <Select value={formData.from} onValueChange={(value) => setFormData((prev) => ({ ...prev, from: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {emailAccounts.map((account) => (
                  <SelectItem key={account} value={account}>
                    {account}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* To Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="to">To</Label>
              <div className="flex gap-2">
                {!showCc && (
                  <Button variant="ghost" size="sm" onClick={() => setShowCc(true)} className="text-xs">
                    Cc
                  </Button>
                )}
                {!showBcc && (
                  <Button variant="ghost" size="sm" onClick={() => setShowBcc(true)} className="text-xs">
                    Bcc
                  </Button>
                )}
              </div>
            </div>
            <Input
              id="to"
              placeholder="recipient@example.com"
              value={formData.to}
              onChange={(e) => setFormData((prev) => ({ ...prev, to: e.target.value }))}
            />
          </div>

          {/* CC Field */}
          {showCc && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="cc">Cc</Label>
                <Button variant="ghost" size="sm" onClick={() => setShowCc(false)} className="text-xs">
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <Input
                id="cc"
                placeholder="cc@example.com"
                value={formData.cc}
                onChange={(e) => setFormData((prev) => ({ ...prev, cc: e.target.value }))}
              />
            </div>
          )}

          {/* BCC Field */}
          {showBcc && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bcc">Bcc</Label>
                <Button variant="ghost" size="sm" onClick={() => setShowBcc(false)} className="text-xs">
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <Input
                id="bcc"
                placeholder="bcc@example.com"
                value={formData.bcc}
                onChange={(e) => setFormData((prev) => ({ ...prev, bcc: e.target.value }))}
              />
            </div>
          )}

          {/* Subject Field */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Email subject"
              value={formData.subject}
              onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
            />
          </div>

          {/* Body Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="body">Message</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAiGenerate}
                disabled={isAiGenerating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 hover:from-purple-700 hover:to-blue-700"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {isAiGenerating ? "Generating..." : "Let AI do it"}
              </Button>
            </div>
            <Textarea
              id="body"
              placeholder="Write your message here..."
              className="min-h-[200px]"
              value={formData.body}
              onChange={(e) => setFormData((prev) => ({ ...prev, body: e.target.value }))}
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Attachments</Label>
              <div>
                <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
                  <Paperclip className="h-3 w-3 mr-1" />
                  Attach Files
                </Button>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {file.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Save Draft
              </Button>
              <Button variant="outline" size="sm">
                Schedule
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

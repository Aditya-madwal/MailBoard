"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ConnectEmailDialog({ open, onOpenChange }) {
  const [step, setStep] = useState("select")
  const [selectedProvider, setSelectedProvider] = useState("")

  const providers = [
    {
      id: "gmail",
      name: "Gmail",
      description: "Connect your Gmail account",
      icon: "📧",
      popular: true,
    },
    {
      id: "outlook",
      name: "Outlook",
      description: "Connect your Outlook account",
      icon: "📮",
      popular: true,
    },
    {
      id: "yahoo",
      name: "Yahoo Mail",
      description: "Connect your Yahoo account",
      icon: "📬",
      popular: false,
    },
    {
      id: "imap",
      name: "IMAP/SMTP",
      description: "Connect any email provider",
      icon: "⚙️",
      popular: false,
    },
  ]

  const handleConnect = (providerId) => {
    setSelectedProvider(providerId)
    setStep("oauth")

    // Simulate OAuth flow
    setTimeout(() => {
      setStep("success")
    }, 2000)

  }

  const handleClose = () => {
    setStep("select")
    setSelectedProvider("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "select" && (
          <>
            <DialogHeader>
              <DialogTitle>Connect Email Account</DialogTitle>
              <DialogDescription>Choose your email provider to get started</DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {providers.map((provider) => (
                <Card
                  key={provider.id}
                  className="cursor-pointer transition-colors hover:bg-accent"
                  // onClick={() => handleConnect(provider.id)}
                  onClick={() => {
                    window.location.href = `/api/auth/google/`
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <div>
                          <CardTitle className="text-sm">{provider.name}</CardTitle>
                          <CardDescription className="text-xs">{provider.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </>
        )}

        {step === "oauth" && (
          <>
            <DialogHeader>
              <DialogTitle>Connecting to {providers.find((p) => p.id === selectedProvider)?.name}</DialogTitle>
              <DialogDescription>Please wait while we securely connect your account...</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-sm text-muted-foreground">Authenticating...</p>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle>Successfully Connected!</DialogTitle>
              <DialogDescription>Your email account has been connected and is ready to use.</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">We're now syncing your emails...</p>
              <Button onClick={handleClose} className="w-full">
                Continue to Dashboard
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

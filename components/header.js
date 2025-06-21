"use client"
import { Button } from "@/components/ui/button"
import { Search, Bell, Plus, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { ComposeDialog } from "@/components/compose-dialog"
import { useState } from "react"

export function Header() {
  const [composeOpen, setComposeOpen] = useState(false)

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-4 px-4">
        <SidebarTrigger className="-ml-1" />

        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search emails, todos, or contacts..." className="pl-10" />
          </div>

          <Button
            onClick={() => setComposeOpen(true)}
            className=""
          >
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
          </Button>

          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${Math.random()}`} />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <ComposeDialog open={composeOpen} onOpenChange={setComposeOpen} />
    </>
  )
}

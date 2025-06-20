"use client"

import * as React from "react"
import { Plus, Settings, LogOut, Sparkles } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ConnectEmailDialog } from "@/components/connect-email-dialog"

const emailAccounts = [
  {
    id: 1,
    email: "john.doe@gmail.com",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/300",
    unread: 12,
    isActive: true,
  },
  {
    id: 2,
    email: "work@company.com",
    name: "Work Account",
    avatar: "https://i.pravatar.cc/300",
    unread: 5,
    isActive: false,
  },
  {
    id: 3,
    email: "personal@gmail.com",
    name: "Personal",
    avatar: "https://i.pravatar.cc/300",
    unread: 0,
    isActive: false,
  },
]

const categories = [
  { name: "Work", color: "bg-blue-500", count: 23 },
  { name: "Personal", color: "bg-green-500", count: 8 },
  { name: "Finance", color: "bg-yellow-500", count: 4 },
  { name: "Travel", color: "bg-purple-500", count: 2 },
  { name: "Shopping", color: "bg-pink-500", count: 6 },
]

export function AppSidebar() {
  const [connectDialogOpen, setConnectDialogOpen] = React.useState(false)

  return (
    <>
      <Sidebar className="border-r">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold">EmailFlow</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <div className="flex items-center justify-between px-2">
              <SidebarGroupLabel>Email Accounts</SidebarGroupLabel>
              <Button variant="ghost" size="sm" onClick={() => setConnectDialogOpen(true)} className="h-6 w-6 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {emailAccounts.map((account) => (
                  <SidebarMenuItem key={account.id}>
                    <SidebarMenuButton isActive={account.isActive} className="h-12 justify-start">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={account.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {account.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">{account.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{account.email}</span>
                      </div>
                      {account.unread > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {account.unread}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {categories.map((category) => (
                  <SidebarMenuItem key={category.name}>
                    <SidebarMenuButton className="justify-start">
                      <div className={`h-3 w-3 rounded-full ${category.color}`} />
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {category.count}
                      </Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-red-100 hover:text-red-700 transition-colors">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <ConnectEmailDialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen} />
    </>
  )
}

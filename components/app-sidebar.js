"use client"

import * as React from "react"
import { useEffect, useState } from "react"
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
import { CreateCategoryDialog } from "@/components/create-category-dialog"
import axios from "axios"
import { fetchEmailAccounts } from "@/services/api/mail/accounts"
import { getAllCategories } from "@/services/api/category/index"
import { useMail } from "@/context/mailContext"
// import { Icon } from "@public"

export function AppSidebar() {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false)
  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] = useState(false)
  const { mailAccounts, setMailAccounts, categories, setCategories, emails, setEmails, labels } = useMail()

  useEffect(() => {
    async function initAccounts() {
      const accounts = await fetchEmailAccounts()
      setMailAccounts(accounts)
    }

    async function initCategories() {
      const categories = await getAllCategories()
      setCategories(categories)
    }
    console.log(categories)

    initAccounts()
    initCategories()
  }, [])

  useEffect(() => {
    console.log(categories)
  }, [categories])

  return (
    <>
      <Sidebar className="bg-black z-70 border-r">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center">
              <img src="/icon.svg" alt="Icon" className="w-fit h-fit object-cover" />
            </div>
            <span className="text-lg font-semibold">MailBoard</span>
            {/* <button className="border" onClick={() => setSample(`sample no. : ${Math.random()}`)}> */}
            {/* {sample} */}
            {/* </button> */}
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
                {mailAccounts?.map((account) => (
                  <SidebarMenuItem key={account.id}>
                    <SidebarMenuButton className="h-12 justify-start">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={account?.avatar} />
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
                      <Badge variant="secondary" className="ml-auto text-xs w-fit">
                        {emails?.filter((e) => e.isUnread && e.gmailAccount == account.id).length}
                      </Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Other groups remain same */}
          {/* Categories */}
          <SidebarGroup>
            <div className="flex items-center justify-between w-full">
              <SidebarGroupLabel>Categories</SidebarGroupLabel>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCreateCategoryDialogOpen(true)}
                className="h-6 w-6 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {categories?.map((category) => (
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

          {/* Labels */}
          <SidebarGroup>
            <SidebarGroupLabel>Labels</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {labels.map((label) => (
                  <SidebarMenuItem key={label.name}>
                    <SidebarMenuButton className="justify-start">
                      <div className={`h-3 w-3 rounded-full ${label.color}`} />
                      <span>{label.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {emails?.filter((e) => e.gmailCategory.toLowerCase() == label.name.toLowerCase()).length}
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
      </Sidebar >

      <ConnectEmailDialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen} />
      <CreateCategoryDialog open={createCategoryDialogOpen} onOpenChange={setCreateCategoryDialogOpen} />
    </>
  )
}

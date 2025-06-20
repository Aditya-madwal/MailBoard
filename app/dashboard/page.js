"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { EmailSidebar } from "@/components/email-sidebar"
import { TodoKanban } from "@/components/todo-kanban"
import { useSidebar } from "@/components/ui/sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { useEffect } from "react"
// make changes here to avoid negative space from sidebar

export default function Dashboard() {
    const { open, state } = useSidebar()

    // Alert whenever sidebar toggles
    useEffect(() => {
        // alert(`Sidebar is now: ${open ? "OPEN" : "CLOSED"} (State: ${state})`)
    }, [open, state])

    return (
        <>
            <AppSidebar />
            <SidebarInset className="flex flex-col h-screen overflow-hidden">
                <div
                    className="fixed top-0 right-0 z-50 bg-background border-b group-data-[collapsible=offcanvas]:left-0 transition-all duration-200"
                    style={open ? { left: "var(--sidebar-width)", width: "calc(100vw - var(--sidebar-width))" } : { left: "0", width: "100vw" }}
                >
                    <Header />
                </div>
                <div className="flex flex-1 pt-16 overflow-hidden">
                    <div
                        className="fixed left-0 top-16 bottom-0 bg-background border-r z-40 group-data-[collapsible=offcanvas]:left-0 transition-all duration-200"
                        style={open ? { left: "var(--sidebar-width)", width: "320px" } : { left: "0", width: "320px" }}
                    >
                        <EmailSidebar />
                    </div>
                    <main className="flex-1 overflow-hidden" style={{ marginLeft: "320px" }}>
                        <TodoKanban />
                    </main>
                </div>
            </SidebarInset>
        </>
    )
}

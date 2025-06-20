import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { EmailSidebar } from "@/components/email-sidebar"
import { TodoKanban } from "@/components/todo-kanban"
import { SidebarInset } from "@/components/ui/sidebar"

export default function Dashboard() {
    return (
        <>
            <AppSidebar />
            <SidebarInset className="flex flex-col h-screen overflow-hidden">
                <div
                    className="fixed top-0 right-0 z-50 bg-background border-b"
                    style={{ left: "var(--sidebar-width)", width: "calc(100vw - var(--sidebar-width))" }}
                >
                    <Header />
                </div>
                <div className="flex flex-1 pt-16 overflow-hidden">
                    <div
                        className="fixed left-0 top-16 bottom-0 bg-background border-r z-40"
                        style={{ left: "var(--sidebar-width)", width: "320px" }}
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

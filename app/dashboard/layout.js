"use client"

import '../globals.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// import { createContext, useContext } from 'react'
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })
// const AuthContext = createContext({ user: null, setUser: null })

export default function DashboardLayout({ children }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true)
                const { user, error } = await getAuth()

                if (error || !user) {
                    router.push('/login')
                    return
                }

                setUser(user.user) // assuming your API returns { user: { ... } }
            } catch (error) {
                console.error('Auth check failed:', error)
                router.push('/login')
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [router])

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center w-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                    <SidebarProvider>{children}</SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}

async function getAuth() {
    try {
        const { data } = await axios.get("/api/auth/showme")
        return { user: data, error: null }
    } catch (error) {
        console.error('Auth request failed:', error)
        return {
            user: null,
            error: error.response?.data?.message || 'Authentication failed'
        }
    }
}

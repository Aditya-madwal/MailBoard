"use client"

import '../globals.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export default function SignupLayout({ children }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true)
                const { user, error } = await getAuth()

                if (user && !error) {
                    router.push('/dashboard')
                    return
                }
                setIsAuthenticated(false)
            } catch (error) {
                console.error('Auth check failed:', error)
                setIsAuthenticated(false)
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [router])

    if (isLoading || isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center w-screen">
                <div className="h-full w-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 dark:border-blue-400 border-t-transparent" />
                </div>
            </div>
        )
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 ${inter.className}`}>
                {children}
            </div>
        </ThemeProvider>
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
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Mail, User, Palette, X } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

// API service imports
import { fetchEmailAccounts } from "@/services/api/mail/accounts"
import { getAllCategories, createCategory, deleteCategory } from "@/services/api/category"

const colorOptions = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-cyan-500",
    "bg-orange-500",
    "bg-emerald-500"
]

export function SettingsModal({ open, onOpenChange }) {
    const [user, setUser] = useState(null)
    const [mailAccounts, setMailAccounts] = useState([])
    const [categories, setCategories] = useState([])
    const [newCategoryName, setNewCategoryName] = useState("")
    const [newCategoryColor, setNewCategoryColor] = useState("bg-blue-500")
    const [showAddCategory, setShowAddCategory] = useState(false)
    const [deletingAccountId, setDeletingAccountId] = useState(null)
    const [deletingCategoryId, setDeletingCategoryId] = useState(null)
    const [loading, setLoading] = useState({
        user: true,
        accounts: true,
        categories: true
    })

    // Fetch user profile
    const fetchUserProfile = async () => {
        try {
            setLoading(prev => ({ ...prev, user: true }))
            const response = await axios.get("/api/auth/showme")
            if (response.data.user) {
                setUser(response.data.user)
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error)
            toast.error('Failed to load user profile')
        } finally {
            setLoading(prev => ({ ...prev, user: false }))
        }
    }

    // Fetch mail accounts
    const fetchMailAccounts = async () => {
        try {
            setLoading(prev => ({ ...prev, accounts: true }))
            const accounts = await fetchEmailAccounts()
            setMailAccounts(accounts)
        } catch (error) {
            console.error('Failed to fetch mail accounts:', error)
            toast.error('Failed to load mail accounts')
        } finally {
            setLoading(prev => ({ ...prev, accounts: false }))
        }
    }

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(prev => ({ ...prev, categories: true }))
            const categoriesData = await getAllCategories()
            setCategories(categoriesData || [])
        } catch (error) {
            console.error('Failed to fetch categories:', error)
            toast.error('Failed to load categories')
        } finally {
            setLoading(prev => ({ ...prev, categories: false }))
        }
    }

    // Load data when modal opens
    useEffect(() => {
        if (open) {
            fetchUserProfile()
            fetchMailAccounts()
            fetchCategories()
        }
    }, [open])

    const getInitials = (name) => {
        if (!name) return "U";
        const words = name.split(" ").filter(Boolean).slice(0, 2);
        return words
            .map(word => {
                for (let i = 0; i < word.length; i++) {
                    if (/[a-zA-Z0-9]/.test(word[i])) return word[i];
                }
                return "";
            })
            .join("")
            .toUpperCase();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const handleDeleteAccount = async (accountId) => {
        try {
            setDeletingAccountId(accountId)
            // TODO: Implement delete account API call
            // const response = await deleteMailAccount(accountId)
            // if (response.success) {
            //     setMailAccounts(prev => prev.filter(acc => acc.id !== accountId))
            //     toast.success('Account removed successfully')
            // }

            // For now, simulate the deletion
            setTimeout(() => {
                setMailAccounts(prev => prev.filter(acc => acc.id !== accountId))
                setDeletingAccountId(null)
                toast.success('Account removed successfully')
            }, 1000)
        } catch (error) {
            console.error('Failed to delete account:', error)
            toast.error('Failed to remove account')
        } finally {
            setDeletingAccountId(null)
        }
    }

    const handleDeleteCategory = async (categoryId) => {
        try {
            setDeletingCategoryId(categoryId)
            const response = await deleteCategory(categoryId)
            if (response) {
                setCategories(prev => prev.filter(cat => cat._id !== categoryId))
                toast.success('Category deleted successfully')
            }
        } catch (error) {
            console.error('Failed to delete category:', error)
            toast.error('Failed to delete category')
        } finally {
            setDeletingCategoryId(null)
        }
    }

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return

        try {
            const categoryData = {
                name: newCategoryName.trim(),
                color: newCategoryColor
            }

            const response = await createCategory(categoryData)
            if (response.category) {
                setCategories(prev => [response.category, ...prev])
                setNewCategoryName("")
                setNewCategoryColor("bg-blue-500")
                setShowAddCategory(false)
                toast.success('Category created successfully')
            }
        } catch (error) {
            console.error('Failed to create category:', error)
            toast.error(error.message || 'Failed to create category')
        }
    }

    const handleAddGmailAccount = () => {
        // Simulate OAuth flow
        console.log("Opening Gmail OAuth flow...")
        toast.info('Gmail OAuth integration coming soon!')
        // This would typically open a popup or redirect to Google OAuth
    }

    const updateUserProfile = async (updatedData) => {
        try {
            // TODO: Implement update user profile API
            // const response = await updateUserProfile(updatedData)
            // if (response.success) {
            //     setUser(prev => ({ ...prev, ...updatedData }))
            //     toast.success('Profile updated successfully')
            // }

            // For now, just update local state
            setUser(prev => ({ ...prev, ...updatedData }))
            toast.success('Profile updated successfully')
        } catch (error) {
            console.error('Failed to update profile:', error)
            toast.error('Failed to update profile')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Settings
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="profile" className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="accounts">Mail Accounts</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto mt-6">
                        <TabsContent value="profile" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>
                                        Your account details and preferences
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {loading.user ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
                                        </div>
                                    ) : user ? (
                                        <>
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-16 w-16">
                                                    <AvatarImage src={user.picture} />
                                                    <AvatarFallback className="text-lg">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-lg">{user.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Display Name</Label>
                                                    <Input
                                                        id="name"
                                                        value={user.name || ""}
                                                        onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
                                                        onBlur={() => updateUserProfile({ name: user.name })}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        id="email"
                                                        value={user.email || ""}
                                                        disabled
                                                        className="bg-muted"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Email cannot be changed
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            Failed to load user profile
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="accounts" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Connected Gmail Accounts</CardTitle>
                                            <CardDescription>
                                                Manage your connected Gmail accounts
                                            </CardDescription>
                                        </div>
                                        <Button onClick={handleAddGmailAccount} size="sm">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Account
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {loading.accounts ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
                                        </div>
                                    ) : mailAccounts.length > 0 ? (
                                        <div className="space-y-4">
                                            {mailAccounts.map((account) => (
                                                <div
                                                    key={account.id}
                                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={account.avatar} />
                                                            <AvatarFallback>
                                                                {getInitials(account.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-medium">{account.name}</h4>
                                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{account.email}</p>
                                                            {account.unread > 0 && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {account.unread} unread
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteAccount(account.id)}
                                                        disabled={deletingAccountId === account.id}
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        {deletingAccountId === account.id ? (
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No mail accounts connected
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="categories" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Email Categories</CardTitle>
                                            <CardDescription>
                                                Organize your emails with custom categories
                                            </CardDescription>
                                        </div>
                                        <Button
                                            onClick={() => setShowAddCategory(true)}
                                            size="sm"
                                            disabled={showAddCategory}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Category
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {showAddCategory && (
                                            <div className="p-4 border rounded-lg bg-accent/20 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium">Create New Category</h4>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setShowAddCategory(false)
                                                            setNewCategoryName("")
                                                            setNewCategoryColor("bg-blue-500")
                                                        }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="grid gap-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="categoryName">Category Name</Label>
                                                        <Input
                                                            id="categoryName"
                                                            placeholder="Enter category name"
                                                            value={newCategoryName}
                                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Color</Label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {colorOptions.map((color) => (
                                                                <button
                                                                    key={color}
                                                                    onClick={() => setNewCategoryColor(color)}
                                                                    className={`h-8 w-8 rounded-full ${color} border-2 transition-all ${newCategoryColor === color
                                                                        ? "border-foreground scale-110"
                                                                        : "border-transparent hover:scale-105"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setShowAddCategory(false)
                                                            setNewCategoryName("")
                                                            setNewCategoryColor("bg-blue-500")
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={handleAddCategory}
                                                        disabled={!newCategoryName.trim()}
                                                    >
                                                        Create Category
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {loading.categories ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
                                            </div>
                                        ) : categories.length > 0 ? (
                                            categories.map((category) => (
                                                <div
                                                    key={category._id}
                                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-4 w-4 rounded-full ${category.color}`} />
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-medium capitalize">{category.name}</h4>
                                                                <Palette className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">
                                                                Created on {formatDate(category.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteCategory(category._id)}
                                                        disabled={deletingCategoryId === category._id}
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        {deletingCategoryId === category._id ? (
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                No categories created yet
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
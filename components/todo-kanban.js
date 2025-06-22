"use client"

import { useState } from "react"
import { Plus, Calendar, Link, Clock, User, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddTaskDialog } from "@/components/add-task-dialog"

const columns = [
  { id: "todo", title: "To Do", color: "border-gray-500" },
  { id: "progress", title: "In Progress", color: "border-blue-500" },
  { id: "review", title: "Review", color: "border-yellow-500" },
  { id: "done", title: "Done", color: "border-green-500" },
]

const todos = [
  {
    id: 1,
    title: "Review Q4 Marketing Campaign",
    description: "Analyze campaign metrics and prepare feedback",
    status: "todo",
    priority: "high",
    dueDate: "2024-01-15",
    avatar: "/placeholder.svg?height=24&width=24",
    tags: ["Marketing", "Review"],
    emailSource: true,
    links: ["https://analytics.google.com/campaign-123"],
    createdAt: "2024-01-10T10:30:00Z",
  },
  {
    id: 2,
    title: "Update Security Protocols",
    description: "Review and update company security guidelines",
    status: "progress",
    priority: "medium",
    dueDate: "2024-01-20",
    avatar: "/placeholder.svg?height=24&width=24",
    tags: ["Security", "Documentation"],
    emailSource: true,
    links: ["https://github.com/company/security-docs"],
    createdAt: "2024-01-08T14:15:00Z",
  },
  {
    id: 3,
    title: "Process Monthly Statements",
    description: "Review and categorize December expenses",
    status: "review",
    priority: "low",
    dueDate: "2024-01-12",
    avatar: "/placeholder.svg?height=24&width=24",
    tags: ["Finance", "Monthly"],
    emailSource: true,
    links: [],
    createdAt: "2024-01-09T09:00:00Z",
  },
  {
    id: 4,
    title: "Setup New Development Environment",
    description: "Configure development tools and dependencies",
    status: "done",
    priority: "medium",
    dueDate: "2024-01-10",
    avatar: "/placeholder.svg?height=24&width=24",
    tags: ["Development", "Setup"],
    emailSource: false,
    links: ["https://github.com/company/dev-setup"],
    createdAt: "2024-01-05T16:45:00Z",
  },
  {
    id: 5,
    title: "Review Q4 Marketing Campaign",
    description: "Analyze campaign metrics and prepare feedback",
    status: "todo",
    priority: "high",
    dueDate: "2024-01-15",
    avatar: "/placeholder.svg?height=24&width=24",
    tags: ["Marketing", "Review"],
    emailSource: true,
    links: ["https://analytics.google.com/campaign-123"],
    createdAt: "2024-01-10T10:30:00Z",
  },
  {
    id: 6,
    title: "Review Q4 Marketing Campaign",
    description: "Analyze campaign metrics and prepare feedback",
    status: "todo",
    priority: "high",
    dueDate: "2024-01-15",
    avatar: "/placeholder.svg?height=24&width=24",
    tags: ["Marketing", "Review"],
    emailSource: true,
    links: ["https://analytics.google.com/campaign-123"],
    createdAt: "2024-01-10T10:30:00Z",
  },
]

const priorityColors = {
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

export function TodoKanban() {
  const [hoveredTodo, setHoveredTodo] = useState(null)
  const [addTaskOpen, setAddTaskOpen] = useState(false)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6 border-b bg-background flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Todo Board</h1>
          <p className="text-muted-foreground">Manage tasks created from emails and manual entries</p>
        </div>
        <Button onClick={() => setAddTaskOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col w-80 flex-shrink-0 h-full">
              <div className={`border-t-4 ${column.color} bg-card rounded-t-lg p-4 flex-shrink-0`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{column.title}</h3>
                  <Badge variant="secondary">{todos.filter((todo) => todo.status === column.id).length}</Badge>
                </div>
              </div>

              <div className="flex-1 bg-muted/20 rounded-b-lg p-2 overflow-y-auto min-h-0">
                <div className="space-y-3">
                  {todos
                    .filter((todo) => todo.status === column.id)
                    .map((todo) => (
                      <Card
                        key={todo.id}
                        className="cursor-pointer transition-all duration-300 hover:shadow-md relative overflow-hidden"
                        onMouseEnter={() => setHoveredTodo(todo.id)}
                        onMouseLeave={() => setHoveredTodo(null)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-medium leading-tight">{todo.title}</CardTitle>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{todo.description}</p>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {todo.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {todo.emailSource && (
                              <Badge variant="outline" className="text-xs">
                                📧 Email
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${priorityColors[todo.priority]}`}>{todo.priority}</Badge>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDate(todo.dueDate)}
                            </div>
                          </div>

                          {/* Expanded details with smooth transition */}
                          <div
                            className={`transition-all duration-400 ease-in-out overflow-hidden ${hoveredTodo === todo.id
                              ? 'max-h-48 opacity-100 mt-4'
                              : 'max-h-0 opacity-0 mt-0'
                              }`}
                          >
                            <div className="p-3 bg-popover border rounded-lg shadow-lg">
                              <div className="space-y-2 text-xs">

                                <div className="flex items-center gap-2 transform transition-transform duration-300 delay-75">
                                  <Clock className="h-3 w-3" />
                                  <span>Created: {formatDateTime(todo.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2 transform transition-transform duration-300 delay-100">
                                  <Calendar className="h-3 w-3" />
                                  <span>Due: {formatDateTime(todo.dueDate)}</span>
                                </div>
                                {todo.links.length > 0 && (
                                  <div className="space-y-1 transform transition-transform duration-300 delay-150">
                                    <div className="flex items-center gap-2">
                                      <Link className="h-3 w-3" />
                                      <span>Links:</span>
                                    </div>
                                    {todo.links.map((link, index) => (
                                      <a
                                        key={index}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-blue-600 hover:underline truncate ml-5"
                                      >
                                        {link}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddTaskDialog open={addTaskOpen} onOpenChange={setAddTaskOpen} />
    </div>
  )
}
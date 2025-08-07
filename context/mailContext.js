"use client"

import { createContext, useContext, useState } from "react"
import { getAllTasks } from "@/services/api/todo"

const MailContext = createContext()

export const MailProvider = ({ children }) => {
    const [emails, setEmails] = useState([])
    const [loading, setLoading] = useState(true)
    const [mailAccounts, setMailAccounts] = useState([])
    const [categories, setCategories] = useState([])
    const [tasks, setTasks] = useState([])

    const [labels, setLabels] = useState([
        { name: "Primary", color: "bg-red-500" },
        { name: "Social", color: "bg-blue-500" },
        { name: "Promotions", color: "bg-green-500" },
        { name: "Updates", color: "bg-yellow-500" },
        { name: "Forums", color: "bg-purple-500" },
    ])

    const [sample, setSample] = useState("hello")

    // Fetch tasks from backend and update state
    const fetchTasks = async () => {
        const fetchedTasks = await getAllTasks();
        setTasks(fetchedTasks);
    }

    return (
        <MailContext.Provider
            value={{
                emails,
                setEmails,
                loading,
                setLoading,

                mailAccounts,
                setMailAccounts,

                categories,
                setCategories,

                tasks,
                setTasks,
                fetchTasks,

                labels,
                setLabels,

                sample,
                setSample,
            }}
        >
            {children}
        </MailContext.Provider>
    )
}

export const useMail = () => useContext(MailContext)

import axios from 'axios'
import toast from 'react-hot-toast'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

/**
 * Get all tasks
 */
export async function getAllTasks() {
    try {
        const response = await axios.get(`${BASE_URL}/api/task/`)
        return response.data
    } catch (err) {
        console.error("Failed to fetch tasks:", err)
        toast.error("Failed to fetch tasks. Please try again.")
        return null
    }
}

/**
 * Create a new task
 */
export async function createTask(taskData) {
    try {
        const response = await axios.post(`${BASE_URL}/api/task/`, taskData)
        toast.success("Task created successfully!")
        return response.data
    } catch (err) {
        console.error("Failed to create task:", err)
        toast.error("Failed to create task. Please try again.")
        return null
    }
}

/**
 * Convert an email to a task
 */
export async function convertMailToTask(accountId, messageId) {
    try {
        const response = await axios.post(`${BASE_URL}/api/mail/${accountId}/inbox/${messageId}/task/`)
        toast.success("Email successfully converted to task!")
        return response.data
    } catch (err) {
        console.error("Failed to convert mail to task:", err)
        toast.error("Failed to convert mail to task. Please try again.")
        return null
    }
}

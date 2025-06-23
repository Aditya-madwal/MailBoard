import { GoogleGenerativeAI } from '@google/generative-ai'

// Load your Gemini API key
const genAI = new GoogleGenerativeAI("AIzaSyCUx3Imz3Ek5FIvwLLRSc1HRA41zfdzT3c")

// Define response schema for strict JSON format
const responseSchema = {
    type: "ARRAY",
    items: {
        type: "STRING"
    }
}

// Utility: create a structured prompt for batch processing
function buildBatchPrompt(emails, categories) {
    const categoryList = categories.join(', ')
    let prompt = `
You are an intelligent email assistant. Classify each of the following emails into one of these user-defined categories:
[${categoryList}]

Return an array of category names in the same order as the emails. Each category must be exactly one of the provided categories.

Emails:\n`

    emails.forEach((email, index) => {
        prompt += `
Email ${index + 1}:
- Subject: ${email.subject}
- Snippet: ${email.snippet}
- Sender Name: ${email.senderName}
- Sender Email: ${email.senderEmail}
- Gmail Category: ${email.gmailCategory}
`
    })

    return prompt
}

// Categorize emails in a single Gemini API call with schema validation
export async function categorizeEmails(emails, categories) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = buildBatchPrompt(emails, categories)

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: responseSchema
            }
        })

        const response = await result.response
        const text = response.text().trim()

        // Parse the JSON response
        const parsed = JSON.parse(text)

        // Validate that we got the expected number of categories
        if (Array.isArray(parsed) && parsed.length === emails.length) {
            // Validate that all categories are from the allowed list
            const validCategories = parsed.every(category =>
                categories.includes(category.toLowerCase()) || category === "uncategorized"
            )

            if (validCategories) {
                return parsed
            } else {
                console.warn("Some categories not in allowed list, using fallback")
                return emails.map(() => "uncategorized")
            }
        } else {
            throw new Error(`Expected ${emails.length} categories, got ${parsed.length}`)
        }
    } catch (err) {
        console.error("Gemini categorization failed:", err)
        return emails.map(() => "uncategorized") // fallback: all uncategorized
    }
}

// Test data
const emails = [
    {
        "id": "1979bf197b1b6c87",
        "snippet": "pallavi.pal04 , aishaa_singh_1103 and others posted something new. Catch up on Instagram pallavi.pal04, aishaa_singh_1103 and others posted something new. Open Instagram 1 You have 1 notification that",
        "subject": "__adityyaaaaa, catch up on moments that you've missed",
        "date": "Mon, 23 Jun 2025 01:39:40 -0700",
        "isUnread": true,
        "senderName": "\"pallavi.pal04 on Instagram\"",
        "senderEmail": "no-reply@mail.instagram.com",
        "senderPicture": null,
        "gmailCategory": "social",
        "user": "6855a6606588cba2dfc9b3ef"
    },
    {
        "id": "1979b82434e51dd5",
        "snippet": "View jobs in India ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏",
        "subject": "30+ new jobs for “python django”",
        "date": "Mon, 23 Jun 2025 06:38:10 +0000 (UTC)",
        "isUnread": true,
        "senderName": "LinkedIn Job Alerts",
        "senderEmail": "jobalerts-noreply@linkedin.com",
        "senderPicture": null,
        "gmailCategory": "updates",
        "user": "6855a6606588cba2dfc9b3ef"
    },
    {
        "id": "1979b6441165a46f",
        "snippet": "Dear Customer, Rs.70.00 has been debited from account 1506 to VPA paytm.s17e148@pty Shane alam on 23-06-25. Your UPI transaction reference number is 517435265174. If you did not authorize this",
        "subject": "❗  You have done a UPI txn. Check details!",
        "date": "Mon, 23 Jun 2025 11:35:27 +0530",
        "isUnread": true,
        "senderName": "HDFC Bank InstaAlerts",
        "senderEmail": "alerts@hdfcbank.net",
        "senderPicture": null,
        "gmailCategory": "updates",
        "user": "6855a6606588cba2dfc9b3ef"
    }
]

const categories = ['personal', 'spam', 'college', 'work', 'offers', 'promotions', 'social', 'finance']

// Test the function
categorizeEmails(emails, categories).then(results => {
    console.log("Predicted Categories:", results)
})
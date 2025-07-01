import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API_KEY)

const responseSchema = {
    type: "ARRAY",
    items: {
        type: "STRING"
    }
}

function buildBatchPrompt(emails, categories) {
    const categoryList = categories.join(', ')
    let prompt = `
You are an intelligent email assistant. Classify each of the following emails into one of these user-defined categories:
[${categoryList}]

IMPORTANT: Return category names with exact case matching. The available categories are: ${categoryList}

Return an array of category names in the same order as the emails. Each category must be exactly one of the provided categories with matching capitalization.

If an email doesn't fit any category, use "Uncategorized".

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
        console.log("AI Response:", parsed)

        // Validate that we got the expected number of categories
        if (Array.isArray(parsed) && parsed.length === emails.length) {
            // Create a case-insensitive lookup for valid categories
            const categoryMap = new Map()
            categories.forEach(cat => {
                categoryMap.set(cat.toLowerCase(), cat)
            })
            categoryMap.set('uncategorized', 'Uncategorized')

            // Normalize and validate categories
            const normalizedCategories = parsed.map(category => {
                const lowerCategory = category.toLowerCase()
                if (categoryMap.has(lowerCategory)) {
                    return categoryMap.get(lowerCategory)
                }
                console.warn(`Unknown category: ${category}, using Uncategorized`)
                return 'Uncategorized'
            })

            console.log("Normalized categories:", normalizedCategories) // Debug log
            return normalizedCategories

        } else {
            throw new Error(`Expected ${emails.length} categories, got ${parsed.length}`)
        }
    } catch (err) {
        console.error("Gemini categorization failed:", err)
        return emails.map(() => "Uncategorized") // fallback: all uncategorized
    }
}
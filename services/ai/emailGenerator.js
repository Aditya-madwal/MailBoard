import { GoogleGenerativeAI } from '@google/generative-ai'

// Load your Gemini API key
const genAI = new GoogleGenerativeAI("AIzaSyCUx3Imz3Ek5FIvwLLRSc1HRA41zfdzT3c")


// Utility: create a structured prompt for email body generation
function buildEmailBodyPrompt(subject) {
    return `
You are an intelligent email writing assistant. Generate a complete email body based on the given subject line.

Requirements:
- Create a professional and natural email body
- Include placeholders in square brackets like [YOUR NAME], [SPECIFIC DETAILS], [DATE], etc. for user customization
- Make it contextually appropriate for the subject
- Return only the email body content in plain text
- Keep it concise but complete

Subject: "${subject}"

Generate the email body:
`
}

// Generate email body using Gemini API
export async function generateEmailBody(subject) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = buildEmailBodyPrompt(subject)

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "text/plain",
                temperature: 0.7,
                maxOutputTokens: 400
            }
        })

        const response = result.response
        const emailBody = response.text().trim()

        if (emailBody && emailBody.length > 10) {
            return emailBody
        } else {
            throw new Error("Generated email body is too short")
        }
    } catch (err) {
        console.error("Gemini email generation failed:", err)
    }
}

// Test the function
// generateEmailBody("Follow up on our meeting yesterday").then(result => {
//     // console.log("Subject: Follow up on our meeting yesterday")
//     // console.log("Generated Body:")
//     console.log(result)
// })
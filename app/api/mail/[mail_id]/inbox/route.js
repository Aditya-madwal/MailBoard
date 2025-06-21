// app/api/mail/[mail_id]/inbox/route.js

import { google } from 'googleapis'
import dbConnect from '@/lib/db'
import GmailAccount from '@/models/GmailAccount'
import { validateAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request, contextPromise) {
    try {
        const context = await contextPromise
        const { mail_id } = context.params

        if (!mail_id) {
            return NextResponse.json({ error: 'Mail ID is required' }, { status: 400 })
        }

        await dbConnect()

        const authResult = await validateAuth(request)
        if (!authResult.isValid) {
            return NextResponse.json({ error: authResult.error }, { status: 401 })
        }

        const gmailAccount = await GmailAccount.findById(mail_id)
        if (!gmailAccount || gmailAccount.user.toString() !== authResult.user.userId) {
            return NextResponse.json({ error: 'Gmail account not found or unauthorized' }, { status: 403 })
        }

        const oauth2Client = new google.auth.OAuth2()
        oauth2Client.setCredentials({ access_token: gmailAccount.accessToken })

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

        // Fetch inbox messages (limit to 10-20 for performance)
        const inboxRes = await gmail.users.messages.list({
            userId: 'me',
            labelIds: ['INBOX'],
            maxResults: 20,
        })

        const messageIds = inboxRes.data.messages || []

        const detailedMessages = await Promise.all(
            messageIds.map(async (msg) => {
                const detail = await gmail.users.messages.get({
                    userId: 'me',
                    id: msg.id,
                    format: 'full',
                })

                const payload = detail.data.payload
                const headers = payload.headers

                const getHeader = (name) =>
                    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value

                const bodyPart =
                    payload.parts?.find((p) => p.mimeType === 'text/plain') ||
                    payload.parts?.find((p) => p.mimeType === 'text/html') ||
                    payload

                const encodedBody = bodyPart?.body?.data || ''
                const body = Buffer.from(encodedBody, 'base64').toString('utf-8')

                return {
                    id: detail.data.id,
                    threadId: detail.data.threadId,
                    snippet: detail.data.snippet,
                    subject: getHeader('Subject') || '',
                    from: getHeader('From') || '',
                    to: getHeader('To') || '',
                    date: getHeader('Date') || '',
                    body,
                }
            })
        )

        return NextResponse.json({ inbox: detailedMessages })
    } catch (err) {
        console.error('Inbox fetch error:', err)
        return NextResponse.json({ error: 'Failed to fetch inbox' }, { status: 500 })
    }
}

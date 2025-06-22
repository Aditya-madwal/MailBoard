// app/api/mail/[mail_id]/inbox/route.js

import { google } from 'googleapis'
import dbConnect from '@/lib/db'
import GmailAccount from '@/models/GmailAccount'
import { validateAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { getValidOAuthClient } from '@/services/mail/getValidOAuthClient'
import InboxMail from '@/models/InboxMail'

export async function GET(request, { params }) {
    try {
        const { mail_id } = await params

        if (!mail_id) {
            return NextResponse.json({ error: 'Mail ID is required' }, { status: 400 })
        }

        await dbConnect()

        const authResult = await validateAuth(request)
        if (!authResult.isValid) {
            return NextResponse.json({ error: authResult.error }, { status: 401 })
        }

        const { oauth2Client, gmailAccount } = await getValidOAuthClient(mail_id)
        if (!gmailAccount || gmailAccount.user.toString() !== authResult.user.userId) {
            return NextResponse.json({ error: 'Gmail account not found or unauthorized' }, { status: 403 })
        }

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })

        const inboxRes = await gmail.users.messages.list({
            userId: 'me',
            labelIds: ['INBOX'],
            maxResults: 20,
        })

        const messageIds = inboxRes.data.messages || []

        const summarizedMessages = await Promise.all(
            messageIds.map(async (msg) => {
                const detail = await gmail.users.messages.get({
                    userId: 'me',
                    id: msg.id,
                    format: 'metadata',
                    metadataHeaders: ['Subject', 'From', 'Date'],
                })

                const headers = detail.data.payload?.headers || []
                const getHeader = (name) => headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value

                const from = getHeader('From') || ''
                const senderEmail = extractEmail(from)
                const senderName = from.split('<')[0].trim()

                let senderPicture = null

                try {
                    // Use People API to try fetching contact info
                    const contact = await people.people.searchContacts({
                        query: senderEmail,
                        readMask: 'photos',
                        pageSize: 1,
                    })

                    if (contact?.data?.results?.[0]?.person?.photos?.[0]?.url) {
                        senderPicture = contact.data.results[0].person.photos[0].url
                    }
                } catch (err) {
                    // console.log(`couldn't fetch email for : ${senderName}`)
                }

                const isUnread = detail.data.labelIds?.includes('UNREAD')
                const dateStr = getHeader('Date') || ''
                const parsedDate = new Date(dateStr)

                // Categorize Gmail category
                const labelIds = detail.data.labelIds || []
                let gmailCategory = 'primary' // Default fallback

                if (labelIds.includes('CATEGORY_PROMOTIONS')) {
                    gmailCategory = 'promotions'
                } else if (labelIds.includes('CATEGORY_SOCIAL')) {
                    gmailCategory = 'social'
                } else if (labelIds.includes('CATEGORY_UPDATES')) {
                    gmailCategory = 'updates'
                } else if (labelIds.includes('CATEGORY_FORUMS')) {
                    gmailCategory = 'forums'
                }

                await InboxMail.findOneAndUpdate(
                    { messageId: detail.data.id },
                    {
                        gmailAccount: gmailAccount._id,
                        messageId: detail.data.id,
                        threadId: detail.data.threadId,
                        snippet: detail.data.snippet,
                        subject: getHeader('Subject') || '',
                        from,
                        to: getHeader('To') || '',
                        date: parsedDate,
                        senderName,
                        senderEmail,
                        senderPicture,
                        isUnread,
                        labelIds,
                        gmailCategory,
                    },
                    { upsert: true, new: true }
                )

                return {
                    id: detail.data.id,
                    snippet: detail.data.snippet,
                    subject: getHeader('Subject') || '',
                    date: getHeader('Date') || '',
                    isUnread,
                    senderName,
                    senderEmail,
                    senderPicture,
                    gmailCategory,
                }
            })
        )

        return NextResponse.json({ inbox: summarizedMessages })
    } catch (err) {
        console.error('Inbox summary fetch error:', err)
        return NextResponse.json({ error: 'Failed to fetch inbox summary' }, { status: 500 })
    }
}

function extractEmail(fromHeader) {
    const match = fromHeader.match(/<(.+?)>/)
    return match ? match[1] : fromHeader.trim()
}
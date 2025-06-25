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
        const people = google.people({ version: 'v1', auth: oauth2Client })

        const allMailsRes = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 50, // Increased since we're fetching all mails
        })

        const messageIds = allMailsRes.data.messages || []

        const detailedMessages = await Promise.all(
            messageIds.map(async (msg) => {
                // Fetch full message details instead of just metadata
                const detail = await gmail.users.messages.get({
                    userId: 'me',
                    id: msg.id,
                    format: 'full', // Changed from 'metadata' to 'full'
                })

                const payload = detail.data.payload || {}
                const headers = payload.headers || []
                const getHeader = (name) => headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || ''

                const from = getHeader('From')
                const to = getHeader('To')
                const cc = getHeader('Cc')
                const bcc = getHeader('Bcc')
                const subject = getHeader('Subject')
                const date = getHeader('Date')

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
                    // console.log(`couldn't fetch contact photo for: ${senderName}`)
                }

                // Extract attachments
                const parts = payload.parts || []
                const attachments = []

                const findAttachments = (partList) => {
                    for (const part of partList) {
                        if (part.parts) {
                            findAttachments(part.parts)
                        } else if (part.filename && part.body?.attachmentId) {
                            attachments.push({
                                filename: part.filename,
                                mimeType: part.mimeType,
                                attachmentId: part.body.attachmentId,
                            })
                        }
                    }
                }
                findAttachments(parts)

                // Extract body content - handle nested multipart structure
                const extractBodyFromParts = (partList) => {
                    for (const part of partList) {
                        // If this part has nested parts, recurse
                        if (part.parts && part.parts.length > 0) {
                            const nestedBody = extractBodyFromParts(part.parts)
                            if (nestedBody) return nestedBody
                        }
                        // Check if this part contains body content
                        else if (part.body?.data && (part.mimeType === 'text/plain' || part.mimeType === 'text/html')) {
                            return part.body.data
                        }
                    }
                    return null
                }

                let encodedBody = ''

                // Try to extract body from parts first
                if (parts.length > 0) {
                    encodedBody = extractBodyFromParts(parts) || ''
                }

                // Fallback to payload body if no parts or no body found in parts
                if (!encodedBody && payload.body?.data) {
                    encodedBody = payload.body.data
                }

                const decodedBody = encodedBody ? Buffer.from(encodedBody, 'base64').toString('utf-8') : ''

                const isUnread = detail.data.labelIds?.includes('UNREAD')
                const dateStr = date || ''
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

                // Convert CC and BCC to arrays
                const parseEmailList = (str) => str ? str.split(',').map(e => e.trim()) : []
                const ccList = parseEmailList(cc)
                const bccList = parseEmailList(bcc)

                // Save complete message details to database
                await InboxMail.findOneAndUpdate(
                    { messageId: detail.data.id },
                    {
                        gmailAccount: gmailAccount._id,
                        messageId: detail.data.id,
                        threadId: detail.data.threadId,
                        snippet: detail.data.snippet,
                        subject: subject || '',
                        from,
                        to,
                        cc: ccList,
                        bcc: bccList,
                        date: parsedDate,
                        senderName,
                        senderEmail,
                        senderPicture,
                        body: decodedBody,
                        attachments,
                        isUnread,
                        labelIds,
                        gmailCategory,
                        UserCategory: null,
                        user: authResult.user.userId
                    },
                    { upsert: true, new: true }
                )

                // Return complete message data for frontend
                return {
                    id: detail.data.id,
                    threadId: detail.data.threadId,
                    snippet: detail.data.snippet,
                    subject: subject || '',
                    from,
                    to,
                    cc: ccList,
                    bcc: bccList,
                    date: date || '',
                    senderName,
                    senderEmail,
                    senderPicture,
                    body: decodedBody,
                    attachments,
                    isUnread,
                    labelIds,
                    gmailCategory,
                    user: authResult.user.userId
                }
            })
        )

        return NextResponse.json(detailedMessages)
    } catch (err) {
        console.error('All mails fetch error:', err)
        return NextResponse.json({ error: 'Failed to fetch all mails' }, { status: 500 })
    }
}

function extractEmail(fromHeader) {
    if (!fromHeader) return ''
    const match = fromHeader.match(/<(.+?)>/)
    return match ? match[1] : fromHeader.trim()
}
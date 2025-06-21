import { google } from 'googleapis'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import GmailAccount from '@/models/GmailAccount'
import { verifyToken } from '@/lib/jwt'
import { NextResponse } from 'next/server'

export async function GET(request) {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const stateToken = url.searchParams.get('state')

    if (!code || !stateToken) {
        return NextResponse.json({ message: 'Missing code or state' }, { status: 400 })
    }

    const decoded = verifyToken(stateToken)
    if (!decoded) {
        return NextResponse.json({ message: 'Invalid token in state' }, { status: 401 })
    }

    try {
        await dbConnect()

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
        )

        const { tokens } = await oauth2Client.getToken(code)
        oauth2Client.setCredentials(tokens)

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
        const profile = await gmail.users.getProfile({ userId: 'me' })

        const email = profile.data.emailAddress
        const userId = decoded.userId

        // Check if Gmail account already exists for this user + email
        let gmailAccount = await GmailAccount.findOne({ user: userId, email })

        if (!gmailAccount) {
            // Create new Gmail account document
            gmailAccount = new GmailAccount({
                user: userId,
                email,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                tokenExpiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null
            })
        } else {
            // Update existing Gmail account
            gmailAccount.accessToken = tokens.access_token
            gmailAccount.refreshToken = tokens.refresh_token
            gmailAccount.tokenExpiryDate = tokens.expiry_date ? new Date(tokens.expiry_date) : null
        }

        await gmailAccount.save()

        // Set as primary if user has no primary yet
        const user = await User.findById(userId)
        if (!user.primaryGmailAccount) {
            user.primaryGmailAccount = gmailAccount._id
            await user.save()
        }

        // return NextResponse.json({
        //     message: 'Gmail account linked successfully',
        //     user: user,
        //     gmail: gmailAccount,
        //     primary: user.primaryGmailAccount.equals(gmailAccount._id)
        // })
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`)
    } catch (error) {
        console.error('OAuth callback error:', error)
        return NextResponse.json({
            message: 'OAuth callback failed',
            error: error.message
        }, { status: 500 })
    }
}

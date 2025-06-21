import { google } from 'googleapis'
import dbConnect from '@/lib/db'
import User from '@/models/User'
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

        // Method 1: Using findByIdAndUpdate (Recommended)
        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId,
            {
                $set: {
                    'gmail.email': profile.data.emailAddress,
                    'gmail.accessToken': tokens.access_token,
                    'gmail.refreshToken': tokens.refresh_token,
                    'gmail.tokenExpiryDate': tokens.expiry_date ? new Date(tokens.expiry_date) : null,
                }
            },
            { new: true, runValidators: true }
        )

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        // Log to verify the update
        console.log('User updated successfully:', {
            userId: updatedUser._id,
            decode: decoded,
            userid: decoded.userId,
        })

        return NextResponse.json({
            message: 'User updated',
            decode: decoded,
            userid: decoded.userId,
            updated: updatedUser,
            'gmail.email': profile.data.emailAddress,
            'gmail.accessToken': tokens.access_token,
            'gmail.refreshToken': tokens.refresh_token,
            'gmail.tokenExpiryDate': tokens.expiry_date ? new Date(tokens.expiry_date) : null
        })

        // Alternative Method 2: If you prefer the original approach, use markModified
        /*
        const user = await User.findById(decoded.userId)
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        user.gmail = {
            email: profile.data.emailAddress,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenExpiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        }

        // Tell Mongoose that the gmail field has been modified
        user.markModified('gmail')
        await user.save()

        return NextResponse.json({ 
            message: 'User updated', 
            user: user.gmail 
        })
        */

    } catch (error) {
        console.error('OAuth callback error:', error)
        return NextResponse.json({
            message: 'OAuth callback failed',
            error: error.message
        }, { status: 500 })
    }
}
import { google } from 'googleapis'
import { cookies } from 'next/headers'

export async function GET(request) {
    // const token = cookies().get('token')?.value
    const cookieStore = await cookies()  // ✅ await it
    const token = cookieStore.get('token')?.value

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        // `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
        process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
    )

    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/contacts.readonly', // optional
        'https://www.googleapis.com/auth/contacts', // optional
        'https://www.googleapis.com/auth/contacts.other.readonly', // optional
        'https://www.googleapis.com/auth/directory.readonly', // optional
        'https://www.googleapis.com/auth/profile.agerange.read', // optional
        'https://www.googleapis.com/auth/profile.language.read', // optional
        'https://www.googleapis.com/auth/user.emails.read', // 👈 safe bet
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/plus.login', // for legacy fallback
        'https://www.googleapis.com/auth/plus.me',    // for legacy fallback
        'https://www.googleapis.com/auth/plus.profile.emails.read' // for legacy fallback

    ]

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes,
        state: token // 👈 store JWT here
    })

    return Response.redirect(url)
}

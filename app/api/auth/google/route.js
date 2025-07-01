import { google } from 'googleapis'
import { cookies } from 'next/headers'

export async function GET(request) {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
    )

    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/contacts.readonly',
        'https://www.googleapis.com/auth/contacts',
        'https://www.googleapis.com/auth/contacts.other.readonly',
        'https://www.googleapis.com/auth/directory.readonly',
        'https://www.googleapis.com/auth/profile.agerange.read',
        'https://www.googleapis.com/auth/profile.language.read',
        'https://www.googleapis.com/auth/user.emails.read',
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]


    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes,
        state: token
    })

    return Response.redirect(url)
}

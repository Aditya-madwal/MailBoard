import dbConnect from '@/lib/db'
import { validateAuth } from '@/lib/auth'
import InboxMail from '@/models/InboxMail'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        await dbConnect()

        const authResult = await validateAuth(request)
        if (!authResult.isValid) {
            return NextResponse.json({ error: authResult.error }, { status: 401 })
        }

        const userId = authResult.user.userId

        const mails = await InboxMail.find({ user: userId })
            .populate('UserCategory', 'name color')
            .sort({ date: -1 })
            .lean()

        // console.log(mails.length)
        // console.log(mails[0].UserCategory)
        // console.log(mails[0]._id)

        return NextResponse.json({ inbox: mails }, { status: 200 })
    } catch (error) {
        console.error('Unified inbox fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch inbox' }, { status: 500 })
    }
}

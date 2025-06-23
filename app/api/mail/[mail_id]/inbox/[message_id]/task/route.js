// // app/api/mail/[mail_id]/inbox/[message_id]/task/route.js

// import { NextResponse } from 'next/server'
// import InboxMail from '@/models/InboxMail'
// import Task from '@/models/Task'
// import dbConnect from '@/lib/db'
// import { validateAuth } from '@/lib/auth'
// import { convertEmailToTask } from '@/services/ai/emailToTask' // <- ✅ you must export it from your Gemini script

// export async function POST(req, { params }) {
//     await dbConnect()

//     const { mail_id, message_id } = await params

//     return NextResponse.json({
//         mail_id,
//         message_id,
//     })

//     // Authenticate user
//     const authResult = await validateAuth(request)
//     if (!authResult.isValid) {
//         return NextResponse.json({ error: authResult.error }, { status: 401 })
//     }

//     // Find Gmail account and verify ownership
//     // const gmailAccount = await GmailAccount.findById(mail_id)
//     // const { oauth2Client, gmailAccount } = await getValidOAuthClient(mail_id)
//     // if (!gmailAccount || gmailAccount.user.toString() !== authResult.user.userId) {
//     //     return NextResponse.json({ error: 'Unauthorized or Gmail account not found' }, { status: 403 })
//     // }

//     const userId = authResult.user.userId

//     try {
//         const mail = await InboxMail.findOne({
//             _id: mail_id,
//             messageId: message_id,
//             user: userId,
//         }).lean()

//         if (!mail) {
//             return NextResponse.json({ error: 'Mail not found' }, { status: 404 })
//         }

//         // ✅ Use Gemini AI to convert email to task structure
//         const taskPayload = await convertEmailToTask(mail)

//         // ✅ Attach required fields from server logic
//         const newTask = new Task({
//             ...taskPayload,
//             createdBy: userId,
//             UserCategory: mail.UserCategory || null,
//         })

//         await newTask.save()

//         return NextResponse.json({ success: true, task: newTask }, { status: 201 })

//     } catch (error) {
//         console.error('Email to Task Error:', error)
//         return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
//     }
// }

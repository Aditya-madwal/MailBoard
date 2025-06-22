// models/InboxMail.js

import mongoose from "mongoose";

const inboxMailSchema = new mongoose.Schema(
    {
        gmailAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'GmailAccount', required: true },

        messageId: { type: String, required: true, unique: true },
        threadId: { type: String },
        snippet: { type: String },
        subject: { type: String },
        from: { type: String },
        to: { type: String },

        cc: [{ type: String }],     // ✅ now array
        bcc: [{ type: String }],    // ✅ now array

        date: {
            type: Date
        },
        senderName: { type: String },
        senderEmail: { type: String },
        senderPicture: { type: String, default: null },

        body: { type: String, default: '' },
        attachments: [
            {
                filename: String,
                mimeType: String,
                attachmentId: String,
            },
        ],

        isUnread: { type: Boolean, default: true },
        labelIds: [String],
    },
    { timestamps: true }
)


export default mongoose.models.InboxMail ||
    mongoose.model("InboxMail", inboxMailSchema);

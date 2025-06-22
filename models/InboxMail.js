const mongoose = require("mongoose");

const InboxMailSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        gmailAccount: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GmailAccount",
            required: true,
        },
        messageId: { type: String, required: true, unique: true },
        threadId: String,
        subject: String,
        from: String,
        to: String,
        date: Date,
        snippet: String,
        body: String,
        attachments: [
            {
                attachmentId: String,
                filename: String,
                mimeType: String,
            },
        ],
        isUnread: Boolean,
        labels: [String],
        category: String,
        analyzed: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.InboxMail || mongoose.model("InboxMail", InboxMailSchema);

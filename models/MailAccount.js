import mongoose from 'mongoose'

const gmailAccountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    tokenExpiryDate: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isPrimary: {
        type: Boolean,
        default: false
    },
    connectedAt: {
        type: Date,
        default: Date.now
    }
}, {
    _id: true // Each Gmail account gets its own _id
})

export default mongoose.models.GmailAccount || mongoose.model('GmailAccount', gmailAccountSchema)

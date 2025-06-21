import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },

  // === Gmail Integration Fields ===
  gmail: {
    email: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiryDate: { type: Date },
  }

}, {
  timestamps: true
})

export default mongoose.models.User || mongoose.model('User', UserSchema)

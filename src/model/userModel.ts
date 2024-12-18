import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        lastLogin: { type: Date, default: Date.now },
        isVerified: { type: Boolean, default: false },
        resetPasswordToken: String,
        resetPasswordExpiresAt: Date,
        verificationToken: String,
        verificationTokenExpiresAt: Date,
        role: { type: String, default: 'evaluator', enum: ['evaluator', 'admin'], required: true },
        approve: { type: Boolean, default: false },
        allocatedcourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
    },
    { timestamps: true }
)

export const User = mongoose.model('User', userSchema)

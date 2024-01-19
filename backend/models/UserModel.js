const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTR3zZjipG0-Lf-MtJcieX_ASoCDA_6JfGxA&usqp=CAU" },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    lastLogin: { type: Date, default: null },
    joined: { type: Date, default: Date.now() },
    courses: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Course"
    }],
    refreshToken: { type: String },
    activeSessions: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    verificationToken: {
        type: String,
    },
    otp: {
        code: { type: String },
        expiry: { type: Date },
    }
})

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.logoutFromAllDevices = async function () {
    // Clear all active sessions for the user
    this.activeSessions = 0;
    this.refreshToken = null;
    await this.save({ validateBeforeSave: false });
};

const User = mongoose.model("User", UserSchema)

module.exports = { User } 
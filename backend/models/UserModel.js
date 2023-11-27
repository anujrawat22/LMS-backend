const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, default: "https://media.istockphoto.com/id/1364612546/photo/smiley-face-drawn-on-a-car-with-frost.webp?b=1&s=170667a&w=0&k=20&c=KKNrEGZ1XLbFdApRVJ2-nSUK-Kb8lrqFBBOKbhP-ZUI=" },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin','superadmin'], default: 'user' },
    lastLogin: { type: Date, default: null },
    joined: { type: Date, default: Date.now() },
    courses: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Course"
    }],
})

const User = mongoose.model("User", UserSchema)

module.exports = { User } 
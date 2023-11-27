const mongoose = require('mongoose')

const LessonSchema = new mongoose.Schema({
    Title: { type: String },
    text: [{ type: String }],
    images: [{ type: String }],
    videos: [{
        name: { type: String },
        url: { type: String }
    }],
    embedMedia: { type: String },
    pptUrl: { type: String },
    isfree: { type: Boolean, default: false },
    bannerimage: { type: String }
});

const SectionSchema = new mongoose.Schema({
    sectionTitle: { type: String, required: true },
    subsections: [LessonSchema]
});

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    sections: [SectionSchema],
    price: {
        value: { type: String, default: 'INR' },
        amount: { type: Number, required: true },
        symbol: { type: String, required: true, default: '₹' }
    },
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: String, required: true },
    Description: { type: String, required: true }
}, {
    timestamps: true
});

const Course = mongoose.model("Course", CourseSchema)

module.exports = { Course }
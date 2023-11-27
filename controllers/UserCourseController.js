const { Course } = require("../models/CourseModel")
const { User } = require("../models/UserModel")

exports.assignCourse = async (req, res) => {
    const { userId, courseId } = req.params
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).send({ error: `User with userid ${userId} does not exist` })
        }

        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).send({ error: `Course with coursId ${courseId} does not exist` })
        }

        if (user.courses.includes(courseId)) {
            return res.status(400).send({ error: "Course already assigned to the user" })
        }

        user.courses.push(courseId)
        await user.save()
        res.status(200).send({ msg: "Course assigned to the user" })
    } catch (error) {
        console.log("Error assigning course to the user :", error)
        res.status(500).send({ error: "Server error" })
    }
}

exports.unassignCourse = async (req, res) => {
    const { userId, courseId } = req.params;
    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).send({ error: "User doesn't exist" })
        }

        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).send({ error: 'Course not found' })
        }

        if (!user.courses.includes(courseId)) {
            return res.status(400).send({ error: "Course is not assigned to the user" })
        }

        user.courses = user.courses.filter((course) => course.toString() !== courseId);
        await user.save()
        res.status(200).send({ msg: "Course Unassigned" })
    } catch (error) {
        console.log("Error unassigning course for user :", error)
        res.status(500).send({ error: "Server error" })
    }
}
const { Course } = require("../models/CourseModel")
const mongoose = require('mongoose');

exports.allCourses = async (req, res) => {
    let { page, limit, title } = req.query
    try {
        page = parseInt(page) || 1
        limit = parseInt(limit) || 9

        const skip = (page - 1) * limit;
        const filter = {};
        if (title) {
            filter.title = { $regex: new RegExp(title, 'i') };
        }

        const courseData = await Course.find(filter).skip(skip).limit(limit).populate({
            path: 'createBy',
            select: 'name email avatar'
        })

        res.status(200).send({
            msg: "Course Data", data: {
                courses: courseData,
            }
        })
    } catch (error) {
        console.log("Error fetching course data :", error)
        res.status(500).send({ error: "Server error" })
    }
}


exports.allCoursesInfo = async (req, res) => {
    try {
        const courseData = await Course.find().select("_id title")
        res.status(200).send({ data: courseData })
    } catch (error) {
        res.status(500).send({ error: "Server error" })
    }
}


exports.CoursebyId = async (req, res) => {
    const { id } = req.params;
    try {
        const courseData = await Course.findById(id)
        res.status(200).send({ msg: `Course Data with id - ${id}`, data: courseData })
    } catch (error) {
        console.log(`Error getting data of id - ${id} :`, error)
        res.status(500).send({ error: "Server error" })
    }
}


exports.CreateCourse = async (req, res) => {
    const { title, thumbnail, sections, price, Description } = req.body;
    const userId = req.userId
    try {
        const date = new Date()
        const monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        // Extract day, month, and year from the Date object
        const day = date.getUTCDate();
        const month = monthNames[date.getUTCMonth()];
        const year = date.getUTCFullYear();

        // Create the desired format
        const formattedDate = `${day} ${month} ${year}`;
        const courseData = new Course({ title, thumbnail, sections, createBy: userId, price, createdAt: formattedDate, Description })
        await courseData.save()
        res.status(201).send({ msg: "Course created", data: courseData })
    } catch (error) {
        console.log("Error in creating new course :", error)
        res.status(500).send({ error: "Server error" })
    }
}


exports.updateCourse = async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    try {
        const courseData = await Course.findByIdAndUpdate(id, payload)
        res.status(200).send({ msg: "Course data updated", data: courseData })
    } catch (error) {
        console.log(`Error updating course data of id -${id} :`, error)
        res.status(500).send({ error: "Server error" })
    }
}


exports.deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const courseData = await Course.findById(id)
        if (!courseData) {
            return res.status(404).send({ error: "Course Data not found" })
        }
        await Course.findByIdAndDelete(id)
        res.status(200).send({ msg: `Course with id-${id} deleted` })
    } catch (error) {
        console.log(`Error in deleting course with id -${id} :`, error)
        res.status(500).send({ msg: "Server error" })
    }
}


exports.updateLesson = async (req, res) => {
    const { courseId, sectionId } = req.params;
    const { lesson } = req.body;
    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).send({ error: "Course doesn't exist" });
        }

        const section = course.sections.id(sectionId);
        if (!section) {
            return res.status(404).send({ error: "Section doesn't exist in the course" });
        }

        const existingLesson = section.subsections.id(lesson._id);
        if (existingLesson) {
            existingLesson.set(lesson);
            await course.save();
            return res.status(200).send({ msg: 'Lesson updated successfully', data: course });
        } else {
            const newLesson = { ...lesson, _id: new mongoose.Types.ObjectId() };
            section.subsections.push(newLesson);
            await course.save();
            return res.status(200).send({ msg: 'Lesson added successfully', data: course });
        }
    } catch (error) {
        console.error('Error updating lesson:', error);
        return res.status(500).send({ error: 'Server Error' });
    }
}

exports.deleteSection = async (req, res) => {
    const { courseId, sectionId } = req.params;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).send({ error: 'Course not found' });
        }

        const sectionIndex = course.sections.findIndex(
            (section) => section._id.toString() === sectionId
        );

        if (sectionIndex === -1) {
            return res.status(404).send({ error: 'Section not found' });
        }

        course.sections.pull({ _id: sectionId });

        await course.save();
        res.status(200).send({ msg: "Section deleted", data: course })
    } catch (error) {
        console.error('Error deleting section:', error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.deleteLesson = async (req, res) => {
    const { courseId, sectionId, lessonId } = req.params;
    try {
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).send({ error: "Course not found" })
        }
        const sectionIndex = course.sections.findIndex(
            (section) => section._id.toString() === sectionId
        );

        if (sectionIndex === -1) {
            return res.status(404).send({ error: 'Section not found' });
        }

        const lessonIndex = course.sections[sectionIndex].subsections.findIndex(
            (lesson) => lesson._id.toString() === lessonId
        );

        if (lessonIndex === -1) {
            return res.status(404).send({ error: 'Lesson not found' });
        }

        course.sections[sectionIndex].subsections.pull({ _id: lessonId });
        await course.save();

        res.status(200).send({ msg: "Lesson deleted", data: course })
    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.addNewSection = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = Course.findById(courseId)
        if (!course) {
            return res.status(404).send({ error: "Course not found" })
        }
        const newSection = { sectionTitle: 'New Section', subsections: [] };
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { sections: newSection } },
            { new: true }
        );
        res.status(200).send({ msg: "Section added", data: updatedCourse })
    } catch (error) {
        console.error('Error adding new section:', error);
        res.status(500).json({ error: 'Server Error' });
    }
}
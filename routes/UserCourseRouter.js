const { Router } = require("express")
const { assignCourse, unassignCourse } = require("../controllers/UserCourseController")

const UserCourseRouter = Router()

UserCourseRouter.post("/assign/:userId/:courseId", assignCourse)

UserCourseRouter.delete("/unassign/:userId/:courseId", unassignCourse)

module.exports = { UserCourseRouter }
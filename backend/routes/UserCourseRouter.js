const { Router } = require("express")
const { assignCourse, unassignCourse, authAllCourse } = require("../controllers/UserCourseController")
const { Authenticate } = require("../middlewares/Authenticate.middleware")
const { Authorize } = require("../middlewares/Authorization.middleware")

const UserCourseRouter = Router()

UserCourseRouter.get("/allcourse/auth/info", authAllCourse)

UserCourseRouter.use(Authorize(['admin', 'superadmin']))

UserCourseRouter.post("/assign/:userId/:courseId", assignCourse)

UserCourseRouter.delete("/unassign/:userId/:courseId", unassignCourse)




module.exports = { UserCourseRouter }
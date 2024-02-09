const { Router } = require("express")
const { allCourses, updateCourse, deleteCourse, CoursebyId, CreateCourse, updateLesson, addNewSection, deleteLesson, deleteSection, allCoursesInfo } = require("../controllers/CourseController")
const { Authorize } = require("../middlewares/Authorization.middleware")
const { Authenticate } = require("../middlewares/Authenticate.middleware")

CourseRouter = Router()

CourseRouter.get("/all", allCourses)

CourseRouter.get("/allcoursesInfo", allCoursesInfo)

CourseRouter.get("/:id", CoursebyId)

CourseRouter.use(Authenticate)

CourseRouter.post("/create", CreateCourse)


CourseRouter.use(Authorize(['admin', 'superadmin']))


CourseRouter.put("/update/:id", updateCourse)

CourseRouter.put("/addSection/:courseId", addNewSection)

CourseRouter.delete("/delete/:id", deleteCourse)

CourseRouter.delete("/delete/section/:courseId/:sectionId", deleteSection)

CourseRouter.delete("/delete/lesson/:courseId/:sectionId/:lessonId", deleteLesson)

CourseRouter.patch("/update/:courseId/:sectionId", updateLesson)



module.exports = { CourseRouter }
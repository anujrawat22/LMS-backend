const { Router } = require('express')
const { login, signup, forgetPassword, resetPassword, verifyOTP, userDetails, userdetailsbyId, downloadCSV, sendEmail, updaterole, ImportCSV, addStudent, checkUserCourse, deleteUser, logout, checkAuth, refreshAccessToken, UserCourses, verifyUser, SendVerificationEmail, GenerateLoginOTP } = require('../controllers/UserController')
const { Authorize } = require('../middlewares/Authorization.middleware')
const { Authenticate } = require('../middlewares/Authenticate.middleware')
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage });

const UserRouter = Router()

UserRouter.post("/login", login)

UserRouter.post("/signup", signup)

UserRouter.get("/verify/:token", verifyUser)

UserRouter.post("/send/verificationemail", SendVerificationEmail)

UserRouter.post("/generate/loginOTP", GenerateLoginOTP)





UserRouter.post("/refresh/accessToken", refreshAccessToken)

UserRouter.use(Authenticate)

UserRouter.post("/logout", logout)

UserRouter.get("/check/UserCourse/:courseId", checkUserCourse)

UserRouter.get("/courses", UserCourses)

UserRouter.post("/checkAuth", checkAuth)

UserRouter.delete("/delete/:Id", Authorize(['admin', 'superadmin']), deleteUser)

UserRouter.get("/all", userDetails)

UserRouter.get("/detail/:id", userdetailsbyId)

UserRouter.get("/download", downloadCSV)

UserRouter.post("/sendEmail", sendEmail)

UserRouter.patch("/update/role/:id", Authorize(['admin', 'superadmin']), updaterole)

UserRouter.post("/addstudent", Authorize(['admin', 'superadmin']), addStudent)

UserRouter.post("/addstudents/importCsv", Authorize(['admin', 'superadmin']), upload.single('csvFile'), ImportCSV)


module.exports = { UserRouter }
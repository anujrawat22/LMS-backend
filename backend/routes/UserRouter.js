const { Router } = require('express')
const { login, signup, forgetPassword, resetPassword, verifyOTP, userDetails, userdetailsbyId, downloadCSV, sendEmail, updaterole, ImportCSV, addStudent, checkUserCourse, deleteUser, logout, checkAuth, refreshAccessToken } = require('../controllers/UserController')
const { Authorize } = require('../middlewares/Authorization.middleware')
const { Authenticate } = require('../middlewares/Authenticate.middleware')
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage });

const UserRouter = Router()

UserRouter.post("/login", login)

UserRouter.post("/signup", signup)

UserRouter.post("/forget-password", forgetPassword)

UserRouter.post("/verify-otp", verifyOTP)

UserRouter.post("/reset-password", resetPassword)

UserRouter.post("/refresh/accessToken", refreshAccessToken)

UserRouter.use(Authenticate)

UserRouter.post("/logout", logout)

UserRouter.get("/check/UserCourse/:courseId", checkUserCourse)

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
const express = require('express')
const { connection } = require('./config/db')
const { UserRouter } = require('./routes/UserRouter')
const { Authenticate } = require('./middlewares/Authenticate.middleware')
const { CourseRouter } = require('./routes/CourseRouter')
const fs = require('fs');
require('dotenv').config()
const port = +process.env.PORT || 8080
const app = express()
const cors = require('cors')
const { MediaRouter } = require('./routes/mediaRouter')
const { UserCourseRouter } = require('./routes/UserCourseRouter')
const { Authorize } = require('./middlewares/Authorization.middleware')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cors({ origin: 'https://lms-backend-two.vercel.app', credentials: true }));
app.use(cookieParser())

app.use(async (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://lms-backend-two.vercel.app');
    res.header('Access-Control-Allow-Credentials', true);
})

app.use("/api/users", UserRouter)

app.use("/api/courses", CourseRouter)

app.use("/api/media", MediaRouter)

app.use("/api/usercourses", Authenticate, Authorize(['admin', 'superadmin']), UserCourseRouter)



app.listen(port, async () => {
    try {
        await connection;
        console.log("Connected to DB")
        console.log(`Listening on port - ${port}`)
    } catch (error) {
        console.log("Error in connecting to DB :", error)
    }
})
const express = require('express')
const path = require('path');
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
app.use(cors());
app.use(cookieParser())

app.use("/api/users", UserRouter)

app.use("/api/courses", CourseRouter)

app.use("/api/media", MediaRouter)

app.use("/api/usercourses", Authenticate, Authorize(['admin', 'superadmin']), UserCourseRouter)

app.use(express.static(path.join(__dirname, '../frontend/lms/build')));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/lms/build/index.html'));
});


app.listen(port, async () => {
    try {
        await connection;
        console.log("Connected to DB")
        console.log(`Listening on port - ${port}`)
    } catch (error) {
        console.log("Error in connecting to DB :", error)
    }
})
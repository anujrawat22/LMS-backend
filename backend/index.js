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
// const NodeRSA = require('node-rsa');
// const key = new NodeRSA({b: 2048});
app.use(express.json())
app.use(cors({
    origin: "*"
}))
app.use(cookieParser())
// const public_key = key.exportKey('public')
// const private_key = key.exportKey('private')
// fs.writeFileSync('./Keys/public_key.pem',public_key)
// fs.writeFileSync('./Keys/private_key.pem',private_key)
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
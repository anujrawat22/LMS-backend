const express = require('express')
const path = require('path');
const { connection } = require('./config/db')
const { UserRouter } = require('./routes/UserRouter')
const { Authenticate } = require('./middlewares/Authenticate.middleware')
const { CourseRouter } = require('./routes/CourseRouter')
const fs = require('fs');
require('dotenv').config()
const port = +process.env.PORT || 3000
const app = express()
const cors = require('cors')
const { MediaRouter } = require('./routes/mediaRouter')
const { UserCourseRouter } = require('./routes/UserCourseRouter')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(express.json())

const allowedOrigin = [
    'http://139.59.10.56',
    'https://lms-2nw3.onrender.com',
    'http://localhost:3001',
    'https://lms-backend-seven-tau.vercel.app/Z'
]

const corsOptions = {
    origin: allowedOrigin,
    credentials: true,
};

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors(corsOptions));

app.use(cookieParser())

app.use("/api/users", UserRouter)

app.use("/api/courses", CourseRouter)

app.use("/api/media", MediaRouter)

app.use("/api/usercourses", Authenticate, UserCourseRouter)

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
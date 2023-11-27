const { Router } = require("express")
const { uploadFile } = require("../controllers/MediaController")
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage });

const MediaRouter = Router()

MediaRouter.post("/upload", upload.single('file'), uploadFile)


module.exports = { MediaRouter }
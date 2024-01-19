const { Router } = require("express")
const { GetImageUploadURl, getVideoUploadUrl, AuthenticatedPresignedUrl, PresignedUrl, deleteMedia, ThumbnailUrl, uploadVideo, GetAuthVideoUrl, getVideoUrl } = require("../controllers/MediaController")
const multer = require('multer');
const { Authenticate } = require("../middlewares/Authenticate.middleware");
const { Authorize } = require("../middlewares/Authorization.middleware");



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const MediaRouter = Router()

MediaRouter.get("/generate-preSigned-url/:courseId/:sectionId/:lessonId", PresignedUrl)

MediaRouter.get("/thumbnail", ThumbnailUrl)


MediaRouter.post("/generate-video-url/:courseId/:sectionId/:lessonId", getVideoUrl)

MediaRouter.use(Authenticate)

MediaRouter.post("/generate-auth-video-url", GetAuthVideoUrl)

MediaRouter.post("/video/upload", upload.single("file"), uploadVideo)

MediaRouter.use('/generate-presigned-url-auth', AuthenticatedPresignedUrl)


MediaRouter.use(Authorize(['admin', 'superadmin']))


MediaRouter.post('/get-image-upload-url', GetImageUploadURl)

MediaRouter.post('/get-video-upload-url', getVideoUploadUrl)

MediaRouter.delete("/delete", deleteMedia)

module.exports = { MediaRouter }
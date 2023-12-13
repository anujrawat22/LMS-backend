const { Router } = require("express")
const {  GetImageUploadURl, getVideoUploadUrl, AuthenticatedPresignedUrl, PresignedUrl, deleteMedia, ThumbnailUrl } = require("../controllers/MediaController")
const multer = require('multer');
const { Authenticate } = require("../middlewares/Authenticate.middleware");
const { Authorize } = require("../middlewares/Authorization.middleware");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const MediaRouter = Router()


MediaRouter.get("/generate-preSigned-url/:courseId/:sectionId/:lessonId", PresignedUrl)

MediaRouter.get("/thumbnail", ThumbnailUrl)

MediaRouter.use(Authenticate)

MediaRouter.use('/generate-presigned-url-auth', AuthenticatedPresignedUrl)


MediaRouter.use(Authorize(['admin', 'superadmin']))


MediaRouter.post('/get-image-upload-url', GetImageUploadURl)

MediaRouter.post('/get-video-upload-url', getVideoUploadUrl)

MediaRouter.delete("/delete", deleteMedia)

module.exports = { MediaRouter }
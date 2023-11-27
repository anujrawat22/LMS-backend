
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()
const bucketName = process.env.BUCKET_NAME

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const region = process.env.REGION;


// const storage = multer.memoryStorage();
// const upload = multer({ storage });


exports.uploadFile = async (req, res) => {
    console.log(req.file)
    const params = {
        Bucket: bucketName,
        Key: `uploads/${req.file.originalname}`,
        Body: req.file.buffer,
    }
    try {
        s3.upload(params, (err, data) => {
            if (err) {
                console.log("S3 upload error :", err)
                return res.status(500).send({ error: "Error uploading file to S3" })
            }
            res.status(200).send({ msg: "File uploaded successfully", url: `${data.Location}` })
        })
    } catch (error) {
        console.log("Error in uploading file :", error)
        res.status(500).send({ error: "Server error" })
    }
}
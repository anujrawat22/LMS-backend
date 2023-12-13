
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()
const AWS = require('aws-sdk');
const { Course } = require('../models/CourseModel');
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const region = process.env.REGION;

AWS.config.update({
    accessKeyId, secretAccessKey, region, signatureVersion: 'v4'
})
const s3 = new AWS.S3();
const bucketName = process.env.BUCKET_NAME


exports.PresignedUrl = async (req, res) => {
    const { fileName } = req.query;
    const { courseId, sectionId, lessonId } = req.params;
    try {
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const section = course.sections.id(sectionId);
        if (!section) {
            return res.status(404).json({ error: 'Section not found' });
        }

        const lesson = section.subsections.id(lessonId);
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        const isFree = lesson.isfree;

        if (!isFree) {
            return res.status(401).send({ error: "Course Not free" })
        }

        const params = {
            Bucket: bucketName,
            Key: fileName,
            Expires: 60 * 5, // URL expires in 5 minutes
        };

        const fileURL = await s3.getSignedUrl('getObject', params);
        const expirationTime = Math.floor(Date.now() / 1000) + (60 * 5);
        res.status(200).json({ fileURL, Key: fileName, expiresAt: expirationTime });
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.ThumbnailUrl = async (req, res) => {
    const { fileName } = req.query;
    try {
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Expires: 60 * 20, // URL expires in 5 minutes
        };
        const fileURL = await s3.getSignedUrl('getObject', params);
        res.status(200).json({ fileURL, Key: fileName });
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.AuthenticatedPresignedUrl = async (req, res) => {
    const { fileName } = req.query;
    try {
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Expires: 60 * 5, // URL expires in 5 minutes
        };

        const fileURL = await s3.getSignedUrl('getObject', params);
        const expirationTime = Math.floor(Date.now() / 1000) + (60 * 5);
        res.status(200).json({ fileURL, Key: fileName, expiresAt: expirationTime });
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



exports.GetImageUploadURl = async (req, res) => {
    const ex = req.query.fileType

    const Key = `images/${uuidv4()}.${ex}`
    try {

        const params = {
            Bucket: bucketName,
            Key: Key,
            Expires: 60, // URL expires in 60 seconds
            ContentType: `image/${ex}`,
        };

        const uploadURL = await s3.getSignedUrl('putObject', params);

        res.status(200).json({ uploadURL, Key });
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getVideoUploadUrl = async (req, res) => {
    const ex = req.query.fileType

    const Key = `videos/${uuidv4()}.${ex}`
    console.log(Key)
    try {

        const params = {
            Bucket: bucketName,
            Key: Key,
            Expires: 60, // URL expires in 60 seconds
            ContentType: `video/${ex}`,
        };

        const uploadURL = await s3.getSignedUrl('putObject', params);

        res.status(200).json({ uploadURL, Key });
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.deleteMedia = async (req, res) => {
    const { Key, folder } = req.query;
    if (!Key || !folder) {
        return res.status(400).json({ error: 'Both Key and folder parameters are required.' });
    }
    try {
        const params = {
            Bucket: bucketName,
            Key: `${folder}/${Key}`
        }
        await s3.deleteObject(params).promise()
        res.status(200).json({ msg: "Video deleted" })
    } catch (error) {
        console.log("Error deleting the video :", error)
        res.status(500).send({ error: 'Server error' })
    }
}

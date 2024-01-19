import React, {  useEffect } from 'react';
import styles from './CourseDetailMainContent.module.css';
import {  Typography } from '@mui/material';

import { useParams } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import { useState } from 'react';
import { CheckUserCourses } from '../../services/checkUserCourse.service';
import ImageVideoCarasouel from '../ImageVideoCarasouel/ImageVideoCarasouel';
import fallbackImg from '../../assets/backimg.jpg';
import useInterval from '../UseInterval/useInterval';
import config from '../../config.json';
import { AuthenticatePresignedUrl } from '../../services/authenticatedPresignedUrl.service';
import { PresignedUrl } from '../../services/generatePresignedUrl.service';

import VideoComponent from '../VideoComponent/VideoComponent';
const s3BucketUrl = config.recurring.s3BucketUrl;
const CourseDetailMainContent = ({ data, sectionId, courseId }) => {
    const { id } = useParams()
    const { userdata } = useAuth()
    const { token } = userdata;
    const [userHasCourse, setUserHasCourse] = useState(false)
    const [modifiedImages, setModifiedImages] = useState([])
    const [bannerImg, setBannerImg] = useState('')
    const isMobile = window.innerWidth <= 480;
    const checkforUserCourse = async () => {
        try {
            const response = await CheckUserCourses(id, token)
            setUserHasCourse(response.data.hasCourse)
        } catch (error) {
            console.log(error)
        }
    }

    const modifyImages = async () => {
        const updatedImages = await Promise.all(
            data.images.map(async (image) => {
                if (isS3Image(image)) {
                    try {
                        let response;
                        if (data.isfree) {
                            response = await PresignedUrl(image.replace(`${s3BucketUrl}/`, ''), courseId, sectionId, data._id)
                        } else {

                            response = await AuthenticatePresignedUrl(image.replace(`${s3BucketUrl}/`, ''), token);
                        }
                        return response.data.fileURL;
                    } catch (error) {
                        console.error('Error fetching presigned URL:', error);
                        return fallbackImg;
                    }
                } else {
                    return image;
                }
            })
        );
        setModifiedImages(updatedImages.filter((image) => image !== null))
    }





    const modifyBannerImage = async () => {
        if (isS3Image(data.bannerimage)) {
            try {
                let response;
                if (data.isfree) {
                    response = await PresignedUrl(data.bannerimage.replace(`${s3BucketUrl}/`, ''), courseId, sectionId, data._id)
                } else {
                    response = await AuthenticatePresignedUrl(data.bannerimage.replace(`${s3BucketUrl}/`, ''), token);
                }
                setBannerImg(response.data.fileURL)
            } catch (error) {
                console.log(error)
            }
        } else {
            setBannerImg(data.bannerimage)
        }
    }

    const fetchAndUpdateURLs = async () => {
        modifyImages();
        modifyBannerImage();
    };

    useEffect(() => {
        checkforUserCourse()
    })

    useEffect(() => {
        fetchAndUpdateURLs();
    }, [data])

    useInterval(fetchAndUpdateURLs, 5 * 60 * 1000);
    if (data.isfree || userHasCourse) {
        return (
            <>
                {data.Title ? <div className={styles.TitleDiv} style={{
                    backgroundImage: bannerImg ? `url(${bannerImg})` : 'none',
                    color: bannerImg ? 'white' : 'black'
                }}>
                    <h1 className={styles.DataTitle}>{data.Title}</h1>

                    {
                        data.text.length > 0 && data.text.map((text, index) => {
                            return <p key={index} className={styles.text}>{text}</p>
                        })
                    }
                </div>
                    :
                    null}
                {
                    data.pptUrl ?
                        <div className={styles.PPTDiv}>
                            <iframe src={data.pptUrl} frameborder="0" title='pptUrl'
                                className={styles.PPTiframe}
                            ></iframe>
                        </div>
                        : null
                }
                {
                    modifiedImages.length > 0 ?
                        <ImageVideoCarasouel allImages={modifiedImages} free={data.isfree} data={data} sectionId={sectionId} lessonId={data._id} courseId={courseId} /> : null
                }
                {
                    data.videos.length > 0 ?
                        data.videos.map((video) => {
                            return <div className={styles.VideoDiv} key={video._id}>
                                <VideoComponent url={video.url} name={video.name} data={data} sectionId={sectionId} courseId={courseId} />
                            </div>
                        }) : null
                }
                {
                    data.embedMedia &&
                    <div className={styles.gdriveMedia} >
                        <iframe src={data.embedMedia} title='embedmedia' style={{
                            width: '100%',
                            height: '100%'
                        }}></iframe>
                    </div>
                }
            </ >
        )
    }

    return <>
        <div className={styles.EnrollMsgDiv}>
            <Typography variant='h4'>Enroll to Unlock Course</Typography>
        </div>
    </>
}

export default CourseDetailMainContent

function isS3Image(url) {
    const s3Pattern = new RegExp(`^${s3BucketUrl}/.*`);
    return s3Pattern.test(url);
}


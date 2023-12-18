import React, { useEffect } from 'react';
import styles from './CourseDetailMainContent.module.css';
import { Button, Typography } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import { useState } from 'react';
import { CheckUserCourses } from '../../services/checkUserCourse.service';
import ImageVideoCarasouel from '../ImageVideoCarasouel/ImageVideoCarasouel';
import ReactPlayer from 'react-player';
import fallbackImg from '../../assets/backimg.jpg';
import useInterval from '../UseInterval/useInterval';
import config from '../../config.json';
import { AuthenticatePresignedUrl } from '../../services/authenticatedPresignedUrl.service';
import { PresignedUrl } from '../../services/generatePresignedUrl.service';
import { Axios } from 'axios';
import httpservice from '../../services/httpservice';
const s3BucketUrl = config.recurring.s3BucketUrl;
const CourseDetailMainContent = ({ data, sectionId, courseId }) => {
    const { id } = useParams()
    const { userdata } = useAuth()
    const role = userdata.role
    const { token } = userdata;
    const [userHasCourse, setUserHasCourse] = useState(false)
    const [modifiedImages, setModifiedImages] = useState([])
    const [modifiedVideos, setModifiedVideos] = useState([])
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

    const generateBlobUrl = async (videoUrl) => {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    };

    const modifyVideos = async () => {
        const UpdateVideos = await Promise.all(
            data.videos.map(async (video) => {
                if (isS3Video(video.url)) {
                    try {
                        const response = await httpservice.get(video.url)
                        console.log(response)
                        return { url: await generateBlobUrl(response.data.fileURL), name: video.name };
                    } catch (error) {
                        console.error('Error fetching presigned URL:', error);
                        return { url: null, name: null };
                    }
                } else {
                    return video;
                }
            })
        );
        const videos = UpdateVideos.filter(video => video.url !== null)
        setModifiedVideos(videos)
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
        modifyVideos();
        modifyBannerImage();
    };

    useEffect(() => {
        checkforUserCourse()
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
                    modifiedVideos.length > 0 ?
                        modifiedVideos.map((video) => {
                            return <div className={styles.VideoDiv}>
                                <ReactPlayer width={isMobile ? '100%' : '60%'}

                                    height={isMobile ? '230px' : '400px'} className={styles.ReactPlayer}
                                    config={{ file: { attributes: { controlsList: 'nodownload noembed' } } }}

                                    // Disable right click
                                    onContextMenu={e => e.preventDefault()} url={video.url} controls={true} />
                                <Typography variant='h6'>
                                    {video.name}
                                </Typography>
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

function isS3Video(url) {
    const s3Pattern = new RegExp(`^${s3BucketUrl}/.*`);
    return s3Pattern.test(url);
}
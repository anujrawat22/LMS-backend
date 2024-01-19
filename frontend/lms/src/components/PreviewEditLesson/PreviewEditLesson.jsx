import React, { useState } from 'react';
import styles from './PreviewEditLesson.module.css';
import { Button, IconButton, Tooltip, Typography, TextField } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactPlayer from 'react-player';
import ImageVideoCarasouel from '../ImageVideoCarasouel/ImageVideoCarasouel';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useInterval from '../UseInterval/useInterval';
import config from '../../config.json';
import { AuthenticatePresignedUrl } from '../../services/authenticatedPresignedUrl.service';
import { useAuth } from '../../Contexts/AuthContext';
import fallbackImg from '../../assets/backimg.jpg'
import VideoComponent from '../VideoComponent/VideoComponent';
const s3BucketUrl = config.recurring.s3BucketUrl;
const PreviewEditLesson = ({ LessonData, onClose, setLessonData, sectionId, courseId }) => {
    const { userdata } = useAuth()
    const token = userdata.token;
    const [isEditing, setIsEditing] = useState(false)
    const [modifiedImages, setModifiedImages] = useState([])
    const [modifiedVideos, setModifiedVideos] = useState([])
    const [bannerImg, setBannerImg] = useState('')
    const handlePreviewClick = (e) => {
        e.stopPropagation();
    }

    const handleDeleteTitle = () => {
        setLessonData({ ...LessonData, Title: '' })
        toast.success("Title Deleted")
    }

    const handleDeletetext = () => {
        setLessonData({ ...LessonData, text: [] })
        toast.success("Text Deleted")
    }

    const handleDeleteVideo = (url) => {
        setLessonData({ ...LessonData, videos: LessonData.videos.filter((video) => video.url !== url) })
        toast.success("Video Deleted")
    }

    const handleDeleteppt = () => {
        setLessonData({ ...LessonData, pptUrl: '' })
        toast.success('PPT deleted')
    }

    const handleDeletevideo = () => {
        setLessonData({ ...LessonData, embedMedia: '' })
        toast.success("Video deleted")
    }

    const modifyImages = async () => {
        const updatedImages = await Promise.all(
            LessonData.images.map(async (image) => {
                if (isS3Image(image)) {
                    try {
                        const response = await AuthenticatePresignedUrl(image.replace(`${s3BucketUrl}/`, ''), token);
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
        console.log(updatedImages)
        setModifiedImages(updatedImages.filter((image) => image !== null))
    }

    const modifyVideos = async () => {
        const UpdateVideos = await Promise.all(
            LessonData.videos.map(async (video) => {
                if (isS3Video(video.url)) {
                    try {
                        const response = await AuthenticatePresignedUrl(video.url.replace(`${s3BucketUrl}/`, ''), token);
                        return { url: response.data.fileURL, name: video.name };
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
        if (isS3Image(LessonData.bannerimage)) {
            try {
                const response = await AuthenticatePresignedUrl(LessonData.bannerimage.replace(`${s3BucketUrl}/`, ''), token);
                setBannerImg(response.data.fileURL)
            } catch (error) {
                console.log(error)
            }
        } else {
            setBannerImg(LessonData.bannerimage)
        }
    }

    const fetchAndUpdateURLs = async () => {
        modifyImages();
        modifyVideos();
        modifyBannerImage();
    };

    useEffect(() => {
        fetchAndUpdateURLs();
    }, []);

    useInterval(fetchAndUpdateURLs, 5 * 60 * 1000);
    return (
        <div className={styles.PreviewContainer} onClick={onClose}>
            <div className={styles.LessonPreviewCont} onClick={handlePreviewClick}>
                <div className={styles.btnDiv}>
                    <Tooltip title="Go back">
                        <IconButton onClick={() => onClose()}>
                            <ArrowBackIosIcon />
                        </IconButton>
                    </Tooltip>
                    {isEditing ? <Button variant='outlined' onClick={() => setIsEditing(false)}>Save</Button> : <Button variant='outlined' onClick={() => setIsEditing(true)}>Edit</Button>}
                </div>
                <div className={styles.ContentPreview}>
                    <div style={{
                        backgroundImage: LessonData.bannerimage ? `url(${bannerImg})` : null,
                        color: bannerImg ? 'white' : 'black'
                    }} className={styles.TitleContainer}>
                        {LessonData.Title &&
                            <div className={styles.TitleDiv}>
                                <Typography textAlign={'center'} variant='h5' sx={{
                                    marginRight: '30px'
                                }}>{LessonData.Title}</Typography>
                                {isEditing &&
                                    <Tooltip title='Delete'>
                                        <IconButton onClick={handleDeleteTitle}>
                                            <DeleteIcon sx={{
                                                color: 'rgb(77,135,51)'
                                            }} />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </div>
                        }
                        {
                            LessonData.text.length > 0 &&
                            <div className={styles.textDiv}>
                                <div className={styles.TextmainDiv}>
                                    {
                                        LessonData.text.map((text) => {
                                            return <p className={styles.Para}>{text}</p>
                                        })
                                    }
                                </div>

                                {isEditing &&
                                    <Tooltip title='Delete'>
                                        <IconButton onClick={handleDeletetext}>
                                            <DeleteIcon sx={{
                                                color: 'rgb(77,135,51)'
                                            }} />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </div>
                        }
                    </div>
                    {
                        modifiedImages.length > 0 && <div className={styles.ImageDivContainer}>
                            {
                                isEditing ? <div className={styles.ImageDiv}>
                                </div> : <div className={styles.ImageCarousalDiv}>
                                    <ImageVideoCarasouel allImages={[...modifiedImages]} />
                                </div>
                            }
                        </div>
                    }
                    {
                        modifiedVideos.length > 0 &&
                        <div className={styles.VideoDiv}>
                            {
                                modifiedVideos.map((video) => {
                                    return <div className={styles.PlayerDiv}>
                                        <VideoComponent url={video.url} name={video.name} sectionId={sectionId} courseId={courseId} data={LessonData} />

                                        {isEditing &&
                                            <Tooltip title='Delete video'>
                                                <IconButton onClick={() => handleDeleteVideo(video.url)}>
                                                    <DeleteIcon sx={{
                                                        color: "rgb(77, 135, 51)"
                                                    }} />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    </div>
                                })
                            }
                        </div>
                    }
                    {
                        LessonData.pptUrl &&
                        <div className={styles.pptUrlDiv}>
                            <iframe src={LessonData.pptUrl} frameborder="0" className={styles.iframeppt} title='ppt'></iframe>
                            {isEditing &&
                                <Tooltip title='Delete PPT'>
                                    <IconButton onClick={handleDeleteppt}>
                                        <DeleteIcon sx={{
                                            color: "rgb(77, 135, 51)"
                                        }} />
                                    </IconButton>
                                </Tooltip>
                            }
                        </div>
                    }
                    {
                        LessonData.embedMedia &&
                        <div className={styles.driveVideoDiv}>
                            <iframe src={LessonData.embedMedia} frameborder="0" className={styles.embedMedia} title='embedMedia'></iframe>
                            {isEditing &&
                                <Tooltip title='Delete Video'>
                                    <IconButton onClick={handleDeletevideo}>
                                        <DeleteIcon sx={{
                                            color: "rgb(77, 135, 51)"
                                        }} />
                                    </IconButton>
                                </Tooltip>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default PreviewEditLesson;

function isS3Image(url) {
    const s3Pattern = new RegExp(`^${s3BucketUrl}/.*`);
    return s3Pattern.test(url);
}

function isS3Video(url) {
    const s3Pattern = new RegExp(`^${s3BucketUrl}/.*`);
    return s3Pattern.test(url);
}
import React, { useState } from 'react';
import styles from './PreviewEditLesson.module.css';
import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageVideoCarasouel from '../ImageVideoCarasouel/ImageVideoCarasouel';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import useInterval from '../UseInterval/useInterval';
import config from '../../config.json';
import { AuthenticatePresignedUrl } from '../../services/authenticatedPresignedUrl.service';
import { useAuth } from '../../Contexts/AuthContext';
import fallbackImg from '../../assets/backimg.jpg'
import VideoComponent from '../VideoComponent/VideoComponent';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';



const s3BucketUrl = config.recurring.s3BucketUrl;
const PreviewEditLesson = ({ LessonData, onClose, setLessonData, sectionId, courseId, setHasChanges, editorState }) => {
    const { userdata } = useAuth()
    const token = userdata.token;
    const [isEditing, setIsEditing] = useState(false)
    const [modifiedImages, setModifiedImages] = useState([])
    const [bannerImg, setBannerImg] = useState('')
    const htmlContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const handlePreviewClick = (e) => {
        e.stopPropagation();
    }

    const handleDeleteTitle = () => {
        setLessonData({ ...LessonData, Title: '' })
        toast.success("Title Deleted")
        setHasChanges(true)
    }


    const DeleteVCvideo = async (video) => {
        try {
            const url = `${config.recurring.domainUrl}/${config.recurring.delete.deleteVCvideo}`
            const body = { videos: [video] }
            const res = await fetch(url, {
                method: "DELETE",
                body: JSON.stringify(body),
                credentials: 'include',
                headers: {
                    'Content-type': "Application/json"
                }
            })
            const response = await res.json()
            if (res.status === 200) {
                return true
            }
            return false
        } catch (error) {
            return false
        }
    }

    const handleDeleteVideo = async (video) => {
        const { url, name } = video;
        const loading = toast.loading("Deleting video")
        let isVideoDeleted;
        if (name === 'videoCipherVideoId') {
            isVideoDeleted = await DeleteVCvideo(url)
        }

        if (!isVideoDeleted) {
            return;
        }
        setLessonData({ ...LessonData, videos: LessonData.videos.filter((video) => video.url !== url) })
        toast.dismiss(loading)
        toast.success("Video Deleted")
        setHasChanges(true)
    }

    const handleDeleteppt = () => {
        setLessonData({ ...LessonData, pptUrl: '' })
        toast.success('PPT deleted')
        setHasChanges(true)
    }

    const handleDeletegdrivevideo = () => {
        setLessonData({ ...LessonData, embedMedia: '' })
        toast.success("Video deleted")
        setHasChanges(true)
    }

    const modifyImages = async () => {
        const updatedImages = await Promise.all(
            LessonData.images.map(async (image) => {
                if (isS3Image(image)) {
                    try {
                        const response = await AuthenticatePresignedUrl(image.replace(`${s3BucketUrl}/`, ''), token);
                        return response.data.fileURL;
                    } catch (error) {
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
        if (isS3Image(LessonData.bannerimage)) {
            try {
                const response = await AuthenticatePresignedUrl(LessonData.bannerimage.replace(`${s3BucketUrl}/`, ''), token);
                setBannerImg(response.data.fileURL)
            } catch (error) {
            }
        } else {
            setBannerImg(LessonData.bannerimage)
        }
    }

    const handleDeleteImages = (i) => {
        const updatedImages = [...modifiedImages];
        updatedImages.splice(i, 1);
        setModifiedImages(updatedImages);

        const updatedLessonImages = [...LessonData.images];
        updatedLessonImages.splice(i, 1);
        setLessonData({ ...LessonData, images: updatedLessonImages });

        setHasChanges(true);
        toast.success("Image deleted");
    };

    const fetchAndUpdateURLs = async () => {
        modifyImages();
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
                        color: bannerImg ? 'white' : 'black',
                        backgroundRepeat: "no-repeat",
                        backgroundSize : 'cover',
                        backgroundPosition : 'center'
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
                            htmlContent &&
                            <div className={styles.textDiv}>
                                <div className={styles.TextmainDiv} dangerouslySetInnerHTML={{ __html: htmlContent }}>
                                </div>
                            </div>
                        }
                    </div>
                    {
                        modifiedImages.length > 0 && <div className={styles.ImageDivContainer}>
                            {
                                isEditing ? <div className={styles.EditImageDivMain}>{
                                    modifiedImages.map((img, index) => {
                                        return <div className={styles.editImgDivs}>
                                            <img src={img} alt="editimg" />
                                            <Tooltip
                                                title='Delete'
                                            >
                                                <DeleteIcon sx={{
                                                    cursor: 'pointer'
                                                }} onClick={() => handleDeleteImages(index)} />
                                            </Tooltip>
                                        </div>
                                    })}
                                </div> : <div className={styles.ImageCarousalDiv}>
                                    <ImageVideoCarasouel allImages={[...modifiedImages]} />
                                </div>
                            }
                        </div>
                    }
                    {
                        LessonData.videos.length > 0 &&
                        <div className={styles.VideoDiv}>
                            {
                                LessonData.videos.map((video) => {
                                    return <div className={styles.PlayerDiv}>
                                        <VideoComponent url={video.url} name={video.name} sectionId={sectionId} courseId={courseId} data={LessonData} />

                                        {isEditing &&
                                            <Tooltip title='Delete video'>
                                                <IconButton onClick={() => handleDeleteVideo(video)}>
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
                                    <IconButton onClick={handleDeletegdrivevideo}>
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
import React, { useEffect, useState } from 'react';
import styles from './LessonPreview.module.css';
import { Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';
import ReactPlayer from 'react-player';
import ImageVideoCarasouel from '../ImageVideoCarasouel/ImageVideoCarasouel';
import config from '../../config.json';
import { AuthenticatePresignedUrl } from '../../services/authenticatedPresignedUrl.service';
import { useAuth } from '../../Contexts/AuthContext';
import fallbackImg from '../../assets/backimg.jpg'
import { DeleteMedia } from '../../services/deleteMedia.service';
import useInterval from '../UseInterval/useInterval';
const s3BucketUrl = config.recurring.s3BucketUrl;
const LessonPreview = ({ LessonContent, setLessonContent, setPreviewOpen }) => {
    const { userdata } = useAuth()
    const token = userdata.token;
    const [isEditing, setEditing] = useState(false)
    const [modifiedImages, setModifiedImages] = useState([])
    const [modifiedVideos, setModifiedVideos] = useState([])
    const [bannerImg, setBannerImg] = useState('')
    const handlePreviewClick = (e) => {
        e.stopPropagation();
    }

    const handleEditLessonTitle = () => {
        setLessonContent({ ...LessonContent, Title: '' })
        toast.success('Title Deleted')
    }

    const handleTextDelete = (i) => {
        const newText = LessonContent.text.filter((item, index) => { return index !== i }
        )
        setLessonContent({ ...LessonContent, text: newText })
        toast.success("Text deleted")
    }

    const handleDeletePPt = () => {
        setLessonContent({ ...LessonContent, pptUrl: '' })
        toast.success("PPT Deleted")
    }

    const handleDeleteimage = (i) => {
        const newImages = LessonContent.images.filter((el, index) => {
            return index !== i
        })
        setLessonContent({ ...LessonContent, images: newImages })
        toast.success("Image deleted")
    }

    const handleDeleteVideo = async (url) => {
        const urlParts = url.split('/');
        const fileName = urlParts[urlParts.length - 1].split("?")[0];
        console.log(fileName)
        try {
            const response = await DeleteMedia(fileName, 'video', token)
            setLessonContent({ ...LessonContent, videos: LessonContent.videos.filter((video) => video.url !== url) })
            setModifiedVideos(modifiedVideos.filter((video) => video.url !== url))
            toast.success("Video removed")
        } catch (error) {
            toast.error("Error deleting video")
        }
    }

    const modifyImages = async () => {
        const updatedImages = await Promise.all(
            LessonContent.images.map(async (image) => {
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
        setModifiedImages(updatedImages.filter((image) => image !== null))
    }

    const modifyVideos = async () => {
        const UpdateVideos = await Promise.all(
            LessonContent.videos.map(async (video) => {
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
        if (isS3Image(LessonContent.bannerimage)) {
            try {
                const response = await AuthenticatePresignedUrl(LessonContent.bannerimage.replace(`${s3BucketUrl}/`, ''), token);
                setBannerImg(response.data.fileURL)
            } catch (error) {
                console.log(error)
            }
        } else {
            setBannerImg(LessonContent.bannerimage)
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
        <div className={styles.PreviewBackground} onClick={() => setPreviewOpen(false)}>
            <div className={styles.previewDiv} onClick={handlePreviewClick}>
                <div className={styles.EditbtnDiv}>
                    {
                        isEditing ? <button className={styles.btn} onClick={() => setEditing(!isEditing)}>Save</button> :
                            <button className={styles.btn} onClick={() => setEditing(!isEditing)}>Edit</button>
                    }
                </div>
                <Typography variant='h4'>Preview</Typography>
                <div className={styles.Titlediv} style={{ backgroundImage: `url(${bannerImg})`, color: bannerImg ? `rgb(250,250,250)` : 'rgb(100,100,100)' }}>
                    {
                        LessonContent.Title &&
                        <div className={styles.TitleHeadingDiv}>
                            <Typography variant='h4' sx={{
                                textAlign: 'center',
                                margin: '10px'
                            }}>{LessonContent.Title}</Typography>
                            {isEditing ?
                                <span className={styles.deleteIcon}
                                    onClick={handleEditLessonTitle}><DeleteIcon /></span>
                                : null}
                        </div>
                    }
                    {
                        LessonContent.text.length > 0 &&
                        <div className={styles.paradiv} style={{
                            color: bannerImg ? `rgb(250,250,250)` : 'rgb(100,100,100)'
                        }}>
                            {
                                LessonContent.text && LessonContent.text.map((text, index) => {
                                    return (<div className={styles.textDiv}>
                                        <Typography className={styles.paragraph} variant='h6' >{text}</Typography>
                                        {isEditing ?
                                            <span className={styles.deleteIcon}
                                                onClick={() => handleTextDelete(index)}><DeleteIcon /></span>
                                            : null}
                                    </div>)
                                })
                            }
                        </div>
                    }
                    <div className={styles.videoDiv}>

                    </div>
                </div>
                <div className={styles.OtherContentDiv}>
                    {
                        LessonContent.pptUrl &&
                        <div className={styles.PPTDiv}>
                            <iframe src={LessonContent.pptUrl} frameborder="0" className={styles.PPTiframe} title='ppt'></iframe>
                            {isEditing ?
                                <span className={styles.deleteIcon}
                                    onClick={handleDeletePPt}><DeleteIcon /></span>
                                : null}
                        </div>
                    }
                    {
                        modifiedImages.length > 0 &&
                        <div className={styles.ImagesDiv}>
                            {
                                isEditing ?
                                    <>
                                        <Typography variant='h5' textAlign={'center'}
                                            marginBottom={'10px'}>Images</Typography>
                                        <div className={styles.ImageGrid}>
                                            {
                                                modifiedImages.map((image, index) => {
                                                    return <div className={styles.ImageGridItem}>
                                                        <img src={image} alt="uploadedimg" className={styles.images} />
                                                        <span className={styles.imgdeleteIcon}
                                                            onClick={() => handleDeleteimage(index)}><DeleteIcon /></span>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </>
                                    :
                                    <ImageVideoCarasouel allImages={[...modifiedImages]} />
                            }
                        </div>
                    }
                    {
                        modifiedVideos.length > 0 &&
                        <div className={styles.VideoDiv}>
                            {
                                modifiedVideos.map((video) => {
                                    return <div className={styles.reactplayerDiv}>
                                        <ReactPlayer config={{ file: { attributes: { controlsList: 'nodownload' } } }}

                                            // Disable right click
                                            onContextMenu={e => e.preventDefault()} className={styles.reactPlayer} url={video.url} controls={true}
                                        ></ReactPlayer>
                                        <Typography variant='h6'>{video.name}</Typography>
                                        {isEditing ?
                                            <span className={styles.deleteIcon}
                                                onClick={() => handleDeleteVideo(video.url)}><DeleteIcon /></span>
                                            : null}
                                    </div>
                                })
                            }
                        </div>
                    }
                    {
                        LessonContent.embedMedia &&
                        <div className={styles.gdriveDiv} >
                            <iframe src={LessonContent.embedMedia} frameborder="0" title='gdrivevideo' className={styles.driveVideo}></iframe>
                        </div>
                    }
                </div>
            </div>
        </div >
    )
}

export default LessonPreview

function isS3Image(url) {
    const s3Pattern = new RegExp(`^${s3BucketUrl}/.*`);
    return s3Pattern.test(url);
}

function isS3Video(url) {
    const s3Pattern = new RegExp(`^${s3BucketUrl}/.*`);
    return s3Pattern.test(url);
}
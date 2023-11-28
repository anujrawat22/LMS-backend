import React, { useState } from 'react';
import styles from './LessonPreview.module.css';
import { Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';
import ReactPlayer from 'react-player';
import ImageVideoCarasouel from '../ImageVideoCarasouel/ImageVideoCarasouel';
const LessonPreview = ({ LessonContent, setLessonContent, setPreviewOpen }) => {
    const [isEditing, setEditing] = useState(false)
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

    const handleDeleteVideo = (url) => {
        setLessonContent({ ...LessonContent, videos: LessonContent.videos.filter((video) => video.url !== url) })
        toast.success("Video removed")
    }

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
                <div className={styles.Titlediv} style={{ backgroundImage: `url(${LessonContent.bannerimage})`, color: LessonContent.bannerimage ? `rgb(250,250,250)` : 'rgb(100,100,100)' }}>
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
                            color: LessonContent.bannerimage ? `rgb(250,250,250)` : 'rgb(100,100,100)'
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
                        LessonContent.images.length > 0 &&
                        <div className={styles.ImagesDiv}>
                            {
                                isEditing ?
                                    <>
                                        <Typography variant='h5' textAlign={'center'}
                                            marginBottom={'10px'}>Images</Typography>
                                        <div className={styles.ImageGrid}>
                                            {
                                                LessonContent.images.map((image, index) => {
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
                                    <ImageVideoCarasouel allImages={LessonContent.images} />
                            }
                        </div>
                    }
                    {
                        LessonContent.videos.length > 0 &&
                        <div className={styles.VideoDiv}>
                            {
                                LessonContent.videos.map((video) => {
                                    return <div className={styles.reactplayerDiv}>
                                        <ReactPlayer className={styles.reactPlayer} url={video.url}></ReactPlayer>
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
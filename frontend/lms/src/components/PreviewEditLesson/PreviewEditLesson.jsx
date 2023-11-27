import React, { useState } from 'react';
import styles from './PreviewEditLesson.module.css';
import { Button, IconButton, Tooltip, Typography, TextField } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactPlayer from 'react-player';
import ImageVideoCarasouel from '../ImageVideoCarasouel/ImageVideoCarasouel';
import toast, { Toaster } from 'react-hot-toast';
const PreviewEditLesson = ({ LessonData, onClose, setLessonData }) => {

    const [isEditing, setIsEditing] = useState(false)
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
                        backgroundImage: LessonData.bannerimage ? `url(${LessonData.bannerimage})` : null,
                        color: LessonData.bannerimage ? 'white' : 'black'
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
                                                color: 'white'
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
                                                color: 'white'
                                            }} />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </div>
                        }
                    </div>
                    {
                        LessonData.images.length > 0 && <div className={styles.ImageDivContainer}>
                            {
                                isEditing ? <div className={styles.ImageDiv}>

                                </div> : <div className={styles.ImageCarousalDiv}>
                                    <ImageVideoCarasouel images={LessonData.images} />
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
                                        <ReactPlayer url={video.url}></ReactPlayer>
                                        <Typography>{video.name}</Typography>
                                        {isEditing &&
                                            <Tooltip title='Delete video'>
                                                <IconButton onClick={() => handleDeleteVideo(video.url)}>
                                                    <DeleteIcon />
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
                            <iframe src={LessonData.pptUrl} frameborder="0" className={styles.iframeppt}></iframe>
                            {isEditing &&
                                <Tooltip title='Delete PPT'>
                                    <IconButton onClick={handleDeleteppt}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                        </div>
                    }
                    {
                        LessonData.embedMedia &&
                        <div className={styles.driveVideoDiv}>
                            <iframe src={LessonData.embedMedia} frameborder="0" className={styles.embedMedia}></iframe>
                            {isEditing &&
                                <Tooltip title='Delete Video'>
                                    <IconButton onClick={handleDeletevideo}>
                                        <DeleteIcon />
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

export default PreviewEditLesson
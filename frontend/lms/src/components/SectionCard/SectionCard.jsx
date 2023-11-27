import React, { useState } from 'react'
import styles from './SectionCard.module.css';
import ReactPlayer from 'react-player'
import { Button, FormControlLabel, FormGroup, Switch, Typography } from '@mui/material';
import ImageCarousel from '../ImageCarousel';
import toast from 'react-hot-toast';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
const SectionCard = ({ Content, Title ,   setSections, removeSection }) => {
    console.log(Content)
    const [video, setVideo] = useState('');

    const handleCourseAccess = () => {
        
    }


    const videoDiv = () => {
        return (
            Content.video.length > 0 &&
            <div className={styles.VideoSection}>
                <h2 style={{ padding: "0px", marginTop: "5px" }}>Videos</h2>
                {Content.video.map((video, index) => {
                    return (
                        <div className={styles.VideoDiv} key={index}>
                            <p>{index + 1}-</p>
                            <p className={styles.Videoname}>{video.name}</p>
                            <Button variant='outlined' onClick={() => setVideo(video.url)}>Play</Button>
                            <Button variant='contained'
                                sx={{
                                    marginLeft: '10px'
                                }}
                                onClick={() => {
                                    setVideo('')
                                    toast.success("Video Removed")
                                }}>
                                Remove
                            </Button>
                        </div>
                    )
                })}
            </div>
        )
    }
    return (
        <>
            <div
                className={styles.addSection}>
                <div className={styles.TextDiv} style={{ backgroundImage: Content.bannerimage ? `url(${Content.bannerimage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className={styles.headingDiv} >

                        <h1 style={{ color: Content.bannerimage ? "rgb(211, 211, 211)" : "rgb(112, 128, 144)" }}>{Title}</h1>
                        <FormGroup>
                            <FormControlLabel control={<Switch checked={Content.isfree} onChange={handleCourseAccess} />} label="Free" />
                        </FormGroup>
                    </div>
                    <div>
                        {
                            Content.text.length > 0 && Content.text.map((text) => {
                                return (
                                    <Typography key={text} sx={{ textAlign: 'left', width: '100%', color: Content.bannerimage ? "rgb(211, 211, 211)" : "rgb(112, 128, 144)", boxSizing: 'border-box', height: 'auto', overflowWrap: 'break-word' }}
                                    >{text}</Typography>
                                )
                            })
                        }
                    </div>
                </div>
                {
                    Content.images.length > 0 && (
                        <ImageCarousel images={Content.images} />
                    )
                }
                {videoDiv()}
                {video &&
                    <div className={styles.playerDiv}>
                        <div className={styles.CloseButton}><CloseIcon onClick={() => setVideo('')} /></div>
                        <ReactPlayer
                            style={{
                                borderRadius: '5px',
                                backgroundColor: 'black',
                                overflow: 'hidden',
                                width: "100%",
                                height: "100%"
                            }}
                            url={video}
                            playing={true}
                            controls={true}>
                        </ReactPlayer>
                    </div>
                }
                {
                    Content.embed && (
                        <iframe
                            src={Content.embed}
                            title="Embedded Video"
                            style={{ borderRadius: '5px', overflow: 'hidden', width: "100%", height: "100%" }}
                            allowFullScreen
                        ></iframe>
                    )
                }
                {
                    Content.pptUrl && (
                        <div className={styles.pptDiv}>

                            <iframe src={Content.pptUrl} frameborder="0" title={Content.pptUrl} className={styles.pptFrame}
                                allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
                        </div>
                    )
                }
            </div >
            <div className={styles.removeSection}><DeleteIcon className={styles.DeleteIcon} onClick={() => removeSection()} /></div>
        </>
    )
}

export default SectionCard
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
const CourseDetailMainContent = ({ data }) => {

    const { id } = useParams()
    const { userdata } = useAuth()
    const role = userdata.role
    const { token } = userdata;
    const [userHasCourse, setUserHasCourse] = useState(false)
    const isMobile = window.innerWidth <= 480;
    const checkforUserCourse = async () => {
        try {
            const response = await CheckUserCourses(id, token)
            setUserHasCourse(response.data.hasCourse)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        checkforUserCourse()
    }, [])
    if (data.isfree || userHasCourse) {
        return (
            <>
                {data.Title ? <div className={styles.TitleDiv} style={{
                    backgroundImage: data.bannerimage ? `url(${data.bannerimage})` : 'none',
                    color: data.bannerimage ? 'white' : 'black'
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
                    data.images.length > 0 ?
                        <ImageVideoCarasouel allImages={data.images} /> : null
                }
                {
                    data.videos.length > 0 ?
                        data.videos.map((video) => {
                            return <div className={styles.VideoDiv}>
                                <ReactPlayer width={isMobile ? '100%' : '60%'} 
                                    height={isMobile ? '230px' : '400px'} url={video.url} className={styles.ReactPlayer} />
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
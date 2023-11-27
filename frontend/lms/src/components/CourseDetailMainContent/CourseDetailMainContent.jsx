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
    if (data.isfree || userHasCourse || role === 'admin' || role === 'superadmin') {
        return (
            <>
                {data.Title ? <div className={styles.TitleDiv} style={{
                    backgroundImage: data.bannerimage ? `url(${data.bannerimage})` : 'none',
                    color: data.bannerimage ? 'white' : 'black'
                }}>

                    <Typography sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <h1>{data.Title}</h1>
                    </Typography>
                    {
                        data.text.length > 0 && data.text.map((text, index) => {
                            return <Typography key={index} sx={{
                                borderRadius: "20px",
                                marginBottom: "20px",
                                padding: "36px",
                                backgroundSize: "cover",
                                fontFamily: "roboto",
                                backgroundPosition: "center"
                            }}>{text}</Typography>
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
                                <ReactPlayer url={video.url} />
                                <Typography variant='h6'>
                                    {video.name}
                                </Typography>
                            </div>
                        }) : null
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
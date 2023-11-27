import * as React from 'react';
import CourseCard from './Card';
import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { getCourseData } from '../../services/courseData.service';
import { useAuth } from '../../Contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Courses() {

    const { userdata } = useAuth()
    const { token } = userdata;
    const [courseData, setCourseData] = useState([])
    const navigate = useNavigate()
    
    const fetchData = async () => {

        try {
            const response = await getCourseData(token)
            setCourseData(response.data.data.courses)
        } catch (error) {
            console.log(error)
        }
    }

    const handlecardClick = (id) => {
        navigate(`/chapters/${id}`)
    }

    useEffect(() => {
        fetchData()
    }, [])
    return (
        <>
            {
                <Grid container spacing={1}>
                    {
                        courseData.length > 0 ? courseData.map((data) => {
                            return <Grid item md={4} sm={12} xs={12} lg={4} key={data._id} onClick={() => handlecardClick(data._id)}>
                                <CourseCard data={data} />
                            </Grid>
                        }) :
                            <div style={{
                                width: '100dvw',
                                height: '100dvh',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <h1>Loading....</h1>
                            </div>
                    }
                </Grid>
            }
        </>
    );
} 
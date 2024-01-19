import * as React from 'react';
import CourseCard from './Card';
import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { getCourseData } from '../../services/courseData.service';
import { useAuth } from '../../Contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import styles from './Cards.module.css'
import { authAllcourses } from '../../services/authAllcoursee.service';
import ReplayIcon from '@mui/icons-material/Replay';
export default function Courses() {

    const { userdata } = useAuth()
    const [courseData, setCourseData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [title, setTitle] = useState('')
    const navigate = useNavigate()

    const fetchData = async (page = 1, title = '') => {
        try {
            let response = await getCourseData(page, title)
            setCourseData(response.data.data.courses)
            setCurrentPage(response.data.data.current_page);
            setTotalPages(response.data.data.total_pages);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUserCourseData = async (page = 1, title = '') => {
        try {
            const response = await authAllcourses(page, title)
            if (response.data) {
                setCourseData(response.data.courses)
                setCurrentPage(response.data.current_page)
                setTotalPages(response.data.total_pages)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handlecardClick = (id) => {
        navigate(`/chapters/${id}`)
    }

    const handlePageChange = (event, newPage) => {
        fetchData(newPage);
    };

    const handleSearchcourse = async () => {
        if (title === '') return;
        if (userdata.isAuthenticated) {
            await fetchUserCourseData(1, title)
        } else {
            fetchData(1, title);
        }
    }

    const handleResetCoursesData = async () => {
        setTitle('')
        if (userdata.isAuthenticated) {
            await fetchUserCourseData(1, '')
        } else {
            await fetchData(1, '')
        }
    }

    useEffect(() => {
        const fetchDataAndUserCourses = async () => {
            try {
                if (userdata.isAuthenticated) {
                    await fetchUserCourseData()
                } else {
                    await fetchData();
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchDataAndUserCourses();
    }, []);


    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className={styles.filters}>
                <TextField id="input-with-sx" label="Find a product" variant="standard" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Button onClick={handleSearchcourse}><SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} /></Button>
                <Button variant='outlined' startIcon={<ReplayIcon />} sx={{
                    borderColor: 'rgb(180, 211, 59)',
                    color: 'rgb(180, 211, 59)',
                    ':hover': {
                        borderColor: 'rgb(180, 211, 59)'
                    }
                }}
                    onClick={handleResetCoursesData}
                >Reset</Button>
            </Box>
            {
                <Grid container sx={{ padding: '4% 7%', rowGap: '30px' }} spacing={5}>
                    {
                        courseData.length > 0 ? courseData.map((data) => {
                            return <Grid item md={6} sm={6} xs={12} lg={4} key={data._id} onClick={() => handlecardClick(data._id)} >
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
                                <h1>No Courses</h1>
                            </div>
                    }
                </Grid>
            }
            <div className={styles.pagination}><Pagination count={totalPages} page={currentPage} onChange={handlePageChange} /></div>
        </>
    );
} 
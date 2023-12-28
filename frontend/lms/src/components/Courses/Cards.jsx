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
export default function Courses() {

    const { userdata } = useAuth()
    const { token } = userdata;
    const [courseData, setCourseData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [title, setTitle] = useState('')
    const navigate = useNavigate()

    const fetchData = async (page = 1, title = '') => {
        try {
            const response = await getCourseData(page, title)
            setCourseData(response.data.data.courses)
            setCurrentPage(response.data.data.currentPage);
            setTotalPages(response.data.data.totalPages);
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

    const handleSearchcourse = () => {
        if(title === '') return;
        fetchData(1, title);
    }

    useEffect(() => {
        fetchData()
    }, [])
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className={styles.filters}>
                <TextField id="input-with-sx" label="Find a product" variant="standard" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Button onClick={handleSearchcourse}><SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} /></Button>

            </Box>
            {
                <Grid container sx={{ padding: '2%' }} spacing={2}>
                    {
                        courseData.length > 0 ? courseData.map((data) => {
                            return <Grid item md={4} sm={12} xs={12} lg={4} key={data._id} onClick={() => handlecardClick(data._id)} >
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
                                <h1>Loading...</h1>
                            </div>
                    }
                </Grid>
            }
            <div className={styles.pagination}><Pagination count={totalPages} page={currentPage} onChange={handlePageChange} /></div>
        </>
    );
} 
import React, { useEffect, useState } from 'react';
import './UserCourses.css'
import { userCourses } from '../../services/userCourses.service';
import CourseCard from '../../components/Courses/Card';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MuiBackdrop } from '../../components/MuiBackdrop';

const UserCourses = () => {

  const [courses, setCourses] = useState('')
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)


  const fetchUserCourseData = async () => {
    try {
      const response = await userCourses()
      if (response.data.courses) {
        const updatedCourse = response.data.courses.map(course => {
          return { ...course, isPurchased: true }
        })
        setCourses(updatedCourse)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlecardClick = (id) => {
    navigate(`/chapters/${id}`)
  }

  useEffect(() => {
    fetchUserCourseData()
  }, [])
  return (
    <div className='MyCoursesContainer'>
      {
        isLoading ? <MuiBackdrop open={isLoading} setOpen={setIsLoading} /> :
          <Grid container sx={{ padding: '2%' }} spacing={3}>
            {
              courses.length > 0 ? courses.map((data) => {
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
                  <h1>No Courses Purchased</h1>
                </div>
            }
          </Grid>
      }
    </div>
  )
}

export default UserCourses
import React, { useEffect, useState } from 'react';
import styles from './UserDetails.module.css';
import { useParams } from 'react-router-dom';
import { studentDetailsbyId } from '../../services/idDetails.service';
import config from '../../config.json';
import { getCourseData } from '../../services/courseData.service';
import { useAuth } from '../../Contexts/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { Box, Button, Grid, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { UnassignCourse } from '../../services/unAssignCourse.service';
import Avatar from '@mui/material/Avatar';



const UserDetails = () => {
    const { id } = useParams()
    const { userdata } = useAuth();
    const [studentData, setStudentData] = useState({})
    const [courseData, setCourseData] = useState([])
    const token = userdata.token;
    const [assignCourseId, setAssignCoursid] = useState({
        _id: '',
        title: ''
    })
    const fetchData = async () => {
        try {
            const response = await studentDetailsbyId(id, token)
            setStudentData(response.data.data[0])
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCourseData = async () => {
        try {
            const response = await getCourseData()
            const data = response.data.data.courses
            setCourseData(data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelectChange = (e) => {
        const id = e.target.value;

        const filterdCoursedata = courseData.filter(course =>
            course._id === id
        )
        setAssignCoursid({ ...assignCourseId, _id: filterdCoursedata[0]._id, title: filterdCoursedata[0].title })

    }

    const handleAssignCourse = async () => {
        const loader = toast.loading("Assigning Course")
        try {
            const res = await fetch(`${config.recurring.domainUrl}/${config.recurring.post.assignCourse}/${id}/${assignCourseId._id}`, {
                method: "POST",
                headers: {
                    "content-type": 'applications/json',
                    Authorization: `bearer ${token}`
                }
            })
            const response = await res.json()
            toast.dismiss(loader)
            if (response.msg) {
                setStudentData({ ...studentData, courses: [...studentData.courses, assignCourseId] })
                
                toast.success(response.msg)
            } else {
                toast.error(response.error)
            }
        } catch (error) {
            toast.dismiss(loader)
            console.log(error)
        }
    }


    const handleUnassignCourse = async (courseId) => {
        const loader = toast.loading("Unassigning Course")
        try {
            const response = await UnassignCourse(id, courseId, token)
            setStudentData(
                { ...studentData, courses: studentData.courses.filter(course => course._id !== courseId) });
            toast.success(response.data.msg)
            toast.dismiss(loader)
        } catch (error) {
            toast.dismiss(loader)
            toast.error(error.data.error)
        }
    }


    useEffect(() => {
        fetchData()
        fetchCourseData()
    }, [])
    return (
        <Grid container className={styles.Grid}>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <Grid item sm={12} md={2.5} xs={12} >
                <div className={styles.UserInfoDiv}> {Object.keys(studentData).length > 0 ?
                    <>
                        <img src={studentData.avatar ? `${studentData.avatar}` : null} className={styles.UserImage} alt='userimage' />
                        <h1 className={styles.Username}>{studentData.name}</h1>
                    </> : null}</div>
            </Grid>
            <Grid item sm={12} md={9} xs={12} className={styles.componentDiv} sx={{ boxShadow: "0px 0px 14px 1px aliceblue" }}>
                <Box>
                    <Grid item sm={12} md={12} xs={12} sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "600",
                        fontSize: "30px",
                        color: 'rgb(77,135,51)'
                    }}>
                        Enrollments
                    </Grid>
                    <div item className={styles.userEnrollments}>
                        <div className={styles.enrollmentinfo}>
                            <h3>Enroll in Course</h3>
                            <p>Manually enroll this user in a new course . Users are not charged for manuel enrollments</p>
                        </div>
                        <div className={styles.selcoursesecondDiv}>
                            <div className={styles.courseSelect}>
                                <select name="course" id="selectcourse" onChange={handleSelectChange} style={{ width: "100%", padding: "10px", borderRadius: "5px" }}>
                                    <option value="">Select a course</option>
                                    {
                                        courseData.length > 0 && courseData.map((course) => {
                                            return <option key={course._id} value={course._id} >{course.title}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className={styles.enrollBtnDiv}>
                                <button onClick={handleAssignCourse}>Enroll</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.userEnrollments}>
                        <div className={styles.enrollmentinfo}>
                            <h3>Enrollments</h3>
                            <p>View the user's enrollments , see their progress , or manually unroll them from a course</p>
                        </div>
                        <div className={styles.unenrollDiv}>
                            <Typography variant='h4' sx={{
                                textAlign: 'center',
                                marginBottom: '20px'
                            }}>Courses</Typography>
                            {
                                Object.keys(studentData).length > 0 && studentData.courses.length > 0 ? studentData.courses.map((course) => {
                                    return <div key={course._id} className={styles.CourseUnassignDiv}>
                                        <Typography sx={{
                                            width: '90%'
                                        }}>{course.title}</Typography>
                                        <Button sx={{
                                            color: "rgb(77, 135, 51)"
                                        }} onClick={() => handleUnassignCourse(course._id)}><DeleteOutlineIcon /></Button></div>
                                })
                                    :
                                    <div className={styles.NoCourseDiv}>
                                        <Typography textAlign={'center'}>No Course assigned yet</Typography>
                                    </div>
                            }
                        </div>
                    </div>
                </Box>
            </Grid>
        </Grid>
    )
}

export default UserDetails
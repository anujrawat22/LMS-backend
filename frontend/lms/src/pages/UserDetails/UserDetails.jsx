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
            console.log(response.data.data[0])
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
        try {
            const res = await fetch(`${config.recurring.domainUrl}/${config.recurring.post.assignCourse}/${id}/${assignCourseId._id}`, {
                method: "POST",
                headers: {
                    "content-type": 'applications/json',
                    Authorization: `bearer ${token}`
                }
            })
            const response = await res.json()
            if (response.msg) {
                setStudentData({ ...studentData, courses: [...studentData.courses, assignCourseId] })
                toast.success(response.msg)
            } else {
                toast.error(response.error)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handleUnassignCourse = async (courseId) => {
        try {
            const response = await UnassignCourse(id, courseId, token)
            console.log(response.data)
            setStudentData(
                { ...studentData, courses: studentData.courses.filter(course => course._id !== courseId) });
            toast.success(response.data.msg)
        } catch (error) {
            console.log(error)
            toast.error(error.data.error)
        }
    }


    useEffect(() => {
        fetchData()
        fetchCourseData()
    }, [])
    return (
        <div>
            <Box>
                <Grid container spacing={6} sx={{ height: "85vh", marginTop: "5.5rem", marginLeft: ".5rem" }}>
                    <Toaster
                        position="bottom-right"
                        reverseOrder={false}
                    />
                    <Grid item sm={12} md={2.5} xs={12}>
                        <Grid item sm={12} md={12} xs={12} sx={{ display: "grid", justifyContent: "center", alignItems: "center" }}>
                            <Avatar src={studentData.avatar ? `${studentData.avatar}` : null} sx={{ width: 200, height: 200 }} />
                        </Grid>
                        <Grid item sm={12} md={12} xs={12} sx={{}}>
                            <div> {Object.keys(studentData).length > 0 && <Typography sx={{ fontWeight: "600", padding: "10px", fontSize: "25px", display: "grid", justifyContent: "center", alignItems: "center", }}>Name : {studentData.name}</Typography>}</div>
                            <Typography sx={{ fontSize: "20px", display: "grid", justifyContent: "center", padding: "10px", alignItems: "center", }}>Student</Typography>
                        </Grid>
                        <Grid item sm={12} md={12} xs={12} sx={{ display: "grid", justifyContent: "center", alignItems: "center" }} >
                            <Button>Information</Button>
                        </Grid>
                    </Grid>
                    <Grid item sm={12} md={9} xs={12} className={styles.componentDiv} sx={{ boxShadow: "0px 0px 14px 1px aliceblue" }}>
                        <Box>
                            <Grid item sm={12} md={12} xs={12} sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontWeight: "600",
                                fontSize: "40px"
                            }}>
                                Enrollments
                            </Grid>
                            <Grid item className={styles.userEnrollments}>
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
                            </Grid>

                            <Grid className={styles.userEnrollments}>
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
                                                    color: 'rgb(180,211,59)'
                                                }} onClick={() => handleUnassignCourse(course._id)}><DeleteOutlineIcon /></Button></div>
                                        })
                                            :
                                            <div className={styles.NoCourseDiv}>
                                                <Typography textAlign={'center'}>No Course assigned yet</Typography>
                                            </div>
                                    }
                                </div>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default UserDetails
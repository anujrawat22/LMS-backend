import * as React from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import './coursechapters.css';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { GridMenuIcon } from '@mui/x-data-grid';
import { useEffect } from 'react';
import { GetCourseDetails } from '../../services/courseDetails.service';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { CheckUserCourses } from '../../services/checkUserCourse.service';
import { MuiBackdrop } from '../MuiBackdrop';


export default function CourseChapters() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [courseData, setCourseData] = useState({
        title: '',
        thumbnail: '',
        sections: [],
        price: 0,
        createAt: '',
        Description: '',
        updatedAt: ''
    })
    const [isDataLoading, setIsDataLoading] = useState(true)

    const [userHasCourse, setUserHasCourse] = useState(false)


    const fetchCourseData = async () => {
        try {
            const response = await GetCourseDetails(id)
            setCourseData(response.data.data)
            setIsDataLoading(false)
        } catch (error) {
            console.log(error);
        }
    }

    const handleNavigateCourse = (sectionId, lessonId) => {
        navigate(`/CourseDetails/${id}/${sectionId}/${lessonId}`)
    }

    const checkforUserCourse = async () => {
        try {
            const response = await CheckUserCourses(id)
            setUserHasCourse(response.data.hasCourse)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        checkforUserCourse()
        fetchCourseData()
    }, [])


    return (
        <>isDataLoading ?  <MuiBackdrop open={isDataLoading} setOpen={setIsDataLoading} /> :
            <div className='CourseSectionsMainContainer'>
                <div className='backbuttonDiv'>
                    <div>
                        <Tooltip title="Go back to courses page" arrow placement="right">
                            <Link to="/courses">
                                <IconButton>
                                    <ArrowBackIosIcon />
                                </IconButton>
                            </Link>
                        </Tooltip>
                    </div>
                </div>
                {
                    courseData.sections.length > 0 && courseData.sections.map((section) => {
                        return <Accordion expanded={true} key={courseData._id}>
                            <AccordionSummary
                                aria-controls="panel1a-content"
                                sx={{ background: "#eee", minHeight: "30px", margin: "0px" }}
                            >
                                <Typography ><span style={{ fontWeight: "900" }}>{section.sectionTitle}</span></Typography>
                            </AccordionSummary>
                            {
                                section.subsections.length > 0 && section.subsections.map((lesson) => {
                                    return <AccordionDetails key={lesson._id}>
                                        <Grid container sx={{
                                            alignItems: "center",

                                        }}>
                                            <Grid item md={1} xs={1} sm={1} sx={{
                                                display: "flex",
                                                alignItems: "center"
                                            }}>
                                                <GridMenuIcon />
                                            </Grid>
                                            <Grid item md={9} xs={9} sm={9} sx={{
                                                display: "flex",
                                                alignItems: "center"
                                            }}>
                                                {lesson.Title}
                                            </Grid>
                                            <Grid item md={2} xs={2} sm={2} sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "end"
                                            }}>

                                                {userHasCourse || lesson.isfree ?
                                                    <button style={{
                                                        backgroundColor: "rgb(77, 135, 51)",
                                                        border: "1px solid rgb(77, 135, 51)",
                                                        borderRadius: "4px",
                                                        color: "#fff",
                                                        cursor: "pointer",
                                                        fontSize: ".9rem",
                                                        fontWeight: "700",
                                                        marginLeft: "auto",
                                                        padding: "4px 10px",
                                                        textTransform: "uppercase",
                                                        minHeight: "2px !important",
                                                    }}
                                                        onClick={() => handleNavigateCourse(section._id, lesson._id)}
                                                    >
                                                        PREVIEW
                                                    </button>
                                                    :
                                                    <button style={{
                                                        backgroundColor: "hsl(101.43,45.16%,36.47%,0.5)",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        color: "#fff",
                                                        cursor: "pointer",
                                                        fontSize: ".9rem",
                                                        fontWeight: "700",
                                                        marginLeft: "auto",
                                                        padding: "4px 10px",
                                                        textTransform: "uppercase",
                                                        minHeight: "2px !important",
                                                    }}
                                                        onClick={() => handleNavigateCourse(section._id, lesson._id)}
                                                    >
                                                        Start
                                                    </button>
                                                }
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                })
                            }

                        </Accordion>
                    })
                }

            </div>
        </>
    );


}



import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Accordion, AccordionDetails, AccordionSummary, Grid, IconButton, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { useState, useEffect } from 'react';
import styles from './courseDetails.module.css';
import { GridMenuIcon } from '@mui/x-data-grid';
import { GetCourseDetails } from '../../services/courseDetails.service';
import { useNavigate, useParams } from 'react-router-dom';
import CourseDetailMainContent from '../CourseDetailMainContent/CourseDetailMainContent';

export default function CourseDetails() {
    const { id } = useParams()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate()
    const [courseData, setCourseData] = useState({
        title: '',
        thumbnail: '',
        sections: [],
        price: 0,
        createAt: '',
        Description: '',
        updatedAt: ''
    })

    const [Lessondata, setLessonData] = useState({})

    const isMobileDevice = useMediaQuery('(max-width:900px)');

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const fetchData = async () => {
        try {
            const response = await GetCourseDetails(id)
            console.log(response.data.data)
            setCourseData(response.data.data)
            setLessonData(response.data.data.sections[0].subsections[0])
        } catch (error) {
            console.log(error);
        }
    }

    const handleLessonClick = (data) => {
        setLessonData(data)

    }

    const handleNavigateToCourseDetails = () => {
        navigate(`/chapters/${id}`)
    }

    useEffect(() => {
        fetchData()

    }, [])


    return (
        <>
            <div className={styles.coursedetailsdiv}>
                {
                    isMobileDevice &&
                    <GridMenuIcon onClick={handleToggleSidebar} className="menu-icon" />
                }
                <Grid container spacing={1} sx={{ ml: 2 }}>
                    <Grid className={`${styles.coursesectionssidenavbar} ${isSidebarOpen ? 'open' : ''}`} item xs={12} sm={12} md={3} sx={{ background: "#f9fbfd", paddingLeft: "8px", paddingRight: "8px" }}>
                        <Tooltip title="Go Back" arrow placement="right">
                            <IconButton>
                                <ArrowBackIosIcon onClick={handleNavigateToCourseDetails} />
                            </IconButton>
                        </Tooltip>
                        {/* <Paper sx={{ mr: 2, ml: 1, background: "transparent" }}> */}
                        {
                            courseData.sections.length > 0 && courseData.sections.map((sections) => {
                                return <Accordion key={sections._id} expanded={true} sx={{ background: "transparent" }}>
                                    <AccordionSummary
                                        aria-controls="panel1a-content"
                                        sx={{ background: "transparent" }}
                                    >
                                        <Typography variant='h6' sx={{ background: "transparent" }} > {sections.sectionTitle}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                                        {
                                            sections.subsections.length > 0 && sections.subsections.map((subsection, index) => {
                                                return <div className={styles.LessonAccordance}
                                                    key={index}
                                                    onClick={() => handleLessonClick(subsection)}
                                                >{subsection.Title}</div>
                                            })
                                        }
                                    </AccordionDetails>
                                </Accordion>
                            })
                        }
                        {/* </Paper> */}
                    </Grid>
                    <Grid item xs={12} sm={12} md={9} className='main-content'>
                        {
                            Object.keys(Lessondata).length > 0 ?
                                <CourseDetailMainContent data={Lessondata} />
                                :
                                null
                        }
                    </Grid>
                </Grid>
            </div >
        </>
    )
}    

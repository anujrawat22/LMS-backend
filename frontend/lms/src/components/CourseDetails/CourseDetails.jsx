import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Accordion, AccordionDetails, AccordionSummary, Grid, IconButton, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { useState, useEffect } from 'react';
import styles from './courseDetails.module.css';
import { GridMenuIcon } from '@mui/x-data-grid';
import { GetCourseDetails } from '../../services/courseDetails.service';
import { useNavigate, useParams } from 'react-router-dom';
import CourseDetailMainContent from '../CourseDetailMainContent/CourseDetailMainContent';
import PropTypes from 'prop-types';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import NotesIcon from '@mui/icons-material/Notes';

const drawerBleeding = -100;

const Root = styled('div')(({ theme }) => ({
    height: '100%',
    backgroundColor:
        theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));



export default function CourseDetails() {
    const { id, lessonId, sectionId } = useParams()
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
    const [toggleSwapbleDrawer, setToggleSwapbleDrawer] = useState(false)
    const [Lessondata, setLessonData] = useState({})
    const [selectedLessonId, setSelectedLessonId] = useState(null);


    const fetchData = async () => {
        try {
            const response = await GetCourseDetails(id)
            setCourseData(response.data.data)
            const Sections = response.data.data.sections;
            const LessonSection = Sections.find(section => section._id === sectionId)
            const lessonData = LessonSection.subsections.find(lesson => lesson._id === lessonId)
            setLessonData(lessonData)
        } catch (error) {
            console.log(error);
        }
    }

    const handleLessonClick = async (sectionId, lessonId) => {
        try {

            const response = await GetCourseDetails(id);
            const Sections = response.data.data.sections;
            const LessonSection = Sections.find(section => section._id === sectionId);
            const newLessonData = LessonSection.subsections.find(subsection => subsection._id === lessonId);
            setLessonData(newLessonData);
            navigate(`/CourseDetails/${id}/section/${sectionId}/lesson/${lessonId}`);
        } catch (error) {
            console.log(error);
        }
    }

    const handleNavigateToCourseDetails = () => {
        navigate(`/chapters/${id}`)
    }

    useEffect(() => {
        fetchData()
        setSelectedLessonId(lessonId);
    }, [lessonId, sectionId, id])




    return (
        <Grid container className={styles.MainGridContainer} >
            <div className={styles.DrawerIcon}>
                <Tooltip title='Lessons'>
                    <IconButton onClick={() => setToggleSwapbleDrawer(!toggleSwapbleDrawer)}>
                        <GridMenuIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <Grid className={`${styles.coursesectionssidenavbar} ${isSidebarOpen ? 'open' : ''}`} item xs={12} sm={12} md={3} sx={{ background: "#f9fbfd", paddingLeft: "8px", paddingRight: "8px" }}>
                <Tooltip title="Go Back" arrow placement="right">
                    <IconButton>
                        <ArrowBackIosIcon onClick={handleNavigateToCourseDetails} />
                    </IconButton>
                </Tooltip>
                {
                    courseData.sections.length > 0 && courseData.sections.map((sections, index) => {
                        return <Accordion key={index} expanded={true} sx={{ background: "transparent" }} >
                            <AccordionSummary
                                aria-controls="panel1a-content"
                                sx={{ background: "transparent" }}
                            >
                                <Typography variant='h6' sx={{ background: "transparent" }} > {sections.sectionTitle}</Typography>
                            </AccordionSummary>
                            <AccordionDetails id={`section-${sections._id}`}>
                                {
                                    sections.subsections.length > 0 && sections.subsections.map((subsection, index) => {
                                        return <div className={styles.LessonAccordance}
                                            key={subsection._id}
                                            onClick={() => handleLessonClick(sections._id, subsection._id, subsection)}
                                            id={`lesson-${subsection._id}`}
                                            style={{
                                                backgroundColor: subsection._id === selectedLessonId ? 'rgb(180, 211, 59)' : 'transparent',
                                                color: subsection._id === selectedLessonId ? 'white' : 'black',
                                            }}><NotesIcon fontSize='small' sx={{
                                                marginRight: '10px'
                                            }} />{subsection.Title}</div>
                                    })
                                }
                            </AccordionDetails>
                        </Accordion>
                    })
                }
                {/* </Paper> */}
            </Grid>
            <Grid item xs={12} sm={12} md={9} className={styles.maincontent} >
                {
                    Object.keys(Lessondata).length > 0 ?
                        <CourseDetailMainContent data={Lessondata} courseId={id} sectionId={sectionId} />
                        :
                        null
                }
            </Grid>
            {toggleSwapbleDrawer ? <SwipeableEdgeDrawer open={toggleSwapbleDrawer} setOpen={setToggleSwapbleDrawer} courseData={courseData} setLessonData={setLessonData} selectedLessonId={selectedLessonId} id={id} sectionId={sectionId} lessonId={lessonId} /> : null}
        </Grid>
    )
}


function SwipeableEdgeDrawer({ open, setOpen, courseData, setLessonData, selectedLessonId, id }) {

    const navigate = useNavigate()
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };


    const handleLessonClick = async (sectionId, lessonId) => {
        try {
            const response = await GetCourseDetails(id);
            const Sections = response.data.data.sections;
            const LessonSection = Sections.find(section => section._id === sectionId);
            const newLessonData = LessonSection.subsections.find(subsection => subsection._id === lessonId);
            setLessonData(newLessonData);
            navigate(`/CourseDetails/${id}/section/${sectionId}/lesson/${lessonId}`);
        } catch (error) {
            console.log(error);
        }
        setOpen(false)
    }

    return (
        <Root>
            <CssBaseline />
            <Global
                styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        height: `calc(50% - ${drawerBleeding}px)`,
                        overflow: 'visible',
                    },
                }}
            />
            <SwipeableDrawer
                anchor="top"
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <div className={styles.SwipableDivData}>
                    {
                        courseData.sections.length > 0 && courseData.sections.map((sections) => {
                            return <div key={sections._id} expanded={true} sx={{ background: "transparent" }} className={styles.SectionData}>
                                <div className={styles.SectinTitleDiv}>
                                    <h4>{sections.sectionTitle}</h4>
                                </div>
                                <div className={styles.SectionContentDiv}>
                                    {
                                        sections.subsections.length > 0 && sections.subsections.map((subsection, index) => {
                                            return <div
                                                id={`lesson-${subsection._id}`}
                                                key={index}
                                                onClick={() => handleLessonClick(sections._id, subsection._id)}
                                                style={{
                                                    backgroundColor: subsection._id === selectedLessonId ? 'rgb(180, 211, 59)' : 'transparent',
                                                    color: subsection._id === selectedLessonId ? 'white' : 'black',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            ><NotesIcon fontSize='small' sx={{
                                                marginRight: '10px'
                                            }} />{subsection.Title}</div>
                                        })
                                    }
                                </div>
                            </div>
                        })
                    }
                </div>
            </SwipeableDrawer>
        </Root>
    );
}

SwipeableEdgeDrawer.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};
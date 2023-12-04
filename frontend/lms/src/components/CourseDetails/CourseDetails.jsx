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
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import NotesIcon from '@mui/icons-material/Notes';

const drawerBleeding = -100;

const Root = styled('div')(({ theme }) => ({
    height: '100%',
    backgroundColor:
        theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
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

    const isMobileDevice = useMediaQuery('(max-width:900px)');

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const fetchData = async () => {
        try {
            const response = await GetCourseDetails(id)
            setCourseData(response.data.data)
            console.log(response.data.data)
            const Sections = response.data.data.sections;
            const LessonSection = Sections.find(section => section._id === sectionId)
            const lessonData = LessonSection.subsections.find(lesson => lesson._id === lessonId)
            setLessonData(lessonData)
        } catch (error) {
            console.log(error);
        }
    }

    const handleLessonClick = (sectionId, lessonId , lesson) => {
        navigate(`/CourseDetails/${id}/section/${sectionId}/lesson/${lessonId}`)
        setLessonData(lesson)
    }

    const handleNavigateToCourseDetails = () => {
        navigate(`/chapters/${id}`)
    }

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <Grid container className={styles.MainGridContainer}>
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
                                            onClick={() => handleLessonClick(sections._id, subsection._id, subsection)}
                                        ><NotesIcon fontSize='small' sx={{
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
            <Grid item xs={12} sm={12} md={9} className={styles.maincontent}>
                {
                    Object.keys(Lessondata).length > 0 ?
                        <CourseDetailMainContent data={Lessondata} />
                        :
                        null
                }
            </Grid>
            {toggleSwapbleDrawer ? <SwipeableEdgeDrawer open={toggleSwapbleDrawer} setOpen={setToggleSwapbleDrawer} courseData={courseData} setLessonData={setLessonData} /> : null}
        </Grid>
    )
}


function SwipeableEdgeDrawer({ open, setOpen, courseData, setLessonData }) {


    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };


    const handleLessonClick = (data) => {
        setLessonData(data)
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
                                            return <div className={styles.smallLessonAccordance}
                                                key={index}
                                                onClick={() => handleLessonClick(subsection)}
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
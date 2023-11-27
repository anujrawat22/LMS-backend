import * as React from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import './coursechapters.css';
import { Button, Grid, IconButton, Tooltip, TextField, Switch } from '@mui/material';
import { GridMenuIcon } from '@mui/x-data-grid';
import { useEffect } from 'react';
import { GetCourseDetails } from '../../services/courseDetails.service';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../Contexts/AuthContext';
import { CheckUserCourses } from '../../services/checkUserCourse.service';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2'
import { DeleteCourse } from '../../services/deleteCourse.service';
import toast, { Toaster } from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import EditLessonModal from '../EditLessonModal/EditLessonModal';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { UpdateCourse } from '../../services/updateCourse.service';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import config from '../../config.json';
import { DeleteSection } from '../../services/deleteSection.service';
import { DeleteLesson } from '../../services/deleteLesson.service';
import Fade from '@mui/material/Fade';


export default function CourseChapters() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { userdata } = useAuth()
    const role = userdata.role;
    const { token } = userdata;
    const [courseData, setCourseData] = useState({
        title: '',
        thumbnail: '',
        sections: [],
        price: 0,
        createAt: '',
        Description: '',
        updatedAt: ''
    })
    const [LessonData, setLessonData] = useState({})
    const [sectionId, setSectionId] = useState('')
    const [userHasCourse, setUserHasCourse] = useState(false)
    const [editLessonModal, setEditLessonModal] = useState(false)
    const [hasChanges, setHasChanges] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [lessonMenuAnchorEl, setLessonMenuAnchorEl] = useState(null);
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
    const [selectedSectionID, setSelectedSectionID] = useState(null)
    const [selectedLessonID, setSelectedLessonID] = useState(null)
    const [selectedLessonIndex, setSelectedLessonIndex] = useState(null);


    const handleMenuOpen = (event, sectionindex, sectionId) => {
        setAnchorEl(event.currentTarget);
        setSelectedSectionIndex(sectionindex);
        setSelectedSectionID(sectionId)
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedSectionIndex(null);
        setSelectedSectionID(null)
    };

    const handleLessonMenuOpen = (event, sectionindex, lessonindex, sectionId, lessonId) => {

        setLessonMenuAnchorEl(event.currentTarget);
        setSelectedSectionIndex(sectionindex);
        setSelectedLessonIndex(lessonindex);
        setSelectedSectionID(sectionId)
        setSelectedLessonID(lessonId)
    };

    const handleLessonMenuClose = () => {
        setLessonMenuAnchorEl(null);
        setSelectedSectionIndex(null);
        setSelectedLessonIndex(null);
        setSelectedSectionID(null)
        setSelectedLessonID(null)
    };

    const fetchCourseData = async () => {
        try {
            const response = await GetCourseDetails(id)
            setCourseData(response.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleNavigateCourse = (lesson) => {
        navigate(`/CourseDetails/${id}`, { state: { lessonData: lesson } })
    }

    const checkforUserCourse = async () => {
        try {
            const response = await CheckUserCourses(id, token)
            setUserHasCourse(response.data.hasCourse)
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditLesson = () => {
        if (selectedSectionIndex !== null && selectedLessonIndex !== null) {
            setSectionId(selectedSectionIndex)
            setSectionId(selectedSectionID)
            setLessonData(courseData.sections[selectedSectionIndex].subsections[selectedLessonIndex])
            setEditLessonModal(true)
            handleLessonMenuClose();
        }
    }

    const handleDeleteLesson = () => {
        if (selectedSectionIndex !== null && selectedLessonIndex !== null && selectedSectionID !== null && selectedLessonID !== null) {
            Swal.fire({
                title: "Delete lesson?",
                text: "Are you sure your want to delete this lesson?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "rgb(77,135,51)",
                cancelButtonColor: "#d33",
                confirmButtonText: "Delete"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await DeleteLesson(id, selectedSectionID, selectedLessonID, token)
                        setCourseData(response.data.data)
                        toast.success(response.data.msg)
                    } catch (error) {
                        console.log(error)
                    }
                }
            });
            handleLessonMenuClose();
        }

    }

    const handleCloseModel = () => {
        setEditLessonModal(false)
    }

    const handleCourseDelete = () => {
        Swal.fire({
            title: "Delete Course?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "rgb(77,135,51)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const loader = toast.loading("Deleting Course")
                try {
                    const response = await DeleteCourse(id, token)
                    toast.dismiss(loader)
                    toast.success("Course Deleted")
                    navigate("/courses")
                } catch (error) {
                    toast.dismiss(loader)
                    toast.error("Error in deleting the course")
                }
            }
        });
    }

    const handleSectionTitleChange = (e, i) => {
        const newtitle = e.target.value;
        setCourseData({
            ...courseData, sections: courseData.sections.map((section, index) => {
                if (index === i) {
                    section.sectionTitle = newtitle;
                    return section;
                }
                return section
            })
        })
        setHasChanges(true)
    }

    const handleLessonTypeChange = (sectionindex, lessonindex) => {
        setCourseData({
            ...courseData, sections: courseData.sections.map((section, index) => {
                if (index === sectionindex) {
                    return {
                        ...section, subsections: section.subsections.map((lesson, index) => {
                            if (index === lessonindex) {
                                return { ...lesson, isfree: !lesson.isfree }
                            }
                            return lesson;
                        })
                    }
                }
                return section
            })
        })
        setHasChanges(true)
    }

    const handleAddnewLesson = (id, section) => {
        setSectionId(id)
        setEditLessonModal(true)
        setLessonData({})
    }

    const handleAddnewSection = async () => {
        const url = config.recurring.domainUrl
        const endpoints = config.recurring.post.addSection
        const api = `${url}/${endpoints}`
        try {
            const res = await fetch(`${api}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `bearer ${token}`
                }
            })
            const response = await res.json()
            if (response.msg) {
                setCourseData(response.data)
                toast.success(response.msg)
            } else {
                toast.error("Something went wrong")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteSection = () => {
        if (selectedSectionIndex !== null && selectedSectionID !== null) {
            Swal.fire({
                title: "Delete Section?",
                text: "Are you sure to delete this section?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "rgb(77,135,51)",
                cancelButtonColor: "#d33",
                confirmButtonText: "Delete"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        console.log(id, selectedSectionID)
                        const response = await DeleteSection(id, selectedSectionID, token)
                        setCourseData(response.data.data)
                        toast.success(response.data.msg)
                    } catch (error) {
                        console.log(error)
                    }
                }
            });
            handleMenuClose();
        }

    }

    const handleUpdateCourse = () => {
        Swal.fire({
            title: "Update course",
            text: "Are you sure you want to update course content?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "rgb(77,135,51)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Update"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setHasChanges(false)
                try {
                    const response = await UpdateCourse(id, courseData, token)
                    toast.success(response.data.msg)
                } catch (error) {
                    toast.error("Error updating course")
                    setHasChanges(true)
                }
            }
        });
    }

    const handlebackbuttonClick = () => {
        if (hasChanges) {
            Swal.fire({
                title: "Discard Changes?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "rgb(77,135,51)",
                cancelButtonColor: "#d33",
                confirmButtonText: "Discard"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    navigate("/courses")
                }
            });
        } else {
            navigate('/courses')
        }
    }

    const handleOnDragEnd = (results) => {
        const { destination, type, source } = results;
        console.log(destination, source, type)

        if (!destination) {
            return; // Not a valid drop target
        }
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) return;
        if (type === 'group') {
            setHasChanges(true)
            const updatedSections = [...courseData.sections];
            const [movedSection] = updatedSections.splice(source.index, 1);
            updatedSections.splice(destination.index, 0, movedSection)
            return setCourseData({ ...courseData, sections: updatedSections })
        }

    }

    const handleSectionTypeChange = (sectionId, newValue) => {
        const updatedSections = courseData.sections.map((section) => {
            if (section._id === sectionId) {
                // Update the isfree property of the section
                section.isfree = newValue;

                // Update the isfree property of each lesson in the section
                section.subsections.forEach((lesson) => {
                    lesson.isfree = newValue;
                });
            }
            return section;
        });

        // Update the state with the modified sections
        setCourseData({ ...courseData, sections: updatedSections });
        setHasChanges(true)
    }

    useEffect(() => {
        checkforUserCourse()
        fetchCourseData()
    }, [])

    if (userHasCourse && role === 'user') {
        return (<>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <div style={{ marginTop: "120px", width: "70%", marginLeft: "auto", marginRight: "auto" }}>
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
                                <Typography sx={{}}><span style={{ fontWeight: "900" }}>{section.sectionTitle}</span></Typography>
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

                                                {userHasCourse && <button style={{
                                                    backgroundColor: "rgb(77,135,51)",
                                                    border: "1px solid rgb(77,135,51)",
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
                                                    onClick={() => handleNavigateCourse(lesson)}
                                                >
                                                    PREVIEW
                                                </button>}
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                })
                            }

                        </Accordion>
                    })
                }
                {editLessonModal && <EditLessonModal handleCloseModel={handleCloseModel} courseId={id} Data={LessonData} />}
            </div>
        </>
        );
    }

    if (role === 'admin' || role === 'superadmin') {
        return (<>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <div style={{ marginTop: "120px", width: "70%", marginLeft: "auto", marginRight: "auto" }}>
                <div className='backbuttonDiv'>
                    <div>
                        <Tooltip title="Go back to courses page" arrow placement="right">
                            <IconButton onClick={handlebackbuttonClick}>
                                <ArrowBackIosIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className='EditDeleteBtns'>
                        <Button startIcon={<AddIcon />} sx={{ backgroundColor: 'rgb(77,135,51)', color: 'white', '&:hover': { backgroundColor: 'rgb(77,135,51)', transform: 'scale(1.02) ', transition: '300ms' }, padding: '0px 20px' }} className='Courseeditbtn' onClick={handleAddnewSection}>New Section</Button>
                        <Button startIcon={<DeleteOutlineIcon />} sx={{ backgroundColor: 'rgb(77,135,51)', color: 'white', '&:hover': { backgroundColor: 'rgb(77,135,51)', transform: 'scale(1.02) ', transition: '300ms' }, padding: '0px 20px' }}
                            onClick={handleCourseDelete}>Delete</Button>
                    </div>
                </div>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <div className='sectionDataDiv' >
                        {
                            courseData.sections.length > 0 && courseData.sections.map((section, sectionindex) => {
                                return <Droppable droppableId={section._id} type='group' key={section._id} index={sectionindex}>
                                    {
                                        (provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef} className='droppableDiv'>
                                                <Draggable key={section._id} draggableId={section._id} index={sectionindex} type='group'>
                                                    {(provided) => (<div key={section._id} ref={provided.innerRef}
                                                        {...provided.draggableProps} >
                                                        <div className='sectionTitle'>
                                                            <div className='sectionTitleField'>
                                                                <Tooltip title='Drag section'>
                                                                    <IconButton {...provided.dragHandleProps}>
                                                                        <DragIndicatorIcon className='dragIcon' />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <TextField variant='standard' value={section.sectionTitle} onChange={(e) => handleSectionTitleChange(e, sectionindex)} />
                                                            </div>
                                                            <div className='sectionMoreoptionsDiv'>
                                                                <div className='TitleSwitchDiv'>
                                                                    <Typography variant='h6'>Free</Typography>
                                                                    <Switch size='small' sx={{
                                                                        '& .MuiSwitch-thumb': {
                                                                            marginTop: '-16px',
                                                                            color: 'rgb(77, 135, 51)',
                                                                        },
                                                                        '& .Mui-checked': {
                                                                            color: 'rgb(77, 135, 51)',
                                                                        },
                                                                        '& .Mui-checked + .MuiSwitch-track': {
                                                                            backgroundColor: 'rgb(77, 135, 51)',
                                                                            opacity: 0.5,
                                                                        },
                                                                    }} onChange={(e) => {
                                                                        handleSectionTypeChange(section._id, e.target.checked)
                                                                    }} key={section._id}></Switch>
                                                                </div>
                                                                <Tooltip  >
                                                                    <IconButton onClick={(e) => handleMenuOpen(e, sectionindex, section._id)}>
                                                                        <MoreVertIcon className='deleteIcon' fontSize='small' />
                                                                    </IconButton>
                                                                    <Menu
                                                                        key={section._id}
                                                                        anchorEl={anchorEl}
                                                                        open={Boolean(anchorEl)}
                                                                        onClose={handleMenuClose}
                                                                        PaperProps={{
                                                                            elevation: 4,
                                                                            style: {
                                                                                boxShadow: 'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
                                                                            },
                                                                        }}
                                                                    >
                                                                        {selectedSectionIndex !== null && (
                                                                            [<MenuItem onClick={() => handleDeleteSection()} sx={{
                                                                                color: 'red'
                                                                            }}>Delete</MenuItem>]
                                                                        )}
                                                                    </Menu>
                                                                </Tooltip>
                                                            </div>

                                                        </div>
                                                        {
                                                            section.subsections.length > 0 && section.subsections.map((lesson, lessonindex) => {
                                                                return <Droppable droppableId={lesson._id} key={lesson._id} index={lessonindex}>
                                                                    {(provided) => (<div {...provided.droppableProps} ref={provided.innerRef} className='lessonDropDiv'>

                                                                        <div key={lesson._id} ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            className='lessonDiv'>
                                                                            <div className='lessonTitleDiv'>
                                                                                <Tooltip title='Drag section'>
                                                                                    <IconButton {...provided.dragHandleProps}>
                                                                                        <DragIndicatorIcon className='dragIcon' />
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                                <Typography>{lesson.Title}</Typography>
                                                                            </div>
                                                                            <div className='lessonControlDiv'>
                                                                                <div className='lessonType'>
                                                                                    <Switch checked={lesson.isfree} size='small' onChange={() => handleLessonTypeChange(sectionindex, lessonindex)} sx={{
                                                                                        '& .MuiSwitch-thumb': {
                                                                                            marginTop: '-16px',
                                                                                            color: 'rgb(77, 135, 51)',
                                                                                        },
                                                                                        '& .Mui-checked': {
                                                                                            color: 'rgb(77, 135, 51)',
                                                                                        },
                                                                                        '& .Mui-checked + .MuiSwitch-track': {
                                                                                            backgroundColor: 'rgb(77, 135, 51)',
                                                                                            opacity: 0.5,
                                                                                        },
                                                                                    }} key={lesson._id}/>
                                                                                </div>
                                                                                <Tooltip  >
                                                                                    <IconButton onClick={(e) => { handleLessonMenuOpen(e, sectionindex, lessonindex, section._id, lesson._id) }}>
                                                                                        <MoreVertIcon className='deleteIcon' fontSize='small' />
                                                                                    </IconButton>
                                                                                    <Menu
                                                                                        anchorEl={lessonMenuAnchorEl}
                                                                                        open={Boolean(lessonMenuAnchorEl)}
                                                                                        onClose={handleLessonMenuClose}
                                                                                        TransitionComponent={Fade} // You can use other transition components like Slide
                                                                                        transitionDuration={200}
                                                                                        PaperProps={{
                                                                                            elevation: 4,
                                                                                            style: {
                                                                                                boxShadow: 'rgba(0, 0, 0, 0.04) 0px 3px 5px',
                                                                                            },
                                                                                        }}
                                                                                    >
                                                                                        {selectedSectionIndex !== null && selectedLessonIndex !== null && (
                                                                                            [
                                                                                                <MenuItem onClick={() => handleEditLesson(section._id)}>Edit</MenuItem>,
                                                                                                <MenuItem onClick={() => handleDeleteLesson()} sx={{
                                                                                                    color: 'red'
                                                                                                }}>Delete</MenuItem>
                                                                                            ]
                                                                                        )}
                                                                                    </Menu>
                                                                                </Tooltip>
                                                                            </div>


                                                                        </div>

                                                                    </div>)}
                                                                </Droppable>
                                                            })
                                                        }
                                                        <div className='newLessonDiv'>
                                                            <Button startIcon={<AddCircleIcon />} size='small' sx={{
                                                                color: 'rgb(77,135,51)'
                                                            }}
                                                                onClick={() => handleAddnewLesson(section._id, section)}
                                                            >New Lesson</Button>
                                                        </div>

                                                    </div>)}
                                                </Draggable>
                                                {provided.placeholder}
                                            </div>)
                                    }
                                </Droppable>
                            })
                        }
                    </div>
                </DragDropContext>
                <div className='updateChangesdiv'>
                    <Button variant='outlined' sx={{
                        color: 'rgb(77,135,51)',
                        border: '1px solid rgb(77,135,51)',
                        '&:hover': { border: '1px solid rgb(77,135,51)' }
                    }}
                        disabled={!hasChanges} onClick={handleUpdateCourse}>Update Changes</Button>
                </div>
                {editLessonModal && <EditLessonModal handleCloseModel={handleCloseModel} courseId={id} Data={LessonData} sectionId={sectionId} fetchCourseData={fetchCourseData} setData={setLessonData} />}
            </div>
        </>
        );
    }

    return (
        <div style={{ marginTop: "120px", width: "70%", marginLeft: "auto", marginRight: "auto" }}>
            <Tooltip title="Go back to courses page" arrow placement="right">
                <Link to="/courses">
                    <IconButton>
                        <ArrowBackIosIcon />
                    </IconButton>
                </Link>
            </Tooltip>
            {
                courseData.sections.length > 0 && courseData.sections.map((section) => {
                    return <Accordion expanded={true} key={courseData._id}>
                        <AccordionSummary
                            aria-controls="panel1a-content"
                            sx={{ background: "#eee", minHeight: "30px", margin: "0px" }}
                        >
                            <Typography sx={{}}><span style={{ fontWeight: "900" }}>{section.sectionTitle}</span></Typography>
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
                                            {lesson.isfree ?
                                                <button style={{
                                                    backgroundColor: "#bad900",
                                                    border: "1px solid #bad900",
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
                                                    onClick={() => handleNavigateCourse(lesson)}
                                                >
                                                    PREVIEW
                                                </button>
                                                :
                                                <button style={{
                                                    backgroundColor: "hsl(72.24,63.33%,52.94%,0.5)",
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
    );
}
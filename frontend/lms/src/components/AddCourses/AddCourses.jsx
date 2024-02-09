
import { Button, Container, Grid, Paper, TextField, Typography, Tooltip, IconButton } from '@mui/material';
import React, { useState } from 'react'
import styles from './AddCourses.module.css'
import EditableTitle from '../EditableTitle/EditableTitle';
import toast, { Toaster } from 'react-hot-toast';
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { AddCourse } from '../../services/addCourse.service';
import { useAuth } from '../../Contexts/AuthContext';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddContent from '../AddContent/AddContent';
import { Switch } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const AddCourses = () => {
    const { userdata } = useAuth()
    const token = userdata.token;
    const [sections, setSections] = useState([]);
    const [courseTitle, setCourseTitle] = useState('')
    const [price, setPrice] = useState({
        value: 'INR',
        amount: 0,
        label: ''
    })
    const [sectionId, setSectionId] = useState('')
    const [thumbnail, setThumbnail] = useState('')
    const [isEditing, setIsEditing] = useState(true);
    const [imageName, setImageName] = useState('')
    const [Description, setDescription] = useState('')
    const [isOpen, setOpen] = useState(false)
    const [LessonData, setLessonData] = useState({})
    const [isAddingCourse, setIsAddingCourse] = useState(false)
    const handleRemoveSection = (id) => {
        const updatedSections = sections.filter((section) => section.sectionid !== id);
        setSections(updatedSections);
        toast.success("Section removed")
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = list;
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)
        return result
    }

    const handleOnDragEnd = (results) => {
        const { destination, type, source } = results;
        console.log(type)
        if (!destination) {
            return;
        }
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) return;
        if (type === 'Sections') {
            const SectionsData = [...sections];
            const reorderdSections = reorder(SectionsData, source.index, destination.index)
            setSections((prevSections) => [...reorderdSections]);
            toast.success("Section reorderd")
        }

        if (type === 'lessons') {
            const SectionsData = [...sections];
            const sourceSection = SectionsData.find(section => section.sectionid === source.droppableId)
            const destinationSection = SectionsData.find(section => section.sectionid === destination.droppableId)
            if (!sourceSection || !destinationSection) return;

            if (!sourceSection.subsections) {
                sourceSection.subsections = []
            }

            if (!destinationSection.subsections) {
                destinationSection.subsections = []
            }

            if (source.droppableId === destination.droppableId) {
                const reorderLessons = reorder(sourceSection.subsections, source.index, destination.index)
                source.subsections = reorderLessons;
                setSections(SectionsData)
                toast.success("Lessons reordered")
            } else {
                const [movedLesson] = sourceSection.subsections.splice(source.index, 1);

                destinationSection.subsections.splice(destination.index, 0, movedLesson)
                setSections(SectionsData)
                toast.success("Lessons reordered")
            }
        }
    }

    const generateSectionId = () => {
        return `${uuidv4()}`
    }

    const handleAddnewSection = () => {
        const newSection = {
            sectionTitle: 'Section Title', subsections: [], sectionid: generateSectionId(), editTitle: true
        }
        setSections([...sections, newSection])
    }

    const handleSectionTitleChange = (event, id) => {
        const updatedSections = sections.map((section) => {
            if (section.sectionid === id) {
                return {
                    ...section,
                    sectionTitle: event.target.value,
                };
            }
            return section;
        });

        setSections(updatedSections);
    }

    const handleEditTitle = (id, value) => {
        const updatedSections = sections.map((section) => {
            if (section.sectionid === id) {
                return {
                    ...section,
                    editTitle: value,
                };
            }
            return section;
        });

        setSections(updatedSections);
    }

    const handleAddCourse = async () => {

        if (courseTitle === '' || courseTitle === null) {
            return toast.error("The course must contain a title")
        }
        if (thumbnail === '' || thumbnail === null) {
            return toast.error("Please upload a thumbnail for the course")
        }
        if (Description === '' || thumbnail === null) {
            return toast.error("Please Enter a short description for the course")
        }
        if (price.amount <= 0) {
            return toast.error("Price must be non-zero or non-negative")
        }
        if (sections.length === 0) {
            return toast.error("Please add some content to the course")
        }
        setIsAddingCourse(true)
        const payload = {
            title: courseTitle,
            thumbnail,
            sections,
            price,
            Description
        }
        try {
            const response = await AddCourse(payload, token)
            setCourseTitle('')
            setSections([])
            setThumbnail('')
            toast.success("Course Added Succesfully")
            setIsEditing(true)
            setImageName('')
            setDescription('')
            setPrice({
                ...price, amount: 0
            })
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong in creating the course")
        } finally {
            setIsAddingCourse(false)
        }
    }


    const handleNewLesson = (id) => {
        setSectionId(id)
        setOpen(!isOpen)
        setLessonData({})
    }

    const handleLessonTypeChange = (id, i) => {
        setSections((prevSections) =>
            prevSections.map((section) => {
                if (section.sectionid === id) {
                    const updatedSections = section.subsections.map((lesson, index) => {
                        if (index === i) {
                            return { ...lesson, isfree: !lesson.isfree }
                        }
                        return lesson;
                    })
                    return { ...section, subsections: updatedSections }
                }
                return section
            })
        )
    }


    const handleDeleteLessson = (id, i) => {
        setSections((prevsection) => {
            return prevsection.map((section) => {
                if (section.sectionid === id) {
                    const updateSections = section.subsections.filter((lesson, index) => {
                        return index !== i
                    })
                    return { ...section, subsections: updateSections }
                }
                return section
            })
        })
        toast.success("Lesson Deleted")
    }

    const handleEditLessonData = (data) => {
        setLessonData(data)
        setOpen(true)
    }



    return (
        <>
            <Container sx={{ mt: 11, mb: 4, maxWidth: '100% !important', height: 'auto' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper
                            sx={{
                                padding: '2% 10%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 'auto',
                            }}
                            fullWidth
                        >
                            <EditableTitle
                                courseTitle={courseTitle}
                                setCourseTitle={setCourseTitle}
                                setThumbnail={setThumbnail}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                setImageName={setImageName}
                                imageName={imageName}
                                Description={Description}
                                setDescription={setDescription}
                                setPrice={setPrice}
                                price={price}
                            />

                            <div className={styles
                                .MainSectionContainer}>
                                {sections.length > 0 && <Typography variant="h4" sx={{
                                    textAlign: 'center'
                                }}>Sections</Typography>}
                                <DragDropContext onDragEnd={handleOnDragEnd}>
                                    <Droppable droppableId='Sections' type='Sections'>
                                        {(provided) => (
                                            <div className={styles.DroppableDiv} {...provided.droppableProps} ref={provided.innerRef}>
                                                {
                                                    sections.length > 0 && sections.map((section, index) => {
                                                        return <Section
                                                            index={index}
                                                            section={section} handleSectionTitleChange={handleSectionTitleChange} handleEditTitle={handleEditTitle} handleRemoveSection={handleRemoveSection} handleLessonTypeChange={handleLessonTypeChange} handleEditLessonData={handleEditLessonData} handleDeleteLessson={handleDeleteLessson} handleNewLesson={handleNewLesson} key={section.sectionid} />
                                                    })
                                                }
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>

                            <div className={styles.addnewSectionDiv}>
                                <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={handleAddnewSection} sx={{
                                    border: '1px solid rgb(77,135,51)',
                                    color: 'rgb(77,135,51)'
                                }}>
                                    New Section
                                </Button>
                            </div>

                            <Button style={{ marginTop: '2%' }} variant="contained" onClick={() => handleAddCourse()} sx={{
                                backgroundColor: 'rgb(77,135,51)',
                                border: '1px solid rgb(77,135,51)'
                            }}
                                disabled={isAddingCourse}>
                                Finish Adding Course
                            </Button>
                        </Paper>
                    </Grid>
                    <Toaster position="bottom-right" reverseOrder={false} />
                </Grid>
            </Container>
            {isOpen ? <AddContent isOpen={isOpen} setOpen={setOpen} setSections={setSections} sectionId={sectionId} LessonData={LessonData} /> : null}
        </>
    );
}

export default AddCourses;




function Section({ section, index, handleSectionTitleChange, handleEditTitle, handleRemoveSection, handleLessonTypeChange, handleEditLessonData, handleDeleteLessson, handleNewLesson }) {
    return (
        <Draggable draggableId={section.sectionid} index={index}>
            {(provided) => (
                <div className={styles.DraggableDiv} ref={provided.innerRef} {...provided.draggableProps} >
                    <div className={styles.TitleDiv}>
                        <div className={styles.SectionTitle}>
                            <Tooltip title='Drag Section' >
                                <IconButton {...provided.dragHandleProps}>
                                    <DragIndicatorIcon className={styles.DragIndicatorIcon} />
                                </IconButton>
                            </Tooltip>
                            {section.editTitle ? (
                                <>
                                    <TextField
                                        id="standard-basic"
                                        label="Title"
                                        variant="standard"
                                        value={section.sectionTitle}
                                        onChange={(e) => handleSectionTitleChange(e, section.sectionid)}
                                        sx={{
                                            marginLeft: '20px',
                                        }}
                                    />
                                    <Button onClick={() => handleEditTitle(section.sectionid, false)} sx={{
                                        color: 'rgb(77,135,51)',
                                        border: '1px solid rgb(77,135,51)'
                                    }}>Save</Button>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h5" sx={{ marginLeft: '20px' }}>
                                        {section.sectionTitle}
                                    </Typography>
                                    <EditIcon fontSize="small" onClick={() => handleEditTitle(section.sectionid, true)} sx={{ marginLeft: '10px' }} />
                                </>
                            )}
                        </div>
                        <div>
                            <DeleteIcon className={styles.DeleteIcon} onClick={() => handleRemoveSection(section.sectionid)} />
                        </div>
                    </div>
                    <Droppable droppableId={section.sectionid} type='lessons'>
                        {(provided) => (
                            <div className={styles.LessonDiv} ref={provided.innerRef} {...provided.droppableProps} >
                                {section.subsections.length > 0 &&
                                    section.subsections.map((subsection, index) => {
                                        return <Lesson subsection={subsection} handleLessonTypeChange={handleLessonTypeChange} handleEditLessonData={handleEditLessonData} handleDeleteLessson={handleDeleteLessson} index={index} section={section} key={subsection.LessonId} />
                                    })
                                }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <div className={styles.ButtonDiv}>
                        <Button startIcon={<AddCircleOutlineIcon />} onClick={() => handleNewLesson(section.sectionid)} sx={{
                            color: 'rgb(77,135,51)'
                        }}>
                            New lesson
                        </Button>
                    </div>
                </div>
            )}
        </Draggable >
    )
}


function Lesson({ subsection, handleLessonTypeChange, handleEditLessonData, handleDeleteLessson, index, section }) {
    return (
        <Draggable draggableId={subsection.LessonId} index={index}>
            {(provided) => (
                <div className={styles.subsections} style={{
                    borderBottom: '1px solid rgb(230,230,230)'
                }} ref={provided.innerRef} {...provided.draggableProps}>
                    <Tooltip title='Drag Lesson'>
                        <IconButton {...provided.dragHandleProps}>
                            <DragIndicatorIcon className={styles.DragIndicatorIcon} />
                        </IconButton>
                    </Tooltip>
                    <div className={styles.subsectionInfo}>
                        <Typography variant="h6" sx={{
                            fontSize: '1rem'
                        }}>{subsection.Title}</Typography>
                        <div className={styles.LessonSwitchDiv}>
                            <Typography>Free</Typography>
                            <Switch checked={subsection.isfree} onChange={() => handleLessonTypeChange(section.sectionid, index)} />
                        </div>
                    </div>
                    <div className={styles.EditLesson}>
                        <EditIcon onClick={() => handleEditLessonData(subsection)} />
                    </div>
                    <div className={styles.DeleteLessonDiv}>
                        <DeleteIcon onClick={() => handleDeleteLessson(section.sectionid, index)} />
                    </div>
                </div>
            )}
        </Draggable>
    )
}

import { Button, Container, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import styles from './AddCourses.module.css'
import EditableTitle from '../EditableTitle/EditableTitle';
import toast, { Toaster } from 'react-hot-toast';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { AddCourse } from '../../services/addCourse.service';
import { useAuth } from '../../Contexts/AuthContext';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddContent from '../AddContent/AddContent';
import { Switch } from '@mui/material';
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
    const handleRemoveSection = (id) => {
        const updatedSections = sections.filter((section) => section.sectionid !== id);
        setSections(updatedSections);
        toast.success("Section removed")
    };


    const handleOnDragEnd = (results) => {
        const { destination, type, source } = results;
        if (!results.destination) {
            return; // Not a valid drop target
        }
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        )  return;
        if (type === 'group') {
            const updatedSections = [...sections];
            const [movedSection] = updatedSections.splice(results.source.index, 1);
            updatedSections.splice(results.destination.index, 0, movedSection);
            return setSections(updatedSections);
        }
        const lessonSourceIndex = source.index;
        const lessonDestinationIndex = destination.index;

        const storeSourceIndex = sections.findIndex(
            (Lesson) => Lesson.LessonId === source.draggableId
        )

        const storeDestinationIndex = sections.findIndex(
            (Lesson) => Lesson.LessonId === destination.droppableId
        )

        // console.log(lessonSourceIndex , lessonDestinationIndex , storeSourceIndex , storeDestinationIndex)

        // const newLessonItem = [...sections[storeSourceIndex].subsections]

        // const newLessonDestination =
        //     source.droppableId !== destination.droppableId
        //         ? [...sections[storeDestinationIndex].subsections]
        //         : newLessonItem

        // const [deleteLesson] = newLessonItem.splice(lessonSourceIndex, 1);
        // newLessonDestination.splice(lessonDestinationIndex, 0, deleteLesson);

        // const newSections = [...sections];

        // newSections[lessonSourceIndex] = {
        //     ...sections[lessonSourceIndex],
        //     subsections: newLessonItem
        // }

        // newSections[storeDestinationIndex] = {
        //     ...sections[storeDestinationIndex],
        //     subsections: newLessonDestination,
        // }

        // setSections(newSections)
    }

    const generateSectionId = () => {
        return `section-${Date.now()}`
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

        const payload = {
            title: courseTitle,
            thumbnail,
            sections,
            price,
            Description
        }
        try {
            const response = await AddCourse(payload, token)
            // setAdding(false)
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
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <div className={styles
                                    .MainSectionContainer}>
                                    {sections.length > 0 && <Typography variant="h4" sx={{
                                        textAlign: 'center'
                                    }}>Sections</Typography>}
                                    <div className={styles.DroppableDiv}>
                                        {
                                            sections.length > 0 && sections.map((section, index) => {
                                                return <Droppable droppableId={section.sectionid} type="group">
                                                    {(provided) => (
                                                        <div className={styles.SectionsDiv} {...provided.droppableProps} ref={provided.innerRef}>
                                                            <Draggable key={section.sectionid} draggableId={section.sectionid} index={index}>
                                                                {(provided) => (
                                                                    <div className={styles.DraggableSection} ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps} key={section.sectionid}>
                                                                        <div
                                                                            className={styles.DraggableDiv}

                                                                        >
                                                                            <div className={styles.TitleDiv}>
                                                                                <div className={styles.SectionTitle}>
                                                                                    <DragIndicatorIcon className={styles.DragIndicatorIcon} />
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
                                                                                            <Button onClick={() => handleEditTitle(section.sectionid, false)}>Save</Button>
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
                                                                            {section.subsections.length > 0 &&
                                                                                section.subsections.map((subsection, index) => {
                                                                                    return (
                                                                                        <Droppable key={subsection.LessonId} droppableId={subsection.LessonId}>
                                                                                            {
                                                                                                (provided) => (
                                                                                                    <div

                                                                                                        {...provided.droppableProps} ref={provided.innerRef}>
                                                                                                        <Draggable key={subsection.LessonId} draggableId={subsection.LessonId} index={index}>
                                                                                                            {
                                                                                                                (provided) => (
                                                                                                                    <div ref={provided.innerRef}
                                                                                                                        {...provided.draggableProps}
                                                                                                                        {...provided.dragHandleProps} className={styles.subsections}>
                                                                                                                        <div>
                                                                                                                            <DragIndicatorIcon className={styles.DragIndicatorIcon} />
                                                                                                                        </div>
                                                                                                                        <div className={styles.subsectionInfo}>
                                                                                                                            <Typography variant="h6">{subsection.Title}</Typography>
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
                                                                                                                )
                                                                                                            }

                                                                                                        </Draggable>
                                                                                                        {provided.placeholder}
                                                                                                    </div>
                                                                                                )
                                                                                            }

                                                                                        </Droppable>
                                                                                    )
                                                                                }
                                                                                )
                                                                            }
                                                                            <div className={styles.ButtonDiv}>
                                                                                <Button startIcon={<AddCircleOutlineIcon />} onClick={() => handleNewLesson(section.sectionid)}>
                                                                                    New lesson
                                                                                </Button>
                                                                            </div>
                                                                        </div>

                                                                    </div>

                                                                )}
                                                            </Draggable>
                                                            {provided.placeholder}
                                                        </div>

                                                    )}
                                                </Droppable>
                                            })
                                        }

                                    </div>
                                </div>
                            </DragDropContext>
                            <div className={styles.addnewSectionDiv}>
                                <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={handleAddnewSection}>
                                    New Section
                                </Button>
                            </div>

                            <Button style={{ marginTop: '2%' }} variant="contained" onClick={() => handleAddCourse()}>
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

export default AddCourses
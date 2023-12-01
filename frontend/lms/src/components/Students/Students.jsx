import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import React, { useEffect, useState } from 'react';
import styles from './Students.module.css';
import { studentsData } from '../../services/studentdata.service';
import { Autocomplete, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, MenuItem, Paper, Select, TextField, Typography, DialogContentText, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { CSVDownload } from '../../services/csvDownload.service';
import { sendEmail } from '../../services/sendEmail.service';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../Contexts/AuthContext';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import { UpdateUserRoleService } from '../../services/userRoleUpdate.service';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ImportCSV } from '../../services/addStudentsCSV.service';
import ClearIcon from '@mui/icons-material/Clear';
import { getCourseData } from '../../services/courseData.service';
import { AddStudentManually } from '../../services/addStudentManually.service';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DeleteUserService } from '../../services/deleteUser.service';
import EmailIcon from '@mui/icons-material/Email';
import Swal from 'sweetalert2';
import Slide from '@mui/material/Slide';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const Students = () => {
    const navigate = useNavigate();
    const { userdata } = useAuth();
    const token = userdata.token;
    const [rows, setRows] = useState([]);
    const [studentList, setStudentList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalDocuments, setTotalDocuments] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [filter, setFilter] = useState({ name: '', email: '' })
    const [checkedUsers, setCheckedUsers] = useState({});
    const [open, setOpen] = useState(false)
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [role, setRole] = useState('');
    const [columns, setColumns] = useState([]);
    const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = React.useState(false);
    const [courseData, setCoursedata] = useState([])
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

    const handleRoleChange = (updatedRole, id) => {
        const updatedList = studentList.map(student => {
            if (student._id === id) {
                return { ...student, role: updatedRole };
            }
            return student;
        });
        setSelectedRowId(id);
        setRole(updatedRole);
        setStudentList(updatedList);
    };

    /** Updates the role */
    const roleUpdate = async (id) => {
        if (id !== selectedRowId) {
            toast.error("Please select/change the role");
            return;
        }
        try {
            const response = await UpdateUserRoleService(role, id, token);
            toast.success("Role updated successfully");
        } catch (e) {
            toast.error(e);
        }
        setSelectedRowId(null);
        setRole('');
    }

    const handleClick = (id) => {
        navigate(`/student/${id}`)
    }


    const fetchData = async () => {
        try {
            setIsLoading(true)
            const response = await studentsData(`page=${page}&limit=${limit}&name=${filter.name}&email=${filter.email}`, token)
            let { totalPage, totalDocuments } = response.data;
            setStudentList(response.data.data)
            setTotalPages(+totalPage)
            setTotalDocuments(+totalDocuments)
            setIsLoading(false)
        } catch (error) {
        }
    }


    const handleEmailSend = (email) => {
        window.location.href = `mailto:${email}`;
    }



    const handlesendEmail = async (mailData) => {
        try {
            if ((mailData.subject === '' || null) || (mailData.body === '' || null)) {
                return toast.error("Enter required fields")
            }
            const payload = { ...mailData, studentIds: checkedUsers }
            setOpen(false)
            const loadingToast = toast.loading("Sending emails to selected users")
            const response = await sendEmail(payload, token)
            toast.dismiss(loadingToast)
            toast.success("Emails sent successfully")
            setCheckedUsers({})
        } catch (error) {
        }
    }


    const fetchCourseData = async () => {
        try {
            const response = await getCourseData()
            setCoursedata(response.data.data)
        } catch (error) {
        }
    }

    const deleteUser = async (id, name) => {
        Swal.fire({
            title: `Delete ${name}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await DeleteUserService(id, token);
                    toast.success("Deleted successfully");
                    fetchData();
                } catch (e) {
                    toast.error(e);
                }
            }
        });

    }

    const handleEmailDialogOpen = () => {
        setOpen(true)
    }

    useEffect(() => {
        const rows = studentList.map((item, index) => {
            return {
                name: item.name,
                email_id: item.email,
                last_login: item.lastLogin,
                joined: item.joined,
                role: item.role,
                id: item._id,
            }
        });
        setRows([...rows]);
    }, [studentList]);

    useEffect(() => {
        const columns = [
            {
                field: 'enrolled-courses',
                headerName: 'COURSES',
                width: 100,
                renderCell: (params) => (
                    <IconButton sx={{ color: 'rgb(77, 135, 51)' }} onClick={() => handleClick(params.id)}>
                        <Link style={{ color: 'rgb(77, 135, 51)', textDecoration: "none" }} to="/"><VisibilityIcon /></Link>
                    </IconButton>
                ),
                cellClassName: 'centered-cell', headerClassName: styles.tableHeader
            },
            { field: 'name', headerName: 'NAME', cellClassName: 'centered-cell', width: 150, editable: true, headerClassName: styles.tableHeader },
            { field: 'email_id', headerName: 'EMAIL', cellClassName: 'centered-cell', width: 200, editable: true, headerClassName: styles.tableHeader },
            { field: 'last_login', headerName: 'LAST LOGIN', cellClassName: 'centered-cell', width: 150, editable: true, headerClassName: styles.tableHeader },
            { field: 'joined', headerName: 'JOINED', cellClassName: 'centered-cell', width: 150, editable: true, headerClassName: styles.tableHeader },
            {
                field: 'role',
                headerName: 'ROLE',
                width: 150,
                renderCell: (params) => (
                    <FormControl variant="standard" sx={{ minWidth: 120 }}>
                        <Select
                            value={params.value}
                            defaultValue={'user'}
                            onChange={(event) => handleRoleChange(event.target.value, params.id)}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                ),
                cellClassName: 'centered-cell', headerClassName: styles.tableHeader
            },
            {
                field: 'update',
                headerName: 'UPDATE',
                width: 100,
                renderCell: (params) => (
                    <IconButton sx={{ color: "rgb(77, 135, 51)" }}>
                        <SaveIcon onClick={() => {
                            roleUpdate(params.id);
                        }} />
                    </IconButton>
                ),
                cellClassName: 'centered-cell',
                headerClassName: styles.tableHeader
            },
            {
                field: 'email',
                headerName: 'EMAIL',
                width: 100,
                renderCell: (params) => (

                    <IconButton sx={{ color: "rgb(77, 135, 51)" }}>
                        <EmailIcon onClick={() => {
                            handleEmailSend(params.row.email_id)
                        }} />
                    </IconButton>
                ),
                cellClassName: 'centered-cell',
                headerClassName: styles.tableHeader
            },
            {
                field: 'delete',
                headerName: 'DELETE',
                width: 100,
                renderCell: (params) => (

                    <IconButton sx={{ color: "#e42409" }}>
                        <DeleteIcon onClick={() => {
                            deleteUser(params.id, params.row.name)
                        }} />
                    </IconButton>
                ),
                cellClassName: 'centered-cell',
                headerClassName: styles.tableHeader
            },
        ];
        setColumns(columns);
    }, [studentList]);

    useEffect(() => {
        fetchCourseData()
    }, [])

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton style={{ color: 'rgb(77, 135, 51)' }} />
                <GridToolbarFilterButton style={{ color: 'rgb(77, 135, 51)' }} />
                <GridToolbarDensitySelector style={{ color: 'rgb(77, 135, 51)' }} />
                <GridToolbarExport style={{ color: 'rgb(77, 135, 51)' }} />
            </GridToolbarContainer>
        )
    }
    const handleAddStudentDialogOpen = () => {
        setIsAddStudentDialogOpen(true);
    };
    const handleAddStudentDialogClose = () => {
        setIsAddStudentDialogOpen(false);
    };


    const handleSelectionModelChange = (newSelection) => {

        setRowSelectionModel(newSelection);
        const selectedIds = newSelection


        setCheckedUsers((prevCheckedUsers) => {

            const newCheckedUsers = { ...prevCheckedUsers };

            selectedIds.forEach((id) => {
                if (!newCheckedUsers[id]) {
                    newCheckedUsers[id] = true; // Add to the array if not already present
                } else {
                    delete newCheckedUsers[id]; // Remove from the array if already present
                }
            });
            return newCheckedUsers;
        });

    };

    useEffect(() => {
        fetchData()
    }, [page, limit])

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <Grid
                container
                spacing={1}
                sx={{ mt: 2, }}
            >
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }} className={styles.TitleDiv}>
                    <Grid item xs={6} sm={6} md={11} lg={8}>
                        <h1 className={styles.Title}>
                            Users
                        </h1>
                    </Grid>
                    <Grid item xs={6} sm={6} md={1.5} lg={3} className={styles.BtnDiv}>
                        <Button variant="contained"
                            style={{ backgroundColor: 'Green', color: 'white', fontSize: '.8rem' }}
                            size="large" onClick={handleEmailDialogOpen}>Send Email</Button>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: 'Green', color: 'white' }}
                            size="large"
                            onClick={handleAddStudentDialogOpen}
                        >
                            Add Student
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={6} md={1.5} lg={3} className={styles.BtnDivfor520px}>
                        <Button startIcon={<EmailIcon />} onClick={handleEmailDialogOpen} variant='outlined' size='small' sx={{
                            color: "rgb(77, 135, 51)",
                            border: '1px solid rgb(77, 135, 51)'
                        }}>
                            Email
                        </Button>
                        <Button startIcon={<AddIcon />} onClick={handleAddStudentDialogOpen} variant='outlined' size='small' sx={{
                            color: "rgb(77, 135, 51)",
                            border: '1px solid rgb(77, 135, 51)'
                        }}>
                            Add
                        </Button>
                    </Grid>
                </div>
                <Grid item xs={12} sm={12} md={11.5}>
                    <Paper elevation={10} sx={{ padding: "10px" }}>
                        <DataGrid
                            disableSelectionOnClick={true}
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            slots={{
                                toolbar: CustomToolbar
                            }}
                            stickyHeader
                            checkboxSelection
                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                handleSelectionModelChange(newRowSelectionModel)
                            }}
                            rowSelectionModel={rowSelectionModel}
                        />
                    </Paper>
                </Grid>
            </Grid>
            {
                isAddStudentDialogOpen ? <AddStudentDialog
                    open={isAddStudentDialogOpen}
                    onClose={handleAddStudentDialogClose}
                    fetchData={fetchData}
                    courseData={courseData.courses}
                /> : <></>
            }
            {
                open && <SendMailDialogSlide open={open} setOpen={setOpen} handlesendEmail={handlesendEmail} />
            }
        </>
    )
}

/** Add Student Dialog. */
const generateUniqueId = () => {
    return Math.floor(Math.random() * 1000000); // Simple unique ID generation
};

const AddStudentDialog = ({ open, onClose, fetchData, courseData }) => {
    const [showLoader, setShowLoader] = React.useState(false);
    const [showHideSections, setShowHideSections] = React.useState(true);
    const [enrollCheckbox, setEnrollCheckbox] = React.useState(false);
    const [confirmCheckbox, setConfirmCheckbox] = React.useState(false);
    const [fieldSets, setFieldSets] = useState([{ id: generateUniqueId() }]);
    const [selectedCoursesID, setSelectedCoursesID] = React.useState([]);
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const { userdata } = useAuth()
    const token = userdata.token;

    const handleAddFieldSet = () => {
        const newFieldSet = { id: generateUniqueId() };
        setFieldSets([...fieldSets, newFieldSet]);
    };

    const handleRemoveFieldSet = (id) => {
        const updatedFieldSets = fieldSets.filter((fieldSet) => fieldSet.id !== id);
        setFieldSets(updatedFieldSets);
    };

    const handleCSVupload = async (e) => {
        const loader = toast.loading("Uploading File")
        const file = e.target.files[0]
        if (!file) {
            return toast.error("No file selected")
        }

        const formData = new FormData();
        formData.append("csvFile", file)
        try {
            if (file) {
                onClose()
                const response = await ImportCSV(formData, token)
                toast.dismiss(loader)
                toast.success(response.data.msg)
                fetchData();
            }
        } catch (error) {
            toast.dismiss(loader)
            toast.error(error.data.error)
        }
    }

    const addStudentsManually = async () => {
        const students = fieldSets.map(fieldSet => {
            return {
                name: fieldSet.name || '',
                email: fieldSet.email || '',
                password: fieldSet.password,
            }
        });
        const request = {
            students,
            courses: selectedCoursesID
        }

        try {
            const response = await AddStudentManually(request, token);
            console.log(response)
            if (response.data.errors.length > 0) {
                response.data.errors.map((el) => {
                    return toast.error(el.error)
                })
            }
            toast.success(response.data.msg);
            onClose();
            fetchData();
        }
        catch (e) {
            console.log(e)
            toast.error("Error");
        }

    }

    const handleInputChange = (id, field, value) => {
        const updatedFieldSets = fieldSets.map((fieldSet) => {
            if (fieldSet.id === id) {
                return {
                    ...fieldSet,
                    [field]: value,
                };
            }
            return fieldSet;
        });
        setFieldSets(updatedFieldSets);
    };

    const handleAutocompleteCourseName = (event, value) => {
        setSelectedCoursesID(value.map(data => data._id));
    }

    return <>
        <Dialog
            open={open}
            onClose={() => { onClose(); }}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle><span style={{ fontFamily: "roboto" }}>Add Students</span></DialogTitle>
            <DialogContent>
                <Button onClick={() => { setShowHideSections(false) }}>Import CSV</Button>
                <Button onClick={() => { setShowHideSections(true) }}> Manually</Button>

                <Grid container mt={2} spacing={1}>
                    {
                        showHideSections === true ?
                            <>
                                <div>
                                    {fieldSets.map((fieldSet) => (
                                        <Grid key={`fieldSet-${fieldSet.id}`} container spacing={1} sx={{ mb: 1 }}>
                                            <Grid item sm={12} xs={12} md={3.6}>
                                                <TextField
                                                    label="Name"
                                                    variant="outlined"
                                                    fullWidth size="small"
                                                    value={fieldSet.name}
                                                    onChange={(e) => handleInputChange(fieldSet.id, 'name', e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item sm={12} xs={12} md={3.6}>
                                                <TextField
                                                    label="Email"
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    onChange={(e) => handleInputChange(fieldSet.id, 'email', e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item sm={12} xs={12} md={3.6}>
                                                <TextField
                                                    type="password"
                                                    label="Password"
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    onChange={(e) => handleInputChange(fieldSet.id, 'password', e.target.value)}
                                                />
                                            </Grid>
                                            {fieldSets.length > 1 && (
                                                <Grid item xs={12} sm={12} md={1.19}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <IconButton onClick={() => handleRemoveFieldSet(fieldSet.id)}>
                                                            <ClearIcon style={{ fontSize: 30 }} />
                                                        </IconButton>
                                                    </div>
                                                </Grid>
                                            )}
                                        </Grid>
                                    ))}
                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '10px' }}>
                                        <Typography>Add another</Typography>
                                        <IconButton onClick={() => { handleAddFieldSet() }}>
                                            <AddIcon style={{ fontSize: 30 }} />
                                        </IconButton>
                                    </div>
                                </div>
                                <hr style={{ width: "100%" }} />
                                <FormControlLabel
                                    control={<Checkbox onChange={(e) => { setEnrollCheckbox(e.target.checked); }} checked={enrollCheckbox} />}
                                    label="Enroll these students into a product"
                                    sx={{ marginLeft: "-4px" }}
                                />
                                <Autocomplete
                                    multiple
                                    limitTags={2}
                                    options={courseData}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option.title}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {option.title}
                                        </li>
                                    )}
                                    style={{ width: "100%", marginTop: "15px" }}
                                    renderInput={(params) => (
                                        <TextField {...params} placeholder="Select Courses" />
                                    )}
                                    onChange={handleAutocompleteCourseName}
                                />
                                <FormControlLabel
                                    sx={{
                                        marginTop: "10px",
                                        padding: "10px"
                                    }}
                                    control={<Checkbox onChange={(e) => { setConfirmCheckbox(e.target.checked); }} checked={confirmCheckbox} />}
                                    label="I confirm these users have consented to receiving emails from my school"
                                />
                            </>
                            : <></>
                    }
                    {
                        showHideSections === false ? <Grid container sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "20px"
                        }}>
                            <Box>
                                <Grid item md={12} sm={12} xs={12}
                                    fullWidth
                                >
                                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                        Import CSV
                                        <VisuallyHiddenInput type="file" accept=".csv" onChange={handleCSVupload} />
                                    </Button>
                                </Grid>
                            </Box>
                        </Grid>
                            :
                            <></>
                    }
                    {
                        showLoader ?
                            <Typography sx={{ mt: "2px" }}>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <CircularProgress color="primary" size={50} thickness={4} />
                                </div>
                            </Typography>
                            :
                            <></>
                    }
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    sx={{ fontFamily: "roboto" }}
                    onClick={addStudentsManually}
                >
                    Import
                </Button>
                <Button
                    color="primary"
                    onClick={onClose}
                    sx={{ fontFamily: "roboto" }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    </>
}

const SendMailDialogSlide = ({ open, setOpen, handlesendEmail }) => {
    const [mailData, setMailData] = useState({
        subject: '',
        body: ''
    })

    const handleSetMailData = (e) => {
        const { name, value } = e.target;
        setMailData({ ...mailData, [name]: value })
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleSend = () => {
        if (mailData.subject === null || mailData.body === null) {
            return toast.error("Please fill all fields")
        }
        handlesendEmail(mailData)
        handleClose()
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                sx={{
                    border: '1px solid red'
                }}
            >
                <DialogTitle>{"Send Email to selected students"}</DialogTitle>
                <DialogContent  className={styles.EmailDialogContent}>
                    <DialogContentText id="alert-dialog-slide-description">
                        <TextField variant='standard' label='Subject' fullWidth name='subject' value={mailData.subject} onChange={handleSetMailData}></TextField>
                        <textarea className={styles.EmailBodyTextarea} placeholder='Email Body' name='body' onChange={handleSetMailData}></textarea>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSend} >Send</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default Students 
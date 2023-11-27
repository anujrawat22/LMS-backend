import React, { useEffect, useState } from 'react';
import styles from './Students.module.css';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { studentsData } from '../../services/studentdata.service';
import { CircularProgress, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CSVDownload } from '../../services/csvDownload.service';
import { sendEmail } from '../../services/sendEmail.service';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../Contexts/AuthContext';

const Students = () => {
    const navigate = useNavigate()
    const { userdata } = useAuth()
    const token = userdata.token;
    const [studentList, setStudentList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalDocuments, setTotalDocuments] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [filter, setFilter] = useState({ name: '', email: '' })
    const [checkedUsers, setCheckedUsers] = useState({});
    const [open, setOpen] = useState(false)
    const [emailContent, setEmailContent] = useState({ subject: '', content: '' })
    const handleClick = (id) => {
        navigate(`/student/${id}`)
    }

    const handleLimitChange = (e) => {
        setLimit(+e.target.value)
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
            console.log(error)
        }
    }

    const handleClearClick = async () => {
        setFilter({ ...filter, name: '', email: '' })
        setLimit(10)
        setIsLoading(true);
        fetchData()
    }

    let debounceTimer;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFilter({ ...filter, [name]: value });

        if (debounceTimer) {
            clearTimeout(debounceTimer)
        }

        debounceTimer = setTimeout(() => {
            fetchData()
        }, 1000)
    }


    const handlecsvDownload = async () => {
        try {
            const response = await CSVDownload(`page=${page}&limit=${limit}&name=${filter.name}&email=${filter.email}`)
            const blob = new Blob([response.data], { type: 'text/csv' });

            // Create a download link and trigger the download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'user_data.csv'; // Specify the file name
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading CSV:', error);
        }
    }

    const handleEmailSend = (email) => {
        window.location.href = `mailto:${email}`;
    }

    const handleCheckboxChange = (id) => {
        setCheckedUsers((prevCheckedUsers) => ({
            ...prevCheckedUsers,
            [id]: !prevCheckedUsers[id],
        }));
    }

    const handleSelectAll = (e) => {
        const selectAll = e.target.checked;
        const newCheckedUsers = {};

        if (selectAll) {
            studentList.forEach((item) => {
                newCheckedUsers[item._id] = true;
            });
        }

        setCheckedUsers(newCheckedUsers);
    }

    const areAllUsersChecked = () => {
        if (studentList.length === 0) {
            return false; // No users, so they can't all be checked
        }
        // Check if all users in studentList have corresponding checked state in checkedUsers
        return studentList.every((item) => checkedUsers[item._id]);
    }

    const handleEmailContentChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        setEmailContent({ ...emailContent, [name]: value })
    }

    const handlesendEmail = async () => {
        try {

            if ((emailContent.subject === '' || null) || (emailContent.content === '' || null)) {
                toast.error("Enter required fields")
                return;
            }
            const payload = { ...emailContent, studentIds: checkedUsers }
            setOpen(false)
            const loadingToast = toast.loading("Sending emails to selected users")
            const response = await sendEmail(payload)
            console.log(response)
            toast.dismiss(loadingToast)
            toast.success("Emails sent successfully")
            setEmailContent({ subject: '', content: '' })
            setCheckedUsers({})
        } catch (error) {
            console.log(error)
        }
    }

    const handleCheckUsers = () => {
        const selectedUsers = Object.keys(checkedUsers).filter(userId => checkedUsers[userId])

        if (selectedUsers.length === 0) {
            toast.error("Select at least one user to send an email")
            return;
        }
        setOpen(true)
    }


    useEffect(() => {
        fetchData()
    }, [page, limit])

    return (
        <div className={styles.mainDiv}>
            <div className={styles.headingDiv}>
                <h1 style={{ color: '#4d8733' }}>Students</h1>
                <div className={styles.buttonGroup}>
                    <button className={styles.normalbtn} onClick={handlecsvDownload}>Export CSV</button>
                    <button className={styles.normalbtn} onClick={handleCheckUsers}>Email Students</button>
                    <button className={styles.coloredbtn}>Add Students</button>
                </div>
            </div>
            <div className={styles.filterDiv}>
                <div className={styles.searchDiv}>
                    <div className='form-input'>
                        <input type="text" name='name' placeholder='Name' id='name' onInput={handleChange} className='form__field' value={filter.name} />
                        <label htmlFor="name" className='form__label'>Name</label>
                    </div>
                    <div className='form-input'>

                        <input type="text" name='email' placeholder='Email' id='email' onInput={handleChange} value={filter.email} />
                        <label htmlFor="email">Email address</label>
                    </div>
                </div>
                <div className={styles.limitDiv}>
                    <div className={styles.Limitcontainer}>
                        <p>Limit</p>
                        <select name="limit" id="limit" onChange={handleLimitChange} className={styles.select}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                    <button className={styles.Clearbtn} onClick={handleClearClick}>Clear</button>
                </div>
            </div>
            {
                isLoading ? <div className={styles.loadingDiv}>
                    <CircularProgress color="inherit" /></div> :
                    <div className={styles.StudentList}>
                        <table >
                            <thead>
                                <th><input type="checkbox" className={styles.checkbox} onChange={handleSelectAll}
                                    checked={areAllUsersChecked()} /></th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>LAST LOGIN</th>
                                <th>JOINED</th>
                                <th></th>
                            </thead>
                            <tbody>
                                {
                                    studentList.length > 0 && studentList.map((item) => {
                                        return (
                                            <tr key={item._id} >
                                                <td><input type="checkbox"
                                                    className={styles.checkbox}
                                                    checked={checkedUsers[item._id] || false}
                                                    onChange={() => handleCheckboxChange(item._id)}
                                                /></td>
                                                <td onClick={() => handleClick(item._id)}>{item.name}</td>
                                                <td onClick={() => handleClick(item._id)}>{item.email}</td>
                                                <td onClick={() => handleClick(item._id)}>{item.lastLogin}</td>
                                                <td onClick={() => handleClick(item._id)}>{item.joined
                                                }</td>
                                                <td><button className={styles.emailBtn} onClick={() => handleEmailSend(item.email)}>
                                                    <EmailOutlinedIcon />
                                                </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <div className={styles.PaginationDiv}>
                            <div>
                                <p className={styles.info}>{`Showing ${Math.min((page - 1) * limit + 1, totalDocuments)} - ${Math.min(page * limit, totalDocuments)} of ${totalDocuments}`}</p>
                            </div>
                            <div>
                                <Pagination count={totalPages} page={page} color="primary" onChange={(e, value) => {
                                    setPage(value)
                                }
                                } />
                            </div>
                            <div>
                                <p className={styles.info}>{`page ${page} of ${totalPages}`}</p>
                            </div>
                        </div>
                    </div>
            }

            <div className={styles.emailModal} style={{ display: open ? 'flex' : 'none' }}>
                <div className={styles.cancelbtnDiv}><CancelOutlinedIcon onClick={() => setOpen(false)} /></div>
                <div className={styles.modelContentDiv}>
                    <div>
                        <h1 className={styles.emailModalHeading}>Write Email</h1>
                    </div>
                    <div className='form-input'>
                        <input type="text" name="subject" id="subject" placeholder='Enter Subject*' value={emailContent.subject} onChange={handleEmailContentChange} />
                        <label htmlFor="subject">Enter Subject*</label>
                    </div>
                    <div className='form-input'>
                        <textarea name="content" id="content" cols="30" rows="10" placeholder='Enter Content*' value={emailContent.content} onChange={handleEmailContentChange}></textarea>
                    </div>
                    <div className={styles.sendEmailbtnDiv}>
                        <button className={styles.sendEmailbtn} onClick={handlesendEmail}>Send Email</button>
                    </div>
                </div>
            </div>
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
        </div>
    )
}

export default Students 
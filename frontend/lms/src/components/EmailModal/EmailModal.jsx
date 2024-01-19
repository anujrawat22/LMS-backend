import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import toast, { Toaster } from 'react-hot-toast'
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { sendVerificationEmail } from '../../services/emailVerification.service';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    height: 200,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    borderRadius: '10px'
};

const EmailModal = ({ open, setOpen }) => {
    const [email, setEmail] = useState('')
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleResendVerificationLink = async () => {
        if (!email || email === ' ') return toast.error("Email is required")
        const loading = toast.loading('Sending Verification Email')
        try {
            const response = await sendVerificationEmail({ email })
            toast.dismiss(loading)
            toast.success(response.data.msg)
        } catch (error) {
            toast.error(error.response.data.error)
        } finally {
            toast.dismiss(loading)
            setOpen(false)
        }
    }

    return (
        <div>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <TextField fullWidth onChange={handleEmailChange} value={email} label="Email"
                        type="email"
                        inputMode="email"  // This helps mobile devices to show the appropriate keyboard
                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        required />
                    <Button sx={{
                        backgroundColor: '#ff9a01',
                        color: 'white',
                        ':hover': {
                            color: 'black'
                        }
                    }}
                        onClick={handleResendVerificationLink}
                    >Send Link</Button>
                </Box>
            </Modal>
        </div>
    );
}

export default EmailModal
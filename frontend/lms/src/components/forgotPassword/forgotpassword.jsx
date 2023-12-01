import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import bg from "../../assets/signin.svg";
import bgimg from "../../assets/bgimg.jpg";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ResetPassword } from "../../services/resetPassword.service";
import toast, { Toaster } from 'react-hot-toast';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRef } from "react";
import { VerifyOtp } from "../../services/verifyOtp.service";
import { forgetPassword } from "../../services/forgetPassword.service";
import styles from './forgotpassword.module.css'


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});



const center = {
    position: "relative",
    top: "50%",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    flexDirection: "column",
    alignItems: "center"
};

export default function ForgetPassword() {
    const [open, setOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('')
    const navigate = useNavigate();
    const [isOtpSend, setIssendOtp] = useState(false)
    const [isotpverified, setIsotpverified] = useState(true)
    const [Password, setpassword] = useState({
        newPassword: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmPassword: false
    })
    const [passwordBtn, setpasswordBtn] = useState(false)


    const handleSubmit = async (event) => {
        setIssendOtp(true)
        const loader = toast.loading("Sending OTP")
        let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
        if (!emailRegex.test(userEmail)) {
            toast.dismiss(loader)
            setIssendOtp(false)
            return toast.error("Invalid Email address")
        }
        try {
            const response = await forgetPassword({ email: userEmail })
            toast.dismiss(loader)
            toast.success(response.data.msg)
            setOpen(true)
        } catch (error) {
            toast.dismiss(loader)
            setIssendOtp(false)
            toast.error(error.response.data.error)

        }
    };

    const Otpverification = async (otp) => {
        console.log(otp)
        const loader = toast.loading("Verifying OTP")
        try {
            const payload = { enteredOTP: otp, email: userEmail }
            const response = await VerifyOtp(payload)
            toast.dismiss(loader)
            toast.success("OTP verified")
            setOpen(false)
            setIsotpverified(true)
        } catch (error) {
            toast.dismiss(loader)
            toast.error("Invalid OTP")
        }
    }

    const handleEmailChange = (e) => {
        setUserEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setpassword({ ...Password, [name]: value })
    }

    const changeVisibility = (name) => {
        setShowPassword({ ...showPassword, [name]: !showPassword[name] })
    }


    const handleChangePassword = async () => {
        setpasswordBtn(true)
        if (Password.newPassword.length < 8) {
            setpasswordBtn(false)
            return toast.error("Password must contain 8 characters")
        }

        if (Password.newPassword !== Password.confirmPassword) {
            setpasswordBtn(false)
            return toast.error("Passwords don't match")
        }

        try {
            const payload = { email: userEmail, newPassword: Password.newPassword }
            const response = await ResetPassword(payload)
            toast.success(response.data.msg)
            setTimeout(() => {
                navigate('/login')
            }, 1000)
        } catch (error) {
            setpasswordBtn(false)
            toast.error(error.response.data.error)
        }
    }

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <div
                className={styles.MainContainer}
                style={{
                    backgroundImage: `url(${bgimg})`,
                    backgroundSize: "cover",
                    height: "100vh",
                    color: "#f5f5f5",
                    overflow: 'auto',
                }}
            >
                <Box className={styles.Box}>
                    <Grid container sx={{
                        backgroundColor: 'rgb(59,51,213)'
                    }}>
                        <Grid item xs={0} sm={0} lg={6} md={6} >
                            <Box
                                style={{
                                    backgroundImage: `url(${bg})`,
                                    backgroundSize: "cover",
                                    backgroundColor: 'white',
                                    height: "100%",
                                    color: "#f5f5f5",
                                    backgroundRepeat: 'no-repeat',
                                    boxSizing: 'border-box'
                                }}
                            ></Box>
                        </Grid>
                        {isotpverified ?
                            <Grid item xs={12} sm={12} lg={6} md={6} >
                                <Box
                                    style={{
                                        backgroundSize: "cover",
                                        height: "100%",
                                        minHeight: "500px",
                                        backgroundColor: "#3b33d5",
                                    }}
                                >
                                    <ThemeProvider theme={darkTheme}>
                                        <Container className={styles.SendotpContainer}>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%'
                                            }}>
                                                <Avatar
                                                    sx={{ bgcolor: "#ffffff" }}
                                                >
                                                    <LockOutlinedIcon />
                                                </Avatar>
                                                <Typography component="h1" variant="h4" textAlign={center} sx={{
                                                    padding: '10px'
                                                }}>
                                                    Change Password
                                                </Typography>
                                            </Box>
                                            <Grid container className={styles.inputGrid}>
                                                <Grid item xs={12} sx={{
                                                    padding: '10px 0px'
                                                }}>
                                                    <FormControl sx={{ width: '100%', marginBottom: '10px' }} variant="outlined">
                                                        <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-password"
                                                            type={showPassword.newPassword ? 'text' : 'password'}
                                                            value={Password.newPassword} onChange={handlePasswordChange}
                                                            name="newPassword"
                                                            endAdornment={
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label="toggle password visibility"
                                                                        edge="end"
                                                                        onClick={() => changeVisibility('newPassword')}
                                                                    >
                                                                        {showPassword.newPassword ? <Visibility /> : <VisibilityOff />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            }
                                                            label="Password"
                                                        />
                                                    </FormControl>
                                                    <FormControl sx={{ width: '100%' }} variant="outlined">
                                                        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-password"
                                                            type={showPassword.confirmPassword ? 'text' : 'password'}
                                                            value={Password.confirmPassword} onChange={handlePasswordChange}
                                                            name="confirmPassword"
                                                            endAdornment={
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label="toggle password visibility"
                                                                        onClick={() => changeVisibility('confirmPassword')}
                                                                        edge="end"
                                                                    >
                                                                        {showPassword.confirmPassword ? <Visibility /> : <VisibilityOff />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            }
                                                            label="Password"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sx={{
                                                    fontSize: '13px',
                                                    padding: '10px 10px'
                                                }}>
                                                    Login to your Account.
                                                    <Link href="#" variant="body2" to="/login" style={{ color: "white" }}>
                                                        Sign In
                                                    </Link>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button
                                                        variant="contained"
                                                        fullWidth="true"
                                                        size="large"
                                                        sx={{
                                                            borderRadius: 28,
                                                            color: "#ffffff",
                                                            minWidth: "170px",
                                                            backgroundColor: "#FF9A01",
                                                        }}
                                                        disabled={passwordBtn}
                                                        onClick={handleChangePassword}
                                                    >
                                                        Change Password
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <Grid item xs={12} >
                                                        <Grid container justifyContent="flex-end">

                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Container>
                                    </ThemeProvider>
                                </Box>
                            </Grid>
                            : <Grid item xs={12} sm={12} lg={6} md={6} >
                                <Box
                                    style={{
                                        backgroundSize: "cover",
                                        height: "100%",
                                        minHeight: "500px",
                                        backgroundColor: "#3b33d5",
                                    }}
                                >
                                    <ThemeProvider theme={darkTheme}>
                                        <Container className={styles.SendotpContainer} >
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%'
                                            }}>
                                                <Avatar
                                                    sx={{ bgcolor: "#ffffff" }}
                                                >
                                                    <LockOutlinedIcon />
                                                </Avatar>
                                                <Typography component="h1" variant="h4" textAlign={center} sx={{
                                                    padding: '10px'
                                                }}>
                                                    Reset Password
                                                </Typography>
                                            </Box>
                                            <Grid container className={styles.inputGrid}>
                                                <Grid item xs={12} sx={{
                                                    padding: '10px 0px'
                                                }}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        id="email"
                                                        label="Email"
                                                        name="email"
                                                        autoComplete="email"
                                                        value={userEmail}
                                                        onChange={handleEmailChange}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sx={{
                                                    fontSize: '11px',
                                                    padding: '10px'
                                                }}>
                                                    Already have an account ?
                                                    <Link href="#" variant="body2" to="/login" style={{ color: "white", fontSize: '14px', marginLeft: '10px' }}>
                                                        Sign In
                                                    </Link>
                                                </Grid>

                                                <Grid item xs={12} >
                                                    <Button
                                                        onClick={handleSubmit}
                                                        variant="contained"
                                                        fullWidth="true"
                                                        size="large"
                                                        sx={{
                                                            borderRadius: 28,
                                                            color: "#ffffff",
                                                            minWidth: "170px",
                                                            backgroundColor: "#FF9A01",
                                                        }}
                                                        disabled={isOtpSend}
                                                    >
                                                        Send OTP
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Container>
                                    </ThemeProvider>
                                </Box>
                            </Grid>}
                    </Grid>
                </Box>
            </div >
            {
                open && < OTPDialog open={open} setOpen={setOpen} setIssendOtp={setIssendOtp} Otpverification={Otpverification} />
            }
        </>
    );
}

function OTPDialog({ open, setOpen, setIssendOtp, Otpverification }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const firstOtpInputRef = useRef(null);
    const handleClose = () => {
        setOpen(false);
        setIssendOtp(false)
    };

    const handleOtpChange = (index, value) => {
        setOtp((prevOtp) => {
            const newOtp = [...prevOtp];
            newOtp[index] = value;
            return newOtp;
        });

        if (value !== '' && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };


    const isOtpComplete = otp.every((digit) => digit !== '');

    const handleVerifyOtp = () => {
        const enteredOtp = otp.join('');
        Otpverification(enteredOtp)
    };

    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace' && index > 0) {
            setOtp((prevOtp) => {
                const newOtp = [...prevOtp];
                newOtp[index] = ''
                document.getElementById(`otp-${index - 1}`).focus();
                return newOtp
            })
        }
    };



    return (
        <>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Enter OTP
                </DialogTitle>
                <DialogContent dividers>
                    <Typography >
                        Please enter the 6-digit OTP sent to your email.
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'center', height: '60px', margin: '30px 0px' }}>
                        {otp.map((digit, index) => (
                            <TextField
                                key={index}
                                margin="dense"
                                id={`otp-${index}`}
                                type="text"
                                fullWidth
                                inputProps={{
                                    maxLength: 1,
                                    pattern: '[0-9]',
                                }}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                style={{ margin: '0 5px', width: '40px', height: '40px' }}
                                onKeyDown={(e) => handleBackspace(e, index)}
                                ref={index === 0 ? firstOtpInputRef : null}
                            />
                        ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleVerifyOtp} variant="contained" disabled={!isOtpComplete}>
                        Verify OTP
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    );
}
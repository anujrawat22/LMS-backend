import React from 'react'
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import bg from "../../assets/signin.svg";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { UserLogin } from "../../services/login.service";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../Contexts/AuthContext";
import styles from './Login.module.css';
import { generateLoginOTP } from '../../services/generateLoginOTP.service';
import ResponsiveMuiOtpInput from '../../components/ResponsiveMuiOtpInput/ResponsiveMuiOtpInput';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { resendOTP } from '../../services/resendOtp.service';

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


const Login = () => {
    const auth = useAuth()
    const { login } = auth;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: ''
    })
    const [isDisabled, setIsDisabled] = useState(false)
    const [isVerifyButtonDisabled, setVerifyButtonDisabled] = useState(true)
    const [isOTPSent, setIsOtpSent] = useState(false)
    const [otp, setOtp] = useState('')

    const handleSignin = async (e) => {
        e.preventDefault()
        const email = formData.email.trim(" ")
        const loader = toast.loading("Signing In")
        try {
            const response = await UserLogin({ email, otp })
            if (response.status === 200) {
                const { name, role, avatar } = response.data.loggedInUser;
                login(name, role, avatar)
                toast.dismiss(loader)
                if (role === 'superadmin' || role === 'admin') {
                    navigate('/admin/dashboard')
                } else if (role === 'user') {
                    navigate('/courses')
                }
                setIsOtpSent(false)
                setFormData({
                    email: ''
                })
                setOtp('')
                setVerifyButtonDisabled(true)
            }
        } catch (error) {
            toast.dismiss(loader)
            toast.error(error.response.data.error)
        }
    }

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleGenerateLoginOTP = async (e) => {
        e.preventDefault();
        const email = formData.email.trim(' ');
        if (!isValidEmail(email)) {
            return toast.error('Please enter a valid email address');
        }

        setIsDisabled(true);
        const toastPromise = toast.loading('Sending Login OTP');
        try {
            const response = await generateLoginOTP({ email });
            toast.dismiss(toastPromise);
            toast.success(response.data.msg);
            setIsOtpSent(true);

        } catch (error) {
            toast.dismiss(toastPromise);
            toast.error(error.response.data.error);
        } finally {
            setIsDisabled(false);
        }
    };

    const handleresendOTP = async (e) => {
        e.preventDefault();
        const email = formData.email.trim(' ');
        if (!isValidEmail(email)) {
            return toast.error('Please enter a valid email address');
        }


        setIsDisabled(true);
        const toastPromise = toast.loading('Sending Login OTP');
        try {
            const response = await resendOTP({ email });
            toast.dismiss(toastPromise);
            toast.success(response.data.msg);
            setIsOtpSent(true);


        } catch (error) {
            toast.dismiss(toastPromise);
            toast.error(error.response.data.error);
        } finally {
            setIsDisabled(false);
        }
    };


    const handleOTPChange = (newValue) => {
        if (otp.length !== 6) {
            setVerifyButtonDisabled(true)
        }
        setOtp(newValue)
    }

    const handleComplete = () => {
        setVerifyButtonDisabled(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    return (
        <div
            className={styles.Container}
        >
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <Box className={styles.LoginMainContainer}>
                <Grid container className="image-login-grid-container">
                    <Grid item xs={0} sm={0} lg={6} md={6} className="image-grid-container">
                        <Box
                            style={{
                                backgroundImage: `url(${bg})`,
                                backgroundSize: "cover",
                                color: "#f5f5f5",
                                height: "70%",
                                minHeight: "500px",
                                width: "100%",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat"
                            }}
                        ></Box>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6} md={6}>
                        <Box
                            style={{
                                height: "70%",
                                minHeight: "500px",
                                backgroundColor: "#3b33d5",
                                width: "100%"
                            }}
                        >
                            <ThemeProvider theme={darkTheme}>
                                {isOTPSent ? <Container>
                                    <Box height={35} />
                                    <Box sx={{ mt: 2 }}>
                                        <ArrowBackIcon onClick={() => setIsOtpSent(false)} />
                                    </Box>
                                    <Box sx={center}>
                                        <LockOutlinedIcon />
                                        <Typography component="h1" variant="h4">
                                            Verify OTP
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <form onSubmit={handleSignin}>
                                            <Grid container spacing={1} justifyContent={'center'}>
                                                <Grid item xs={12} sx={{ ml: "2em", mr: "2em" }} lg={8}>
                                                    <ResponsiveMuiOtpInput value={otp} onChange={handleOTPChange} length={6} autoFocus onComplete={handleComplete} />
                                                </Grid>
                                                <Grid item xs={12} sx={{ ml: "2em", mr: "2em" }} lg={8}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        fullWidth
                                                        size="large"
                                                        sx={{
                                                            mt: "10px",
                                                            borderRadius: 28,
                                                            color: "#ffffff",
                                                            backgroundColor: "#FF9A01",
                                                        }}
                                                        disabled={isVerifyButtonDisabled}
                                                    >
                                                        Verify
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} sx={{ ml: "2em", mr: "2em" }} lg={8}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        fullWidth
                                                        size="large"
                                                        sx={{
                                                            mt: "10px",
                                                            borderRadius: 28,
                                                            color: "#ffffff",
                                                            backgroundColor: "#FF9A01",
                                                        }}
                                                        onClick={handleresendOTP}
                                                    >
                                                        Resend OTP
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </Box>
                                </Container> : <Container>
                                    <Box height={35} />
                                    <Box sx={center}>
                                        <Avatar
                                            sx={{ mb: "4px", bgcolor: "#ffffff" }}
                                        >
                                            <LockOutlinedIcon />
                                        </Avatar>
                                        <Typography component="h1" variant="h4">
                                            Sign In
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{ mt: 2 }}
                                    >
                                        <form onSubmit={handleGenerateLoginOTP}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} sx={{ ml: "2em", mr: "2em" }}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        id="email"
                                                        label="Email Id"
                                                        name="email"
                                                        autoComplete="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ ml: "2em", mr: "2em" }}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        fullWidth="true"
                                                        size="large"
                                                        sx={{
                                                            mt: "10px",
                                                            mr: "20px",
                                                            borderRadius: 28,
                                                            color: "#ffffff",
                                                            minWidth: "170px",
                                                            backgroundColor: "#FF9A01",
                                                        }}
                                                        disabled={isDisabled}
                                                    >
                                                        Sign in
                                                    </Button>
                                                </Grid>
                                                <Grid container item xs={12} sx={{ display: "flex" }}>
                                                    <Grid item xs={12} sm={12} md={6} lg={6} sx={{ display: "flex", ml: "2em", mr: "2em" }} >
                                                        Not registered yet? <Link href="#" variant="body2" to="/signup" style={{ color: "white", marginLeft: '10px' }} >
                                                            {"Sign Up"}
                                                        </Link>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={6} lg={6} sx={{ display: "flex", ml: "2em", mr: "2em", mt: "1em" }}>

                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </Box>
                                </Container>}
                            </ThemeProvider>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default Login
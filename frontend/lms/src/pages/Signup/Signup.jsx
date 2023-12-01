
import React from 'react'
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
import toast, { Toaster } from "react-hot-toast";
import { UserSignup } from "../../services/signup.service";
import styles from './Signup.module.css'

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const boxstyle = {
    position: "absolute",
    top: "50%",
    left: "52.5%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    height: "70%",
    bgcolor: "background.paper",
    boxShadow: 24,
};

const center = {
    position: "relative",
    top: "50%",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    flexDirection: "column",
    alignItems: "center"
};
const Signup = () => {
    const navigate = useNavigate();
    const [confirmPassword, setConfirmPassword] = useState('')
    const [formData, setFromData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFromData({ ...formData, [name]: value })
    }
    const handleSubmit = async (event) => {

        event.preventDefault();
        if (formData.password.length < 8) {
            return toast.error("Password should contain at least 8 Characters")
        }

        if (confirmPassword !== formData.password) {
            return toast.error("Password does not match")
        }

        const loader = toast.loading("Registering user")
        try {
            const response = await UserSignup({ ...formData, role: 'user' })
            toast.dismiss(loader)
            toast.success(response.data.msg)
            navigate("/login")
        } catch (error) {
            toast.dismiss(loader)
            return toast.error(error.response.data.error)
        }
    };
    return (
        <>
            <div
                className={styles.SignupMainContainer}
            >
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                />
                <Box className={styles.SignupDiv}>
                    <Grid container>
                        <Grid item xs={0} sm={0} lg={6} md={6} className="image-grid-container">
                            <Box
                                style={{
                                    backgroundImage: `url(${bg})`,
                                    backgroundSize: "cover",
                                    backgroundColor: "#fff",
                                    color: "#f5f5f5",
                                    width: "100%",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    height: "70%",
                                    minHeight: "500px",
                                }}
                            ></Box>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6} md={6}>
                            <Box
                                style={{
                                    backgroundSize: "cover",
                                    height: "auto",
                                    minHeight: "500px",
                                    backgroundColor: "#3b33d5",
                                }}
                                className={styles.SingupFields}
                            >
                                <ThemeProvider theme={darkTheme}>
                                    <Container>
                                        <Box sx={center}>
                                            <Avatar
                                                sx={{ mb: "5px", mt: "20px", bgcolor: "#ffffff" }}
                                            >
                                                <LockOutlinedIcon />
                                            </Avatar>
                                            <Typography component="h1" variant="h4">
                                                Create Account
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{ mt: 2 }}
                                        >
                                            <form onSubmit={handleSubmit}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12} sx={{ ml: "2em", mr: "2em" }}>
                                                        <TextField
                                                            required
                                                            fullWidth
                                                            id="name"
                                                            label="Name"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                        />
                                                    </Grid>
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
                                                    <Grid item xs={12} sx={{ ml: "2em", mr: "2em" }}>
                                                        <TextField
                                                            required
                                                            fullWidth
                                                            name="password"
                                                            label="Password"
                                                            type="password"
                                                            id="password"
                                                            autoComplete="new-password"
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sx={{ ml: "2em", mr: "2em" }}>
                                                        <TextField
                                                            required
                                                            fullWidth
                                                            name="confirmpassword"
                                                            label="Confirm Password"
                                                            type="password"
                                                            id="confirmpassword"
                                                            autoComplete="new-password"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sx={{ ml: "2em", mr: "2em" }}>
                                                        <Button
                                                            type="submit"
                                                            variant="contained"
                                                            fullWidth="true"
                                                            size="large"
                                                            sx={{
                                                                mt: "15px",
                                                                mr: "20px",
                                                                borderRadius: 28,
                                                                color: "#ffffff",
                                                                minWidth: "170px",
                                                                backgroundColor: "#FF9A01",
                                                            }}
                                                        >
                                                            Register
                                                        </Button>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Grid container justifyContent="flex-end">
                                                            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: "flex", ml: "2em", mr: "2em", mt: "1em"}} >
                                                            Already have an account?
                                                                <Link href="#" variant="body3" to="/login" style={{ color: "white" }}>
                                                                     Sign in
                                                                </Link>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </form>
                                        </Box>
                                    </Container>
                                </ThemeProvider>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </>
    )
}

export default Signup
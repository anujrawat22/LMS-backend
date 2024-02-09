
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
import toast, { Toaster } from "react-hot-toast";
import { UserSignup } from "../../services/signup.service";
import styles from './Signup.module.css'

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
const Signup = () => {

    const [formData, setFromData] = useState({
        name: '',
        email: '',
    })

    const [isSigningUp, setIsSigningUp] = useState(false)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFromData({ ...formData, [name]: value })
    }


    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const name = formData.name.trim(" ")
        const email = formData.email.trim(" ")
        const nameRegex = /^[a-zA-Z0-9\s]+$/;

        if (name === '') {
            return toast.error("Name is required");
        }

        if (!nameRegex.test(name)) {
            return toast.error("Name should only contain letters, numbers, or a combination of both");
        }
        if (!isValidEmail(email)) {
            return toast.error("Please enter a valid email address");
        }

        setIsSigningUp(true)

        const loader = toast.loading("Registering user")
        try {
            const response = await UserSignup({ name, email, role: 'user' })
            toast.dismiss(loader)
            toast.success(response.data.msg)
        } catch (error) {
            toast.dismiss(loader)
            return toast.error(error.response.data.error)
        } finally {
            setIsSigningUp(false)
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
                                                            disabled={isSigningUp}
                                                        >
                                                            Register
                                                        </Button>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <Grid container justifyContent="flex-end">
                                                            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: "flex", ml: "2em", mr: "2em", mt: "1em" }} >
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
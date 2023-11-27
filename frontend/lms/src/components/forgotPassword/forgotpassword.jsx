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
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState, forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/resetPassword.service";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const boxstyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
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

export default function ForgetPassword() {
    const [open, setOpen] = useState(false);
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const vertical = "top";
    const horizontal = "right";
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
        if (!emailRegex.test(userEmail)) {
            return setError("Invalid Email address")
        }
        setOpen(true)
        try {
            const response = await resetPassword({ email: userEmail })
            console.log(response.data.msg)
        } catch (error) {
            // setOpen(true)
            console.log(error.response.data.error)
        }
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const handleEmailChange = (e) => {
        setUserEmail(e.target.value);
    }

    function TransitionLeft(props) {
        return <Slide {...props} direction="left" />;
    }

    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                TransitionComponent={TransitionLeft}
                anchorOrigin={{ vertical, horizontal }}
            >
                {error ? <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
                    {error}
                </Alert> : null}
                {successMsg ? <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                    {successMsg}
                </Alert> : null}
            </Snackbar>
            <div
                style={{
                    backgroundImage: `url(${bgimg})`,
                    backgroundSize: "cover",
                    height: "100vh",
                    color: "#f5f5f5",
                }}
            >
                <Box sx={boxstyle}>
                    <Grid container>
                        <Grid item xs={12} sm={12} lg={6}>
                            <Box
                                style={{
                                    backgroundImage: `url(${bg})`,
                                    backgroundSize: "cover",
                                    marginTop: "40px",
                                    marginLeft: "15px",
                                    marginRight: "15px",
                                    height: "63vh",
                                    color: "#f5f5f5",
                                }}
                            ></Box>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6}>
                            <Box
                                style={{
                                    backgroundSize: "cover",
                                    height: "70vh",
                                    minHeight: "500px",
                                    backgroundColor: "#3b33d5",
                                }}
                            >
                                <ThemeProvider theme={darkTheme}>
                                    <Container>
                                        <Box height={35} />
                                        <Box sx={center}>
                                            <Avatar
                                                sx={{ mb: "4px", bgcolor: "#ffffff" }}
                                            >
                                                <LockOutlinedIcon />
                                            </Avatar>
                                            <Typography component="h1" variant="h4">
                                                Reset Password
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{ mt: 2 }}
                                        >
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
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
                                                <Grid item xs={12} sx={{ ml: "5em", mr: "5em" }}>
                                                    <Button
                                                        onClick={handleSubmit}
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
                                                        Send Reset Link
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                    <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                        <Grid container justifyContent="flex-end">
                                                            <Grid item>
                                                                <Link href="#" variant="body2" to="/login" style={{ color: "white" }}>
                                                                    Login to your Account. Sign In
                                                                </Link>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Container>
                                </ThemeProvider>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </>
    );
}


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
import Stack from "@mui/material/Stack";
import { Link, useNavigate } from "react-router-dom";
import { UserLogin } from "../../services/login.service";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../Contexts/AuthContext";
import './UserLoginform.css'

// const Alert = forwardRef(function Alert(props, ref) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const boxstyle = {
    position: "absolute",
    top: "56%",
    left: "52.5%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    bgcolor: "background.paper",
    boxShadow: 24,
    color: "#fff",
    display: "flex",
    justifyContent: "center"
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

export default function UserLoginform() {
    const auth = useAuth()
    const { userData, login } = auth;
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })


    const handleSignin = async (e) => {
        e.preventDefault()
        const loader = toast.loading("Signing In")
        try {
            const response = await UserLogin(formData)
            const { username, role, token, avatar } = response.data;
            login(token, username, role, avatar)
            toast.dismiss(loader)
            toast.success("SignIn Successfull")
            if (role === 'superadmin' || role === 'admin') {
                navigate('/admin/dashboard')
            } else if (role === 'user') {
                navigate('/courses')
            }
        } catch (error) {
            toast.dismiss(loader)
            toast.error(error.response.data.error)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    return (
        <>
            <div
                style={{
                    backgroundImage: `url(${bgimg})`,
                    backgroundSize: "cover",
                    color: "#f5f5f5",
                    height: "100vh",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            >
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                />
                <Box sx={boxstyle} className="image-login-box-container">
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
                                    <Container>
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
                                            <form onSubmit={handleSignin}>
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
                                                        <Stack direction="row" spacing={2}>
                                                            <Typography
                                                                variant="body1"
                                                                component="span"
                                                                onClick={() => {
                                                                    navigate("/forgot");
                                                                }}
                                                                style={{ marginTop: "10px", cursor: "pointer" }}
                                                            >
                                                                Forgot password?
                                                            </Typography>
                                                        </Stack>
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
                                                            onClick={handleSignin}
                                                        >
                                                            Sign in
                                                        </Button>
                                                    </Grid>
                                                    <Grid container item xs={12} sx={{ display: "flex" }}>
                                                        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ display: "flex", ml: "2em", mr: "2em" }} >
                                                            Not registered yet? <Link href="#" variant="body2" to="/signup" style={{ color: "white" , marginLeft : '10px' }} >
                                                                {"Sign Up"}
                                                            </Link>
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ display: "flex", ml: "2em", mr: "2em", mt: "1em" }}>
                                                           
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
    );
}




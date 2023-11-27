
import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MainList from '../MainList';
import { Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import { useAuth } from '../../Contexts/AuthContext';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const defaultTheme = createTheme();
const settings = ['Profile', 'Logout'];

export default function AdminSideNavBar() {
    const { userdata, logout } = useAuth()
    const name = userdata.username
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    const [dialogDashboardCards, setDialogDashboardCards] = React.useState(false);
    const dialogTheme = useTheme();
    const fullScreen = useMediaQuery(dialogTheme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setDialogDashboardCards(true);
    };
    const handleClickClose = () => {
        setDialogDashboardCards(false);
    };


    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open} sx={{ backgroundColor: "#282c34" }}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        {userdata.role === 'admin' || userdata.role === 'superadmin' ? <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton> : null}
                        <Typography>
                            <img
                                style={{ width: "70px" }}
                                src='https://drive.google.com/uc?export=view&id=1WEptUger6Bqs1OHLN9znAqtF06x9OJRk'
                                alt="CEOITBOX"
                            />
                        </Typography>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1, textAlign: "center" }}
                        >
                            Learning Mangement System
                        </Typography>
                        {
                            userdata.isAuthenticated ?
                                <Box sx={{ flexGrow: 0 , display : 'flex' , alignItems : 'center'}}>
                                   {userdata.role === 'user' && <Box marginRight={'15px'}>
                                        <Link to={'/courses'} style={{ color: 'white', textDecoration: 'none' }}>My Courses</Link>
                                    </Box>}
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt="Remy Sharp" src={userdata.avatar} />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    > <MenuItem key={userdata.username} onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                                        </MenuItem>
                                        {settings.map((setting) => (
                                            setting === 'Logout' ?
                                                <MenuItem key={setting} onClick={() => {
                                                    handleCloseUserMenu()
                                                    logout()
                                                }}>
                                                    <Typography textAlign="center">{setting}</Typography>
                                                </MenuItem> : <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                                    <Typography textAlign="center">{setting}</Typography>
                                                </MenuItem>
                                        ))}
                                    </Menu>
                                </Box> :
                                <Box sx={{
                                    width: '15%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    color: 'white'
                                }}>
                                    <Link to={'/courses'} style={{ color: 'white', textDecoration: 'none' }}>All Courses</Link>
                                    <Link to={'/login'} style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                                    <Link to={'/signup'} style={{ color: 'white', textDecoration: 'none' }}>Signup</Link>
                                </Box>
                        }
                    </Toolbar>
                </AppBar>
                {userdata.role === 'admin' || userdata.role === 'superadmin' ? <Drawer variant="permanent" open={open} >
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <MainList />
                        <Divider sx={{ my: 1 }} />
                    </List>
                </Drawer> : null}
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />

                </Box>
            </Box>
        </ThemeProvider>
    );
}
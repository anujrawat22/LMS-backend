
import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import { useAuth } from '../../Contexts/AuthContext';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import styles from './sidenavbar.module.css';
import LoginIcon from '@mui/icons-material/Login';
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

const defaultTheme = createTheme();
const settings = ['Profile', 'Logout'];


export default function AdminSideNavBar() {
    const { userdata, logout } = useAuth()
    const name = userdata.username
    const [open, setOpen] = React.useState(false);
    const [guestDrawer, setguestDrawer] = React.useState(false)
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };



    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" sx={{ backgroundColor: "#282c34" }}>
                    <Toolbar
                    >
                        {userdata.role === 'admin' || userdata.role === 'superadmin' ? <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                        >
                            <MenuIcon onClick={() => setOpen(!open)} />
                        </IconButton> : null}
                        <Typography>
                            <img
                                className={styles.Logo}
                                src='https://drive.google.com/uc?export=view&id=1WEptUger6Bqs1OHLN9znAqtF06x9OJRk'
                                alt="CEOITBOX"
                            />
                        </Typography>
                        <Typography
                            component="h1"
                            variant='h6'
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1, textAlign: "center" }}
                            className={styles.WebsiteTitle}
                        >
                            LMS
                        </Typography>
                        {
                            userdata.isAuthenticated ?
                                <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
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
                                <>

                                    <Box
                                        className={styles.Usernavigations}>
                                        <Link to={'/courses'} style={{ color: 'white', textDecoration: 'none' }}>All Courses</Link>
                                        <Link to={'/login'} style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                                        <Link to={'/signup'} style={{ color: 'white', textDecoration: 'none' }}>Signup</Link>
                                    </Box>
                                    <Box className={styles.UserNavs}>
                                        <IconButton sx={{
                                            color: 'white'
                                        }}
                                            onClick={() => setguestDrawer(!guestDrawer)}>
                                            <MenuIcon fontSize='small'/>
                                        </IconButton>
                                    </Box>
                                    {
                                        guestDrawer ? <GuestDrawer open={guestDrawer} setOpen={setguestDrawer} /> : null
                                    }
                                </>
                        }
                    </Toolbar>
                </AppBar>
            </Box>
            {open ? <TemporaryDrawer open={open} setOpen={setOpen} /> : null}

        </ThemeProvider>
    );
}




function TemporaryDrawer({ open, setOpen }) {
    const { userdata } = useAuth()
    const { role, isAuthenticated } = userdata;
    const list = () => (
        <Box sx={{
            padding: '80px 0px'
        }}>
            {isAuthenticated && <List component={"div"} disablePadding>
                <ListItem
                    component={RouterLink} to={'/courses'}
                    disablePadding sx={{ display: 'block' }}
                >
                    <ListItemButton onClick={handleCloseDrawer}>
                        <ListItemIcon>
                            <LibraryBooksIcon />
                        </ListItemIcon>
                        <ListItemText primary="Courses" sx={{ color: "#444" }} />
                    </ListItemButton>
                </ListItem>
                {(role === 'superadmin' || role === 'admin') &&
                    <>
                        <ListItem
                            component={RouterLink} to={'/admin/dashboard'}
                            disablePadding sx={{ display: 'block' }}
                        >
                            <ListItemButton onClick={handleCloseDrawer}>
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" sx={{ color: "#444" }} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem
                            disablePadding sx={{ display: 'block' }}
                            component={RouterLink} to={'/admin/Addcourse'}
                        >
                            <ListItemButton onClick={handleCloseDrawer}>
                                <ListItemIcon>
                                    <AddIcon />
                                </ListItemIcon>
                                <ListItemText primary="Add New Course" sx={{ color: "#444" }} />
                            </ListItemButton>
                        </ListItem>
                    </>
                }
            </List>}
        </Box>
    );

    const handleCloseDrawer = () => {
        setOpen(false);
    };

    return (
        <div>

            <Drawer open={open} anchor="left" onClose={handleCloseDrawer} >
                {list()}
            </Drawer>
        </div>
    );
}

function GuestDrawer({ open, setOpen }) {
    const { userdata } = useAuth()
    const { role, isAuthenticated } = userdata;
    const list = () => (
        <Box sx={{
            padding: '60px 0px',
        }}>
            <List component={"div"} disablePadding>
                <ListItem
                    component={RouterLink} to={'/courses'}
                    disablePadding sx={{ display: 'block' }}
                >
                    <ListItemButton onClick={handleCloseDrawer}>
                        <ListItemText primary="All Courses" sx={{ color: "#444" }} />
                    </ListItemButton>
                </ListItem>

                <ListItem
                    component={RouterLink} to={'/login'}
                    disablePadding sx={{ display: 'block' }}
                >
                    <ListItemButton onClick={handleCloseDrawer}>
                        <ListItemText primary="Login" sx={{ color: "#444" }} />
                    </ListItemButton>
                </ListItem>
                <ListItem
                    disablePadding sx={{ display: 'block' }}
                    component={RouterLink} to={'/signup'}
                >
                    <ListItemButton onClick={handleCloseDrawer}>
                        <ListItemText primary="Signup" sx={{ color: "#444" }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    const handleCloseDrawer = () => {
        setOpen(false);
    };
    return (
        <Drawer open={open} anchor="right" onClose={handleCloseDrawer} sx={{
            position: 'absolute'
        }}>
            {list()}
        </Drawer>
    );
}
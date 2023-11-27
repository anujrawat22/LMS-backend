import React from 'react'
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import { List, ListItem } from '@mui/material';
// import { Link } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom'; // If you're using React Router
import { useAuth } from '../Contexts/AuthContext';
import VerifiedIcon from '@mui/icons-material/Verified';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const MainList = () => {
    const { userdata } = useAuth()
    const { role, isAuthenticated } = userdata;

    return (
        <>
            {isAuthenticated && <List component={"div"} disablePadding>
                <ListItem
                    component={RouterLink} to={'/courses'}
                    disablePadding sx={{ display: 'block' }}
                >
                    <ListItemButton>
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
                            <ListItemButton>
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
                            <ListItemButton>
                                <ListItemIcon>
                                    <AddIcon />
                                </ListItemIcon>
                                <ListItemText primary="Add New Course" sx={{ color: "#444" }} />
                            </ListItemButton>
                        </ListItem>
                    </>
                }
            </List>}
        </>
    )
}

export default MainList





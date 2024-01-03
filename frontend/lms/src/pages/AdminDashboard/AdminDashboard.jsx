
import * as React from 'react';
import { styled} from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';

import Students from '../../components/Students/Students';

import { Grid } from '@mui/material';


const drawerWidth = 240;


export default function AdminDashboard() {
    return (
        <>
            <Grid container sx={{ mt: 8 }}>
                <Grid item md={.5} sm={12} lg={.5}></Grid>
                <Grid item xs={12} sm={12} md={11.5} letterSpacing={.5}>
                    <Students />
                </Grid>
            </Grid>
        </>
    );
}
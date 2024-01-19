
import * as React from 'react';

import Students from '../../components/Students/Students';

import { Grid } from '@mui/material';



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
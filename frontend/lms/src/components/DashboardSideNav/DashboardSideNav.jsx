import React from 'react'

import { Box, List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material'

const DashboardSideNav = ({ setComp }) => {
    return (
        <Box sx={{
            height: '100dvh',
            width: '13%',
            backgroundColor: 'white'
        }}>
            <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="div"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Users
                    </ListSubheader>
                }>
                <ListItem>
                    <ListItemButton onClick={() => setComp('students')}>
                        <ListItemText primary="Students" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    )
}

export default DashboardSideNav
import React, { useState } from 'react'
import { Typography } from '@mui/material'
import UserLoginform from '../../components/UserLogin/UserLoginform'
import AdminLoginform from '../../components/AdminLogin/AdminLoginform'


const Login = () => {

    const [toggle, setToggle] = useState('user')

    return (
        <div>
            <UserLoginform />
        </div>
    )
}

export default Login
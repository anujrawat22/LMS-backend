import React from 'react'
import { useAuth } from '../Contexts/AuthContext'
import { Navigate, Outlet } from 'react-router-dom';

const AuthentiactedRoute = ({ children }) => {
    const { userdata } = useAuth()
    const { isAuthenticated } = userdata;

    return (
        <>
            {
                isAuthenticated ? <Outlet /> : <Navigate to='/login' />
            }
        </>
    )
}

export default AuthentiactedRoute
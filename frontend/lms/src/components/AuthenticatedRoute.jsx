import React from 'react'
import { useAuth } from '../Contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const AuthenticatedRoute = ({ children }) => {
    const { userdata } = useAuth()


    return (
        <>
            {userdata.isAuthenticated ? <Outlet /> : <Navigate to='/login' />
            }
        </>
    )
}

export default AuthenticatedRoute
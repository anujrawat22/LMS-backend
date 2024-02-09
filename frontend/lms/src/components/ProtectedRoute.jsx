import React from 'react'
import { useAuth } from '../Contexts/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ children, roles }) => {
    const { userdata } = useAuth()
    const {isAuthenticated} = userdata;
    
    const hasPermission = () => {   
            return roles.includes(userdata.role)

    }
    return (
        <>
            {
                hasPermission() ? <Outlet /> : <Navigate to={isAuthenticated ? '/courses' : '/login'} />
            }
        </>
    )
}

export default ProtectedRoute
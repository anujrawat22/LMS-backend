import React from 'react'
import { useAuth } from '../Contexts/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ children, roles }) => {
    const { userdata } = useAuth()
    
    const hasPermission = () => {   
            return roles.includes(userdata.role)

    }
    return (
        <>
            {
                hasPermission() ? <Outlet /> : <Navigate to='/login' />
            }
        </>
    )
}

export default ProtectedRoute
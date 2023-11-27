

import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login/Login'
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard'
import RegistrationForm from './registerForm/register'
import ForgetPassword from './forgotPassword/forgotpassword'
import AddCourses from './AddCourses/AddCourses'
import UserDetails from '../pages/UserDetails/UserDetails'
import ProtectedRoute from './ProtectedRoute'
import CourseChapters from './Courses/coursechapters'
import CourseDetails from './CourseDetails/CourseDetails'
import Courses from './Courses/Cards'

const AllRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<RegistrationForm />} />
                <Route path='/forgot' element={<ForgetPassword />} />

                <Route path='/courses' element={<Courses />} />
                <Route path='/CourseDetails/:id' element={<CourseDetails />} />
                <Route path='/chapters/:id' element={<CourseChapters />} />
                <Route element={<ProtectedRoute roles={['admin', 'superadmin']} />}>
                    <Route path='/admin/dashboard' element={<AdminDashboard />} />
                    <Route path='/student/:id' element={<UserDetails />} />
                    <Route path='/admin/Addcourse' element={<AddCourses />} />
                </Route>
            </Routes>
        </>
    )
}

export default AllRoutes
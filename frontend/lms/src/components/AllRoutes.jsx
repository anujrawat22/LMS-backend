

import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login/Login'
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard'
import ForgetPassword from './forgotPassword/forgotpassword'
import AddCourses from './AddCourses/AddCourses'
import UserDetails from '../pages/UserDetails/UserDetails'
import ProtectedRoute from './ProtectedRoute'
import CourseChapters from './Courses/coursechapters'
import CourseDetails from './CourseDetails/CourseDetails'
import Courses from './Courses/Cards'
import Signup from '../pages/Signup/Signup'

const AllRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/courses' element={<Courses />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/forgot' element={<ForgetPassword />} />
                <Route path='/CourseDetails/:id/section/:sectionId/lesson/:lessonId' element={<CourseDetails />} />
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
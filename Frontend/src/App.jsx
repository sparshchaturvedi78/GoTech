import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import React from 'react'
import Navbar from './components/common/Navbar'
import About from './pages/About'
import ContactUs from './pages/ContactUs'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Error from '../src/pages/Error'
import ForgotPassword from './pages/ForgotPassword'
import OpenRoute from './components/core/Auth/OpenRoute'
import UpdatePassword from './pages/UpdatePassword'
import VerifyEmail from './pages/VerifyEmail'
import ResetCompleted from './pages/ResetCompleted'
import PrivateRoute from './components/core/Auth/PrivateRoute'
import Dashboard from './pages/Dashboard'
import MyProfile from './components/core/Dashboard/MyProfile'
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses'
import Settings from '../src/components/core/Dashboard/Settings'
import Cart from '../src/components/core/Dashboard/Cart'
import { useSelector } from 'react-redux'
import { ACCOUNT_TYPE } from './utils/constants'
import AddCourse from '../src/components/core/Dashboard/AddCourses'
import { useEffect } from 'react'
import { checkTokenExpiration } from './services/operations/authAPI'
import MyCourses from './components/core/Dashboard/MyCourses'
import EditCourse from '../src/components/core/Dashboard/EditCourse'
import Catalog from './pages/Catalog'
import CourseDetails from './pages/CourseDetails'
import ViewCourse from './pages/ViewCourse'
import VideoDetails from './components/core/ViewCourse/VideoDetails'
import Instructor from './components/core/Dashboard/InstructorDashboard/Instructor'

function App() {
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    checkTokenExpiration();
  }, []);

  return (
    <div className='w-screen min-h-screen flex flex-col bg-richblack-900 font-inter'>

      {/* Common navbar for all the pages */}
      <Navbar />

      {/* Individual pages mapped for different routes */}
      <Routes>

        <Route
          path="/"
          element={
            <Home />
          }
        />
        <Route
          path="/about"
          element={
            <About />
          }
        />

        <Route
          path="/contact"
          element={
            <ContactUs />
          }
        />

        <Route
          path='/login'
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path='/signup'
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        <Route
          path="/reset-successfull"
          element={
            <OpenRoute>
              <ResetCompleted />
            </OpenRoute>
          }
        />

        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route
          path='*'
          element={
            <Error />
          }
        />

        <Route
          path='/catalog/:catalogName'
          element={
            <Catalog />
          }
        />

        <Route
          path='/courses/:courseId'
          element={
            <CourseDetails />
          }
        />

        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >

          <Route path='/dashboard/my-profile' element={<MyProfile />} />
          <Route path='/dashboard/settings' element={<Settings />} />

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path='/dashboard/enrolled-courses' element={<EnrolledCourses />} />
                <Route path='/dashboard/cart' element={<Cart />} />
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path='/dashboard/add-course' element={<AddCourse />} />
                <Route path='/dashboard/my-courses' element={<MyCourses />} />
                <Route path='/dashboard/edit-course/:courseId' element={<EditCourse />} />
                <Route path="dashboard/instructor" element={<Instructor />} />
              </>
            )
          }

        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subsectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>


      </Routes>
    </div>
  )

}

export default App

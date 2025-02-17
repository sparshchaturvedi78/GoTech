import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getInstructorData } from '../../../../services/operations/profileAPI';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Instructor = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const [loading, setLoading] = useState(false);
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const instructorApiData = await getInstructorData(token);
            const result = await fetchInstructorCourses(token);
            if (instructorApiData?.length) setInstructorData(instructorApiData);
            if (result) {
                setCourses(result);
            }
            setLoading(false);
        })();
    }, [token]);

    const totalAmount = instructorData?.reduce(
        (acc, curr) => acc + curr.totalAmountGenerated,
        0
    );

    const totalStudents = instructorData?.reduce(
        (acc, curr) => acc + curr.totalStudentsEnrolled,
        0
    );

    // Animation variants for framer-motion
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="p-4 sm:p-6"
        >
            {/* Header Section */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-richblack-5">
                    Welcome Back, {user?.firstName}!👋
                </h1>
                <p className="text-richblack-200 mt-2">
                    Here's an overview of your courses and performance.
                </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-richblack-700 p-6 rounded-lg text-center">
                    <p className="text-richblack-200">Total Courses</p>
                    <p className="text-3xl font-bold text-richblack-5 mt-2">
                        {courses.length}
                    </p>
                </div>
                <div className="bg-richblack-700 p-6 rounded-lg text-center">
                    <p className="text-richblack-200">Total Students</p>
                    <p className="text-3xl font-bold text-richblack-5 mt-2">
                        {totalStudents}
                    </p>
                </div>
                <div className="bg-richblack-700 p-6 rounded-lg text-center">
                    <p className="text-richblack-200">Total Income</p>
                    <p className="text-3xl font-bold text-richblack-5 mt-2">
                        Rs. {totalAmount}
                    </p>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-richblack-700 p-6 rounded-lg mb-8">
                {totalAmount > 0 || totalStudents > 0 ? (
                    <InstructorChart courses={instructorData} />
                ) : (
                    <div className="flex-1 rounded-md bg-richblack-800 p-6">
                        <p className="text-lg font-bold text-richblack-5">Visualize</p>
                        <p className="mt-4 text-xl font-medium text-richblack-50">
                            Not Enough Data To Visualize
                        </p>
                    </div>
                )}
            </div>

            {/* Courses Section */}
            <div className="bg-richblack-700 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-richblack-5">Your Courses</h2>
                    <Link to="/dashboard/my-courses">
                        <button className="text-sm font-semibold text-yellow-50 hover:text-yellow-200 transition-all duration-200">
                            View All →
                        </button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses?.slice(0, 3).map((course) => (
                        <motion.div
                            key={course._id}
                            className="bg-richblack-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img
                                src={course.thumbnail}
                                alt={course.courseName}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-richblack-5">
                                    {course.courseName}
                                </h3>
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-sm text-richblack-300">
                                        {course.studentEnrolled.length} students
                                    </p>
                                    <p className="text-sm text-richblack-300">
                                        Rs. {course.price}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Instructor;
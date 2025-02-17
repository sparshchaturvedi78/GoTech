import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const EnrolledCourses = () => {
    const { token } = useSelector((state) => state.auth);
    const [enrolledCourses, setEnrolledCourses] = useState(null);
    const navigate = useNavigate();

    const getEnrolledCourses = async () => {
        try {
            const response = await getUserEnrolledCourses(token);
            setEnrolledCourses(response);
        } catch (err) {
            console.log("Unable to fetch enrolled courses");
        }
    };

    useEffect(() => {
        getEnrolledCourses();
    }, []);


    return (
        <div className="p-4 md:p-8">
            <div className="text-2xl md:text-3xl text-richblack-5 mb-6">Enrolled Courses</div>
            {!enrolledCourses ? (
                <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                    <div className="spinner"></div>
                </div>
            ) : !enrolledCourses.length ? (
                <p className="grid h-[10vh] w-full place-content-center text-richblack-5 text-lg md:text-xl">
                    You have not enrolled in any course yet
                </p>
            ) : (
                <div className="my-6 md:my-8 text-richblack-5  ">
                    {/* Course Cards */}
                    {enrolledCourses.map((course, i, arr) => (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }} // Start below the screen
                            animate={{ opacity: 1, y: 0 }} // Slide up to the original position
                            transition={{ delay: i * 0.2, duration: 0.5 }} // Staggered animation
                            className={`flex flex-col gap-4 rounded-lg border cursor-pointer border-richblack-700 p-4 ${i === arr.length - 1 ? "mb-0" : "mb-4"
                                }`}
                            key={i}
                            onClick={() => {
                                navigate(
                                    `/view-course/${course?._id}/section/${course?.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subsection?.[0]?._id}`
                                );
                            }}
                        >
                            {/* Course Thumbnail and Details */}
                            <div
                                className="flex items-center gap-4"
                            >
                                <img
                                    src={course.thumbnail}
                                    alt="course_img"
                                    className="h-12 w-12 md:h-14 md:w-14 rounded-lg object-cover"
                                />
                                <div className="flex flex-col gap-1">
                                    <p className="font-semibold text-sm md:text-base">{course.courseName}</p>
                                    <p className="text-xs text-richblack-300">
                                        {course.courseDescription.length > 50
                                            ? `${course.courseDescription.slice(0, 50)}...`
                                            : course.courseDescription}
                                    </p>
                                </div>
                            </div>

                            {/* Course Duration */}
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-richblack-300">Duration</p>
                                <p className="text-sm md:text-base text-richblack-5">
                                    {course?.totalDuration}
                                </p>
                            </div>

                            {/* Progress Bar */}
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-richblack-300">Progress</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm md:text-base text-richblack-5">
                                        {course.progressPercentage || 0}%
                                    </p>
                                    <div className="w-full">
                                        <ProgressBar
                                            completed={course.progressPercentage || 0}
                                            height="8px"
                                            isLabelVisible={false}
                                            width="100%"
                                            bgColor="#06B6D4" // Customize the color if needed
                                            baseBgColor="#374151" // Customize the background color if needed
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EnrolledCourses;

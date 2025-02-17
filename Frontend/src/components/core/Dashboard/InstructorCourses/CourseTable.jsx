import React, { useState } from 'react';
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { formatDate } from '../../../../services/formatDate';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteCourse, fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { COURSE_STATUS } from '../../../../utils/constants';
import ConfirmationModal from '../../../common/ConfirmationModal';
import { motion } from 'framer-motion';

const CourseTable = ({ courses, setCourses }) => {
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const TRUNCATE_LENGTH = 30;

    const handleCourseDelete = async (courseId) => {
        setLoading(true);
        await deleteCourse({ courseId: courseId }, token);
        const result = await fetchInstructorCourses(token);
        if (result) {
            setCourses(result);
        }
        setLoading(false);
        setConfirmationModal(null);
    };

    return (
        <div className="space-y-6">
            {courses?.length === 0 ? (
                <div className="py-10 text-center text-2xl font-medium text-richblack-100">
                    No Courses Found
                </div>
            ) : (
                courses?.map((course, index) => (
                    <motion.div
                        key={course._id}
                        className="flex flex-col md:flex-row gap-6 p-6 rounded-lg border border-richblack-800 bg-richblack-900"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.3 }}
                    >
                        {/* Course Thumbnail */}
                        <motion.img
                            src={course?.thumbnail}
                            alt={course?.courseName}
                            className="h-[150px] w-full md:h-[180px] md:w-[260px] rounded-lg object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        />

                        {/* Course Details */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <p className="text-lg font-semibold text-richblack-5">
                                    {course.courseName}
                                </p>
                                <p className="text-xs text-richblack-300 mt-2">
                                    {course.courseDescription.split(" ").length > TRUNCATE_LENGTH
                                        ? course.courseDescription.split(" ").slice(0, TRUNCATE_LENGTH).join(" ") + "..."
                                        : course.courseDescription}
                                </p>
                                <p className="text-[12px] text-white mt-2">
                                    Created: {formatDate(course.createdAt)}
                                </p>
                            </div>

                            {/* Course Status */}
                            <div className="mt-4">
                                {course.status === COURSE_STATUS.DRAFT ? (
                                    <motion.p
                                        className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100"
                                        animate={{ opacity: 1, scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <HiClock size={14} />
                                        Drafted
                                    </motion.p>
                                ) : (
                                    <motion.div
                                        className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100"
                                        animate={{ scale: [0.9, 1.1, 1] }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                                            <FaCheck size={8} />
                                        </div>
                                        Published
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Course Metadata and Actions */}
                        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-14">
                            <div className="space-y-2">
                                <p className="text-sm font-medium md:mt-[9px] text-richblack-100">
                                    Price: ₹{course.price}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <motion.button
                                    disabled={loading}
                                    onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                                    title="Edit"
                                    className="p-2 rounded-lg bg-richblack-700 hover:bg-richblack-600 transition-all duration-200"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <FiEdit2 size={20} className="text-richblack-100" />
                                </motion.button>
                                <motion.button
                                    disabled={loading}
                                    onClick={() => setConfirmationModal({
                                        text1: "Do you want to delete this course?",
                                        text2: "All the data related to this course will be deleted",
                                        btn1Text: !loading ? "Delete" : "Loading...",
                                        btn2Text: "Cancel",
                                        bt1Handler: !loading ? () => handleCourseDelete(course._id) : () => { },
                                        bt2Handler: !loading ? () => setConfirmationModal(null) : () => { },
                                    })}
                                    title="Delete"
                                    className="p-2 rounded-lg bg-richblack-700 hover:bg-richblack-600 transition-all duration-200"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <RiDeleteBin6Line size={20} className="text-pink-200" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))
            )}

            {/* Confirmation Modal */}
            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </div>
    );
};

export default CourseTable;
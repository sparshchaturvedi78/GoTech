import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import IconBtn from '../../common/IconBtn';
import { useNavigate } from 'react-router-dom';
import { RiEditBoxLine } from 'react-icons/ri';
import { formattedDate } from '../../../utils/dateFormatter';
import { motion } from 'framer-motion';

const MyProfile = () => {
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();

    // Animation variants for staggered slide-in from bottom
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // Delay between each child animation
            },
        },
    };

    const childVariants = {
        hidden: { opacity: 0, y: 50 }, // Start below the screen
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, // Slide up to the original position
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="p-4 md:p-8"
        >
            <h1 className="mb-8 text-2xl md:text-3xl font-medium text-richblack-5">My Profile</h1>

            {/* Section-1 */}
            <motion.div variants={childVariants}>
                <div className="flex flex-col md:flex-row items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 md:p-8 relative">
                    <div className="flex items-center gap-x-4 mb-4 md:mb-0">
                        <img
                            src={user?.image}
                            alt={`profile-${user?.firstName}`}
                            className="aspect-square w-12 md:w-[78px] rounded-full object-cover"
                        />
                        <div className="space-y-1">
                            <p className="text-lg font-semibold text-richblack-5">
                                {user?.firstName + " " + user?.lastName}
                            </p>
                            <p className="text-sm text-richblack-300">{user?.email}</p>
                        </div>
                    </div>

                    <div className='translate-x-24 lg:translate-x-0'>
                        <IconBtn
                            text="Edit"
                            onClick={() => navigate("/dashboard/settings")}
                        >
                            <RiEditBoxLine />
                        </IconBtn>
                    </div>
                </div>
            </motion.div>

            {/* Section-2 */}
            <motion.div variants={childVariants}>
                <div className="my-6 md:my-10 flex flex-col gap-y-6 md:gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 md:p-8">
                    <div className="flex w-full items-center justify-between">
                        <p className="text-lg font-semibold text-richblack-5">About</p>
                        <IconBtn
                            text="Edit"
                            onClick={() => navigate("/dashboard/settings")}
                        >
                            <RiEditBoxLine />
                        </IconBtn>
                    </div>

                    <p className={`${user?.additionalDetails?.about
                        ? "text-richblack-5"
                        : "text-richblack-400"
                        } text-sm font-medium`}>
                        {user?.additionalDetails?.about ?? "Write Something About Yourself"}
                    </p>
                </div>
            </motion.div>

            {/* Section-3 */}
            <motion.div variants={childVariants}>
                <div className="my-6 md:my-10 flex flex-col gap-y-6 md:gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 md:p-8">
                    <div className="flex w-full items-center justify-between">
                        <p className="text-lg font-semibold text-richblack-5">Personal Details</p>
                        <IconBtn
                            text="Edit"
                            onClick={() => navigate("/dashboard/settings")}
                        >
                            <RiEditBoxLine />
                        </IconBtn>
                    </div>

                    <div className="flex flex-col md:flex-row max-w-[500px] justify-between gap-y-6 md:gap-y-0">
                        <div className="flex flex-col gap-y-4 md:gap-y-5">
                            <div>
                                <p className="mb-1 md:mb-2 text-sm text-richblack-600">First Name</p>
                                <p className="text-sm font-medium text-richblack-5">
                                    {user?.firstName}
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 md:mb-2 text-sm text-richblack-600">Email</p>
                                <p className="text-sm font-medium text-richblack-5">
                                    {user?.email}
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 md:mb-2 text-sm text-richblack-600">Gender</p>
                                <p className="text-sm font-medium text-richblack-5">
                                    {user?.additionalDetails?.gender ?? "Add Gender"}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-4 md:gap-y-5">
                            <div>
                                <p className="mb-1 md:mb-2 text-sm text-richblack-600">Last Name</p>
                                <p className="text-sm font-medium text-richblack-5">
                                    {user?.lastName}
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 md:mb-2 text-sm text-richblack-600">Phone Number</p>
                                <p className="text-sm font-medium text-richblack-5">
                                    {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 md:mb-2 text-sm text-richblack-600">Date Of Birth</p>
                                <p className="text-sm font-medium text-richblack-5">
                                    {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                                        "Add Date Of Birth"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MyProfile;
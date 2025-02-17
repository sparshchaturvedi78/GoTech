import React from 'react';
import { motion } from 'framer-motion';
import ChangeProfilePicture from './ChangeProfilePicture';
import EditProfile from './EditProfile';
import UpdatePassword from './UpdatePassword';
import DeleteAccount from './DeleteAccount';

const EditProfilePage = () => {
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
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">Edit Profile</h1>

      {/* Animated Sections */}
      <motion.div variants={childVariants}>
        <ChangeProfilePicture />
      </motion.div>
      <motion.div variants={childVariants}>
        <EditProfile />
      </motion.div>
      <motion.div variants={childVariants}>
        <UpdatePassword />
      </motion.div>
      <motion.div variants={childVariants}>
        <DeleteAccount />
      </motion.div>
    </motion.div>
  );
};

export default EditProfilePage;
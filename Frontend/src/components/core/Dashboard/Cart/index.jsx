import React from 'react';
import { useSelector } from 'react-redux';
import RenderCartCourses from './RenderCartCourses';
import RenderTotalAmount from './RenderTotalAmount';
import { motion } from 'framer-motion';

const Cart = () => {
  const { total, totalItem } = useSelector((state) => state.cart);

  // Animation variants for the cart courses
  const cartCoursesVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  // Animation variants for the total amount
  const totalAmountVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">Your Cart</h1>
      <p className="border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400">
        {totalItem} Courses in cart
      </p>

      {total > 0 ? (
        <div className="mt-8 flex flex-col items-start gap-x-10 gap-y-6 lg:flex-row">
          {/* Animated Cart Courses */}
          <motion.div
            variants={cartCoursesVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-[70%]"
          >
            <RenderCartCourses />
          </motion.div>

          {/* Animated Total Amount */}
          <motion.div
            variants={totalAmountVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-[30%]"
          >
            <RenderTotalAmount />
          </motion.div>
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-14 text-center text-3xl text-richblack-100"
        >
          Your Cart is empty
        </motion.p>
      )}
    </div>
  );
};

export default Cart;

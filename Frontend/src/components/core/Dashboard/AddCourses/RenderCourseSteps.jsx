import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import CourseInformationForm from './CourseInformation/CourseInformationForm';
import CourseBuilderForm from './CourseBuilder/CourseBuilderForm';
import PublishCourse from '../AddCourses/PublishCourse';
import { FaCheck } from 'react-icons/fa6';

const RenderCourseSteps = () => {
  const { step } = useSelector((state) => state.course);

  const steps = [
    {
      id: 1,
      title: 'Course Information',
    },
    {
      id: 2,
      title: 'Course Builder',
    },
    {
      id: 3,
      title: 'Publish',
    },
  ];

  return (
    <>
      {/* Step Indicators */}
      <motion.div 
        className="relative mb-2 flex w-full justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {steps.map((item) => (
          <React.Fragment key={item.id}>
            <motion.div
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
            >
              <button
                className={`grid cursor-default aspect-square w-[34px] sm:w-[34px] place-items-center rounded-full border-[1px] ${
                  step === item.id
                    ? 'border-yellow-50 bg-yellow-900 text-yellow-50'
                    : 'border-richblack-700 bg-richblack-800 text-richblack-300'
                } ${step > item.id && 'bg-yellow-50 text-yellow-50'}`}
              >
                {step > item.id ? (
                  <FaCheck className="font-bold text-richblack-900" />
                ) : (
                  item.id
                )}
              </button>
            </motion.div>
            {item.id !== steps.length && (
              <motion.div
                className={`h-[calc(24px/2)] sm:h-[calc(34px/2)] w-[26%] sm:w-[33%] border-dashed border-b-2 ${
                  step > item.id ? 'border-yellow-50' : 'border-richblack-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: step > item.id ? '33%' : '26%' }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            )}
          </React.Fragment>
        ))}
      </motion.div>

      {/* Step Titles */}
      <motion.div
        className="relative mb-8 sm:mb-16 flex w-full lg:px-8 select-none justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {steps.map((item) => (
          <motion.div
            className="flex min-w-[80px] sm:min-w-[130px] flex-col items-center gap-y-1 sm:gap-y-2"
            key={item.id}
            whileHover={{ scale: 1.1 }}
          >
            <p
              className={`text-xs sm:text-sm ${
                step >= item.id ? 'text-richblack-5' : 'text-richblack-500'
              }`}
            >
              {item.title}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Form Sections */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        key={step} 
      >
        {step === 1 && <CourseInformationForm />}
        {step === 2 && <CourseBuilderForm />}
        {step === 3 && <PublishCourse />}
      </motion.div>
    </>
  );
};

export default RenderCourseSteps;
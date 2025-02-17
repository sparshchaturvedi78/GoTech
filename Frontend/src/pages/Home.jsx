import React from 'react';
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/common/Button';
import Banner from '../assets/Images/banner.mp4';
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import Footer from '../components/common/Footer';
import TimelineSection from '../components/core/HomePage/TimelineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import ReviewSlider from '../components/common/ReviewSlider';
import ExploreMore from '../components/core/HomePage/ExploreMore';
import { motion } from 'framer-motion';

const Home = () => {
    // Animation variants for staggered fade-in
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
        hidden: { opacity: 0, y: 20 }, // Start below the screen
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, // Slide up to the original position
    };

    return (
        <div>
            {/* Section 1 */}
            <div className='relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent'>
                {/* Become an Instructor Button */}
                <motion.div
                    variants={childVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Link to={"/signup"}>
                        <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] hover:drop-shadow-none'>
                            <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                                <p>Become an Instructor</p>
                                <FaArrowRight />
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Heading */}
                <motion.div
                    variants={childVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center text-4xl font-semibold mt-8"
                >
                    Empower Your Future with
                    <HighlightText text={"Coding Skills"} />
                </motion.div>

                {/* Sub Heading */}
                <motion.div
                    variants={childVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-3 w-[90%] text-center text-lg font-bold text-richblack-300"
                >
                    With our online coding courses, you can learn at your own pace, from
                    anywhere in the world, and get access to a wealth of resources,
                    including hands-on projects, quizzes, and personalized feedback from
                    instructors.
                </motion.div>

                {/* Buttons */}
                <motion.div
                    variants={childVariants}
                    initial="hidden"
                    animate="visible"
                    className='flex flex-row gap-7 mt-8'
                >
                    <CTAButton active={true} linkto={"/signup"}>
                        Learn More
                    </CTAButton>
                    <CTAButton active={false} linkto={"/login"}>
                        Book a Demo
                    </CTAButton>
                </motion.div>

                {/* Video */}
                <motion.div
                    variants={childVariants}
                    initial="hidden"
                    animate="visible"
                    className='mx-auto my-[80px] shadow-[10px_-5px_45px_-5px] shadow-blue-200'
                >
                    <video
                        className="shadow-[20px_20px_rgba(255,255,255)]"
                        muted
                        loop
                        autoPlay
                    >
                        <source src={Banner} type="video/mp4" />
                    </video>
                </motion.div>

                {/* Code Section 1 */}
                <motion.div
                    variants={childVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <CodeBlocks
                        position={"lg:flex-row"}
                        heading={
                            <div className="text-4xl font-semibold">
                                Unlock your
                                <HighlightText text={"coding potential"} /> with our online
                                courses.
                            </div>
                        }
                        subheading={
                            <div>
                                Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.
                            </div>
                        }
                        ctabtn1={{
                            btnText: "Try it Yourself",
                            link: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "Learn More",
                            link: "/signup",
                            active: false,
                        }}
                        codeColor={"text-yellow-25"}
                        codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                        backgroundGradient={<div className="codeblock1 absolute"></div>}
                    />
                </motion.div>

                {/* Code Section 2 */}
                <motion.div
                    variants={childVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <CodeBlocks
                        position={"lg:flex-row-reverse"}
                        heading={
                            <div className="text-4xl font-semibold">
                                Start
                                <HighlightText text={"Coding in Seconds"} />
                            </div>
                        }
                        subheading={
                            <div>
                                Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson.
                            </div>
                        }
                        ctabtn1={{
                            btnText: "Continue Lessons",
                            link: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "Learn More",
                            link: "/signup",
                            active: false,
                        }}
                        codeColor={"text-yellow-10"}
                        codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                        backgroundGradient={<div className="codeblock2 absolute"></div>}
                    />
                </motion.div>

                <ExploreMore />
            </div>

            {/* Section 2 */}
            <div className='bg-pure-greys-5 text-richblue-700'>
                <div className='homepage_bg h-[333px]'>
                    <div className='w-11/12 max-w-maxContent flex flex-col justify-between items-center gap-8 mx-auto'>
                        <div className="lg:h-[150px]"></div>
                        <motion.div
                            variants={childVariants}
                            initial="hidden"
                            animate="visible"
                            className='flex gap-7 text-white lg:mt-8'
                        >
                            <CTAButton active={true} linkto={"/signup"}>
                                <div className='flex items-center gap-2'>
                                    Explore Full Catalog
                                    <FaArrowRight />
                                </div>
                            </CTAButton>
                            <CTAButton active={false} linkto={"/signup"}>
                                Learn More
                            </CTAButton>
                        </motion.div>
                    </div>
                </div>

                <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
                    <motion.div
                        variants={childVariants}
                        initial="hidden"
                        animate="visible"
                        className='mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0'
                    >
                        <div className='font-semibold text-4xl lg:w-[45%]'>
                            Get the skills you need for a <HighlightText text={"job that is in demand."} />
                        </div>
                        <div className='flex flex-col gap-10 lg:w-[40%] items-start'>
                            <div className='text-[16px]'>
                                The modern StudyNotion is the dictates its own terms. Today, to
                                be a competitive specialist requires more than professional
                                skills.
                            </div>
                            <CTAButton active={true} linkto={"/signup"}>
                                <div className="">Learn More</div>
                            </CTAButton>
                        </div>
                    </motion.div>

                    {/* Timeline Section */}
                    <TimelineSection />

                    {/* Learning Language Section */}
                    <LearningLanguageSection />
                </div>
            </div>

            {/* Section 3 */}
            <div className='relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>
                {/* Become an Instructor Section */}
                <InstructorSection />

                {/* Reviews from Other Learners */}
                <motion.h1
                    variants={childVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center text-4xl font-semibold mt-20"
                >
                    Reviews from other learners
                </motion.h1>
            </div>
            <ReviewSlider />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
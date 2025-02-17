import React from "react";
import { motion } from "framer-motion";
import CTAbutton from '../components/common/Button';
import astronaut from '../assets/Images/astro.png'

export function Error() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-richblack-900 via-richblack-800 to-richblack-900 p-6 relative overflow-hidden">
            {/* Parallax Background */}
            <div className="absolute inset-0 z-0">
                <div className="stars"></div>
                <div className="stars2"></div>
                <div className="stars3"></div>
            </div>

            {/* Floating Astronaut */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.5, type: "spring" }}
                className="relative z-10 "
            >
                <img
                    src={astronaut}
                    alt="Astronaut"
                    className="w-80 h-80 md:w-80 md:h-80 animate-float -mt-20 lg:-mt-14"
                />
            </motion.div>

            {/* Glowing Heading */}
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="-mt-5 text-4xl font-bold leading-snug text-richblack-5 md:text-5xl glow"
            >
                Error 404 <br /> You're Lost in Space!
            </motion.h1>

            {/* Animated Description */}
            <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="mt-5 mb-4 text-lg text-richblack-200 md:max-w-md mx-auto relative z-10"
            >
                Don&apos;t worry, our team is already on it. Please try refreshing the
                page or come back later.
            </motion.p>

            {/* Interactive Button */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="relative z-10"
            >
                <CTAbutton
                    children={"Launch Back Home"}
                    active={true}
                    linkto={"/"}
                    customClasses="hover:bg-yellow-400 hover:text-richblack-900 hover:scale-105 transition-all duration-300 transform hover:-translate-y-1"
                />
            </motion.div>
        </div>
    );
}

export default Error;

import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import Course_Card from './Course_Card'
import { Autoplay, FreeMode } from 'swiper/modules';


const CourseSlider = ({ Courses }) => {
    return (
        <div>
            {
                Courses.length ? (
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={25}
                        loop={true}
                        modules={[FreeMode, Autoplay]}
                        breakpoints={{
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false
                        }}
                        className="max-h-[30rem]"
                    >
                        {
                            Courses.map((course, i) => (
                                <SwiperSlide key={i}>
                                    <Course_Card course={course} height={"h-[250px]"} />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                ) : (
                    <p className="text-xl text-richblack-5">No Course Found</p>
                )
            }
        </div>
    )
}

export default CourseSlider
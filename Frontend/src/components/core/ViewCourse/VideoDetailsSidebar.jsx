import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import { BsChevronDown, BsChevronLeft, BsChevronRight } from "react-icons/bs"; // Import icons
import { IoIosArrowBack } from "react-icons/io";
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';

const VideoDetailsSidebar = ({ setReviewModal }) => {
    const [activeStatus, setActiveStatus] = useState("");
    const [videoBarActive, setVideoBarActive] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
    const navigate = useNavigate();
    const location = useLocation();
    const { courseId, sectionId, subsectionId } = useParams();
    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures,
    } = useSelector((state) => state.viewCourse);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        (() => {
            if (!courseSectionData?.length) return;
            const currentSectionIndex = courseSectionData.findIndex((data) => {
                return data._id === sectionId;
            });
            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subsection.findIndex((data) => {
                return data._id === subsectionId;
            });

            const activeSubSectionId = courseSectionData?.[currentSectionIndex]?.subsection?.[currentSubSectionIndex]?._id;

            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id); //section konsa active hai
            setVideoBarActive(activeSubSectionId); // video konsi chal rahi hai abhi/ subsection konsa khula hua hai
        })();
    }, [courseSectionData, courseEntireData, location.pathname]);

    // Function to handle lecture completion
    const handleLectureCompletion = async (subsectionId) => {
        const res = await markLectureAsComplete(
            { courseId: courseId, subsectionId: subsectionId },
            token
        );
        if (res) {
            dispatch(updateCompletedLectures(subsectionId));
        }
    };

    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed lg:relative h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-40`}
            >
                <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
                    <div className="flex w-full items-center justify-between ">
                        <div
                            onClick={() => {
                                navigate(`/dashboard/enrolled-courses`);
                            }}
                            className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
                            title="back"
                        >
                            <IoIosArrowBack size={30} />
                        </div>
                        <IconBtn
                            text="Add Review"
                            customClasses="ml-auto"
                            onClick={() => setReviewModal(true)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <p>{courseEntireData?.courseName}</p>
                        <p className="text-sm font-semibold text-richblack-500">
                            {completedLectures?.completeVideos?.length  } / {totalNoOfLectures}
                        </p>
                    </div>
                </div>

                <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
                    {courseSectionData.map((course, index) => (
                        <div
                            className="mt-2 cursor-pointer text-sm text-richblack-5"
                            onClick={() => setActiveStatus((prev) => (prev === course?._id ? "" : course?._id))}
                            key={index}
                        >
                            {/* Section */}
                            <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                                <div className="w-[70%] font-semibold">
                                    {course?.sectionName}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`${activeStatus === course?._id
                                            ? "rotate-0"
                                            : "rotate-180"
                                            } transition-all duration-500`}
                                    >
                                        <BsChevronDown />
                                    </span>
                                </div>
                            </div>

                            {/* Sub Sections */}
                            {activeStatus === course?._id && (
                                <div className="transition-[height] duration-500 ease-in-out">
                                    {course.subsection.map((topic, i) => (
                                        <div
                                            className={`flex gap-3 px-5 py-2 ${videoBarActive === topic._id
                                                ? "bg-yellow-200 font-semibold text-richblack-800"
                                                : "hover:bg-richblack-900"
                                                }`}
                                            key={i}
                                            onClick={() => {
                                                navigate(
                                                    `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                                                );
                                                setVideoBarActive(topic._id);
                                                setIsSidebarOpen(false); // Close sidebar on subsection click
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={completedLectures?.completeVideos?.includes(topic?._id)}
                                                onChange={() => handleLectureCompletion(topic._id)}
                                            />
                                            {topic.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Overlay to Block Clicks */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[1px] z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)} // Close sidebar when clicking outside
                />
            )}

            {/* Floating Menu Button for Mobile */}
            <button
                className="fixed bottom-4 left-4 p-2 bg-richblack-600 text-richblack-700 rounded-full shadow-lg lg:hidden z-50"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle sidebar on click
            >
                {isSidebarOpen ? <BsChevronLeft size={24} /> : <BsChevronRight size={24} />}
            </button>
        </>
    );
};

export default VideoDetailsSidebar;
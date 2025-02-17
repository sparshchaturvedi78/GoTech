import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import "video-react/dist/video-react.css";
import { BigPlayButton, Player } from "video-react";
import IconBtn from '../../common/IconBtn';

const VideoDetails = () => {
    const { courseId, sectionId, subsectionId } = useParams();
    const { token } = useSelector((state) => state.auth);
    const { courseSectionData, courseEntireData, completedLectures } =
        useSelector((state) => state.viewCourse);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const playerRef = useRef();

    const [videoData, setVideoData] = useState([]);
    const [previewSource, setPreviewSource] = useState("");
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            if (!courseSectionData.length) return;
            if (!courseId && !sectionId && !subsectionId) {
                navigate(`/dashboard/enrolled-courses`);
            } else {
                const filteredData = courseSectionData.filter(
                    (course) => course._id === sectionId
                );
                const filteredVideoData = filteredData?.[0]?.subsection.filter(
                    (data) => data._id === subsectionId
                );
                setVideoData(filteredVideoData[0]);
                setPreviewSource(courseEntireData.thumbnail);
                setVideoEnded(false);
            }
        })();
    }, [courseSectionData, courseEntireData, location.pathname]);

    // Check if the lecture is the first video of the course
    const isFirstVideo = () => {
        const currentSectionIndx = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const currentSubSectionIndx = courseSectionData[
            currentSectionIndx
        ].subsection.findIndex((data) => data._id === subsectionId);

        return currentSectionIndx === 0 && currentSubSectionIndx === 0;
    };

    // Check if the lecture is the last video of the course
    const isLastVideo = () => {
        const currentSectionIndx = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const noOfSubsections =
            courseSectionData[currentSectionIndx].subsection.length;

        const currentSubSectionIndx = courseSectionData[
            currentSectionIndx
        ].subsection.findIndex((data) => data._id === subsectionId);

        return (
            currentSectionIndx === courseSectionData.length - 1 &&
            currentSubSectionIndx === noOfSubsections - 1
        );
    };

    // Go to the next video
    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const noOfSubsections = courseSectionData[currentSectionIndex].subsection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subsection.findIndex(
            (data) => data._id === subsectionId
        );

        if (currentSubSectionIndex !== noOfSubsections - 1) {
            const nextSubSectionId = courseSectionData[currentSectionIndex].subsection[currentSubSectionIndex + 1]._id;
            navigate(
                `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
            );
        } else {
            const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
            const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subsection[0]._id;
            navigate(
                `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
            );
        }
    };

    // Go to the previous video
    const goToPrevVideo = () => {
        const currentSectionIndx = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const currentSubSectionIndx = courseSectionData[
            currentSectionIndx
        ].subsection.findIndex((data) => data._id === subsectionId);

        if (currentSubSectionIndx !== 0) {
            const prevSubSectionId =
                courseSectionData[currentSectionIndx].subsection[
                    currentSubSectionIndx - 1
                ]._id;
            navigate(
                `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
            );
        } else {
            const prevSectionId = courseSectionData[currentSectionIndx - 1]._id;
            const prevSubSectionLength =
                courseSectionData[currentSectionIndx - 1].subsection.length;
            const prevSubSectionId =
                courseSectionData[currentSectionIndx - 1].subsection[
                    prevSubSectionLength - 1
                ]._id;
            navigate(
                `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
            );
        }
    };

    const handleLectureCompletion = async () => {
        setLoading(true);
        const res = await markLectureAsComplete(
            { courseId: courseId, subsectionId: subsectionId },
            token
        );
        if (res) {
            dispatch(updateCompletedLectures(subsectionId));
        }
        setLoading(false);
    };

    // Auto-play video when navigating or rewatching
    const playVideo = () => {
        if (playerRef.current) {
            playerRef.current.play();
        }
    };

    // Handle rewatch button click
    const handleRewatch = () => {
        if (playerRef.current) {
            playerRef.current.seek(0);
            setVideoEnded(false);
            playVideo();
        }
    };

    // Handle next/prev button click
    const handleNavigation = (navigateFunction) => {
        navigateFunction();
        playVideo();
    };

    return (
        <div className="flex flex-col gap-5 text-white p-4">
            {!videoData ? (
                <img
                    src={previewSource}
                    alt="Preview"
                    className="h-full w-full rounded-md object-cover"
                />
            ) : (
                <div className="relative w-full aspect-video">
                    <Player
                        ref={playerRef}
                        aspectRatio="16:9"
                        playsInline
                        onEnded={() => setVideoEnded(true)}
                        src={videoData?.videoUrl}
                    >
                        <BigPlayButton position="center" />
                        {/* Render When Video Ends */}
                        {videoEnded && (
                            <div
                                style={{
                                    backgroundImage:
                                        "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                                }}
                                className="full absolute inset-0 z-[10] grid h-full place-content-center font-inter"
                            >
                                {!completedLectures?.completeVideos?.includes(subsectionId) && (
                                    <IconBtn
                                        disabled={loading}
                                        onClick={() => handleLectureCompletion()}
                                        text={!loading ? "Mark As Completed" : "Loading..."}
                                        customClasses="text-xl max-w-max px-4 mx-auto"
                                    />
                                )}
                                <IconBtn
                                    disabled={loading}
                                    onClick={handleRewatch}
                                    text="Rewatch"
                                    customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                                />
                                <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                                    {!isFirstVideo() && (
                                        <button
                                            disabled={loading}
                                            onClick={() => handleNavigation(goToPrevVideo)}
                                            className="blackButton"
                                        >
                                            Prev
                                        </button>
                                    )}
                                    {!isLastVideo() && (
                                        <button
                                            disabled={loading}
                                            onClick={() => handleNavigation(goToNextVideo)}
                                            className="blackButton"
                                        >
                                            Next
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </Player>
                </div>
            )}

            <h1 className="mt-4 text-2xl sm:text-3xl font-semibold">{videoData?.title}</h1>
            <p className="pt-2 pb-6 text-sm sm:text-base">{videoData?.description}</p>
        </div>
    );
};

export default VideoDetails;
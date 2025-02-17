import React, { useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar'
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal'
import { useDispatch, useSelector } from 'react-redux'
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI'
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice'

const ViewCourse = () => {
    const [reviewModal, setReviewModal] = useState(null)
    const { courseId } = useParams();
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch();

    useEffect(() => {
        const setCourseSpecificDetails = async () => {
            const courseData = await getFullDetailsOfCourse(courseId, token)
            if (courseData) {
                dispatch(setCourseSectionData(courseData?.courseDetail?.courseContent))
                dispatch(setEntireCourseData(courseData?.courseDetail))
                dispatch(setCompletedLectures(courseData?.completedVideos))
                let lectures = 0
                courseData?.courseDetail?.courseContent?.forEach((sec) => {
                    lectures += sec?.subsection?.length
                    
                })
                dispatch(setTotalNoOfLectures(lectures))
            }
        }
        setCourseSpecificDetails();
    }, [])

    return (
        <div>
            <div className="relative flex min-h-[calc(100vh-3.5rem)]">
                <VideoDetailsSidebar setReviewModal={setReviewModal} />
                <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                    <div className="mx-6">
                        <Outlet />
                    </div>
                </div>
            </div>
            {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
        </div>
    )
}

export default ViewCourse
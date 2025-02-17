import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import RenderCourseSteps from '../AddCourses/RenderCourseSteps';
import { getFullDetailsOfCourse } from '../../../../services/operations/courseDetailsAPI';
import { setCourse, setEditCourse } from '../../../../slices/courseSlice';

const index = () => {

    const dispatch = useDispatch();
    const { courseId } = useParams();
    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(null);


    useEffect(() => {
        const populateCourseDetail = async () => {
            setLoading(true);
            const result = await getFullDetailsOfCourse(courseId, token);
            if (result?.courseDetail) {
                dispatch(setEditCourse(true));
                dispatch(setCourse(result?.courseDetail))
            }
            setLoading(false);
        }
        populateCourseDetail();
    }, [])

    if (loading) {
        return (
            <div className="grid flex-1 place-items-center">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div>
            <h1 className="mb-14 text-3xl font-medium text-richblack-5">Edit Course</h1>
            <div className="mx-auto max-w-[600px]">
                {
                    course ? (<RenderCourseSteps />) : (<p className="mt-14 text-center text-3xl font-semibold text-richblack-100">No Course Found</p>)
                }
            </div>
        </div>
    )
}

export default index
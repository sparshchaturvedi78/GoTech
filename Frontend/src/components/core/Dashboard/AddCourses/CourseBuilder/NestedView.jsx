import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillCaretDown } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { RxDropdownMenu } from 'react-icons/rx';
import ConfirmationModal from '../../../../common/ConfirmationModal';
import SubSectionModal from './SubSectionModal';
import { deleteSection, deleteSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';

const NestedView = ({ handleChangeEditSectionName }) => {
    const { token } = useSelector((state) => state.auth);
    const { course } = useSelector((state) => state.course);
    const dispatch = useDispatch();

    const [addSubSection, setAddSubSection] = useState(null);
    const [editSubSection, setEditSubSection] = useState(null);
    const [viewSubSection, setViewSubSection] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);

    const handleDeleteSection = async (sectionId) => {
        const result = await deleteSection({
            sectionId,
            courseId: course._id,
            token,
        });

        if (result) {
            dispatch(setCourse(result));
            toast.success('Section Deleted Successfully');
        } else {
            toast.error('Failed to delete section');
        }
        setConfirmationModal(null);
    };

    const handleDeleteSubSection = async (subSectionId, sectionId) => {
        const result = await deleteSubSection({ sectionId, subSectionId, token });
        if (result) {
            const updatedCourseContent = course.courseContent.map((section) =>
                section._id === sectionId ? result : section
            );
            const updatedCourse = { ...course, courseContent: updatedCourseContent };
            dispatch(setCourse(updatedCourse));
            toast.success('Lecture Deleted Successfully');
        } else {
            toast.error('Failed to delete Lecture');
        }
        setConfirmationModal(null);
    };

    return (
        <div className="w-full">
            <div
                className="rounded-lg bg-richblack-700 p-4 md:p-6 lg:px-8 flex flex-col gap-5"
                id="nestedViewContainer"
            >
                {course?.courseContent?.map((section) => (
                    <details key={section._id} open>
                        <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                            <div className="flex items-center gap-x-3">
                                <RxDropdownMenu className="text-xl md:text-2xl text-richblack-50" />
                                <p className="font-semibold text-sm md:text-base text-richblack-50">
                                    {section.sectionName}
                                </p>
                            </div>
                            <div className="flex items-center gap-x-3">
                                <button
                                    onClick={() =>
                                        handleChangeEditSectionName(section._id, section.sectionName)
                                    }
                                >
                                    <MdEdit className="text-lg md:text-xl text-richblack-300" />
                                </button>
                                <button
                                    onClick={() => {
                                        setConfirmationModal({
                                            text1: 'Delete this section',
                                            text2: 'All the lectures in this section will be deleted',
                                            btn1Text: 'Delete',
                                            btn2Text: 'Cancel',
                                            bt1Handler: () => handleDeleteSection(section._id),
                                            bt2Handler: () => setConfirmationModal(null),
                                        });
                                    }}
                                >
                                    <RiDeleteBin6Line className="text-lg md:text-xl text-richblack-300" />
                                </button>
                                <span className="font-medium text-richblack-300 hidden md:block">|</span>
                                <AiFillCaretDown className="text-lg md:text-xl text-richblack-300" />
                            </div>
                        </summary>
                        <div className="px-4 md:px-6 pb-4">
                            {/* Render All Sub Sections Within a Section */}
                            {section.subsection.map((data) => (
                                <div
                                    key={data?._id}
                                    onClick={() => setViewSubSection(data)}
                                    className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                                >
                                    <div className="flex items-center gap-x-3 py-2">
                                        <RxDropdownMenu className="text-xl md:text-2xl text-richblack-50" />
                                        <p className="font-semibold text-sm md:text-base text-richblack-50">
                                            {data.title}
                                        </p>
                                    </div>
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-x-3"
                                    >
                                        <button
                                            onClick={() => {
                                                setEditSubSection({ ...data, sectionId: section._id });
                                            }}
                                        >
                                            <MdEdit className="text-lg md:text-xl text-richblack-300" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setConfirmationModal({
                                                    text1: 'Delete this Sub-Section?',
                                                    text2: 'This lecture will be deleted',
                                                    btn1Text: 'Delete',
                                                    btn2Text: 'Cancel',
                                                    bt1Handler: () =>
                                                        handleDeleteSubSection(data._id, section._id),
                                                    bt2Handler: () => setConfirmationModal(null),
                                                });
                                            }}
                                        >
                                            <RiDeleteBin6Line className="text-lg md:text-xl text-richblack-300" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Add New Lecture to Section */}
                            <button
                                onClick={() => setAddSubSection(section._id)}
                                className="mt-5 flex items-center gap-x-1 text-yellow-50"
                            >
                                <FaPlus className="text-lg" />
                                <p className="text-sm md:text-base">Add Lecture</p>
                            </button>
                        </div>
                    </details>
                ))}
            </div>

            {/* Modal Display */}
            {addSubSection ? (
                <SubSectionModal
                    modalData={addSubSection}
                    setModalData={setAddSubSection}
                    add={true}
                />
            ) : editSubSection ? (
                <SubSectionModal
                    modalData={editSubSection}
                    setModalData={setEditSubSection}
                    edit={true}
                />
            ) : viewSubSection ? (
                <SubSectionModal
                    modalData={viewSubSection}
                    setModalData={setViewSubSection}
                    view={true}
                />
            ) : (
                <div></div>
            )}

            {/* Confirmation Modal */}
            {confirmationModal ? <ConfirmationModal modalData={confirmationModal} /> : <></>}
        </div>
    );
};

export default NestedView;
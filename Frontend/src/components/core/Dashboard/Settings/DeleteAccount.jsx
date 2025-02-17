import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProfile } from '../../../../services/operations/SettingsAPI';
import { FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../../common/ConfirmationModal';

const DeleteAccount = () => {
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [confirmationModal, setConfirmationModal] = useState(null);

    async function handleDeleteAccount() {
        try {
            dispatch(deleteProfile(token, navigate));
        } catch (error) {
            console.log('ERROR MESSAGE - ', error.message);
        }
    }

    return (
        <>
            <div className="my-10 flex flex-col sm:flex-row gap-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-6 sm:p-8 sm:px-12">
                {/* Icon */}
                <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
                    <FiTrash2 className="text-3xl text-pink-200" />
                </div>

                {/* Content */}
                <div className="flex flex-col space-y-2">
                    <h2 className="text-lg font-semibold text-richblack-5">Delete Account</h2>
                    <div className="w-full sm:w-3/5 text-pink-25">
                        <p>Would you like to delete account?</p>
                        <p>
                            This account may contain Paid Courses. Deleting your account is permanent and
                            will remove all the content associated with it.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="w-fit cursor-pointer italic text-pink-300"
                        onClick={() =>
                            setConfirmationModal({
                                text1: 'Are you sure?',
                                text2: 'Your account will be deleted permanently.',
                                btn1Text: 'Delete',
                                btn2Text: 'Cancel',
                                bt1Handler: handleDeleteAccount,
                                bt2Handler: () => setConfirmationModal(null),
                            })
                        }
                    >
                        I want to delete my account.
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </>
    );
};

export default DeleteAccount;
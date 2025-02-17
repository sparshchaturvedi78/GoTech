import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import { updateProfile } from '../../../../services/operations/SettingsAPI';
import { useForm } from 'react-hook-form';
import IconBtn from '../../../common/IconBtn';
import { setLoading } from '../../../../slices/authSlice';

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

const EditProfile = () => {
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()



    const submitProfileForm = async (data) => {
        // console.log("Form Data - ", data)
        try {
            dispatch(updateProfile(token, data))

        } catch (error) {
            console.log("ERROR MESSAGE - ", error.message)
        }
    }


    return (
        <>
            <form onSubmit={handleSubmit(submitProfileForm)}>
                <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                    <h1 className="text-lg font-semibold text-richblack-5">Profile Information</h1>
                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor='firstName' className='lable-style'>
                                First Name
                            </label>
                            <input
                                type="text"
                                name='firstName'
                                id='firstName'
                                placeholder='Enter First Name'
                                className='form-style'
                                defaultValue={user?.firstName}
                                {...register('firstName', { required: true })}
                            />
                            {errors.firstName && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    Please enter your first name.
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="lastName" className='lable-style'>
                                Last Name
                            </label>
                            <input
                                type="text"
                                name='lastName'
                                id='lastName'
                                placeholder='Enter Last Name'
                                className='form-style'
                                defaultValue={user?.lastName}
                                {...register('lastName', { required: true })}
                            />
                            {errors.lastName && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    Please enter your last name
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="dateOfBirth" className='lable-style'>Date of Birth</label>
                            <input
                                type="date"
                                name='dateOfBirth'
                                id='dateOfBirth'
                                className='form-style'
                                defaultValue={user?.additionalDetails?.dateOfBirth}
                                {...register('dateOfBirth', {
                                    require: {
                                        value: true,
                                        message: 'Please enter your Date of Birth'
                                    },
                                    max: {
                                        value: new Date().toString().split("T")[0],
                                        message: "Date of Birth cannot be in the future.",
                                    }
                                })}
                            />
                            {errors.dateOfBirth && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    {errors.dateOfBirth.message}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="gender" className='lable-style'>Gender</label>
                            <select
                                type='text'
                                name="gender"
                                id="gender"
                                className="form-style"
                                {...register("gender", { required: true })}
                                defaultValue={user?.additionalDetails?.gender}
                            >
                                {genders.map((ele, i) => {
                                    return (
                                        <option key={i} value={ele}>
                                            {ele}
                                        </option>
                                    )
                                })}
                            </select>
                            {errors.gender && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    Please enter your Date of Birth.
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="contactNumber" className="lable-style">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                name="contactNumber"
                                id="contactNumber"
                                placeholder="Enter Contact Number"
                                className="form-style"
                                {...register("contactNumber", {
                                    maxLength: { value: 12, message: "Invalid Contact Number" },
                                    minLength: { value: 10, message: "Invalid Contact Number" },
                                })}
                                defaultValue={user?.additionalDetails?.contactNumber}
                            />
                            {errors.contactNumber && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    {errors.contactNumber.message}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="about" className="lable-style">
                                About
                            </label>
                            <input
                                type="text"
                                name="about"
                                id="about"
                                placeholder="Enter Bio Details"
                                className="form-style"
                                {...register("about",)}
                                defaultValue={user?.additionalDetails?.about}
                            />
                            {errors.about && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    Please enter your About.
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            navigate("/dashboard/my-profile")
                        }}
                        className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                    >
                        Cancel
                    </button>
                    <IconBtn  type="submit" text="Save"/>
                </div>
            </form>
        </>
    )
}

export default EditProfile
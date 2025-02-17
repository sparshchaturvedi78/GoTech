import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../../services/ApiConnector";
import { contactusEndpoint } from "../../../services/Apis";
import countryCode from "../../../data/countrycode.json"

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful },
    } = useForm();

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({
                firstName: "",
                lastName: "",
                email: "",
                phoneNo: "",
                message: "",
            });
        }
    }, [reset, isSubmitSuccessful]);

    const submitContactForm = async (data) => {
        // console.log("Form data",data);
        try {
            setLoading(true);
            const res = await apiConnector(
                "POST",
                contactusEndpoint.CONTACT_US_API,
                data
            )
            // console.log("submit res",res);
            setLoading(false);
        } catch (err) {
            console.log("Error Message", err.message);
            setLoading(false);
        }
    };

    return (
        <div className="">
            <form
                className="flex flex-col gap-7"
                onSubmit={handleSubmit(submitContactForm)}
            >

                {/* fistName-Lastname */}
                <div className="flex flex-col gap-5 lg:flex-row">
                    {/* firstname */}
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="firstName" className="lable-style">
                            First Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter first Name"
                            id="firstName"
                            name="firstName"
                            className="form-style"
                            {...register("firstName", { required: true })}
                        />
                        {errors.firstName && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                please enter your name
                            </span>
                        )}
                    </div>

                    {/* lastName */}
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="lastname" className="lable-style">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Enter last name"
                            className="form-style"
                            {...register("lastName", { required: true })}
                        />
                        {errors.lastName && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                please enter your lastname
                            </span>
                        )}
                    </div>

                </div>

                {/* email */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="lable-style">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter email address"
                        className="form-style"
                        {...register("email", { required: true })}
                    />
                    {errors.email && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your Email address.
                        </span>
                    )}
                </div>


                {/* PhoneNo */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="phoneNo">Phone Number</label>
                    <div className="flex flex-row gap-5">

                        {/* dropdown */}
                        <div className="flex w-[81px] flex-col gap-2">
                            <select
                                name="dropdown"
                                id="dropdown"
                                defaultValue="+91"
                                {...register("countrycode", { required: true })}
                                className="form-style"
                            >
                                {
                                    countryCode.map((code, index) => {
                                        return (
                                            <option key={index} value={code.code}>
                                                {code.code} - {code.country}
                                            </option>
                                        );
                                    })
                                }
                            </select>
                        </div>

                        {/* phoneno field */}
                        <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                            <input
                                type="number" // Using text to avoid spinners
                                id="phoneNo"
                                name="phoneNo"
                                placeholder="12345 67890"
                                className="form-style "
                                {...register("phoneNo", {
                                    required: {
                                        value: true,
                                        message: "Please Enter Your Phone No",
                                    },
                                    maxLength: { value: 12, message: "Invalid Phone Number" },
                                    minLength: { value: 10, message: "Invalid Phone Number" },
                                })}
                            />
                        </div>

                    </div>
                    {errors.phoneNo && (
                        <span>
                            {
                                errors.phoneNo.message
                            }
                        </span>)}
                </div>

                {/* message */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="textArea" className="lable-style">Message</label>

                    <textarea
                        name="message"
                        id="message"
                        cols={30}
                        rows={7}
                        className="form-style"
                        placeholder="Enter your message here"
                        {...register("message", { required: true })}
                    />
                    {
                        errors.message && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please Enter Your Message
                            </span>
                        )
                    }
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${!loading &&
                        "transition-all duration-200 hover:scale-95 hover:shadow-none"
                        }  disabled:bg-richblack-500 sm:text-[16px] `}
                >
                    Send Message
                </button>
            </form>

        </div>
    );
};

export default ContactUsForm;

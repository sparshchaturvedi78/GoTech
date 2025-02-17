import React from 'react'
import Button from '../components/common/Button'
import { Link } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'

const ResetCompleted = () => {
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                    <div className="max-w-[500px] p-4 lg:p-8">
                        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                            Reset Completed
                        </h1>
                        <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                            All done. We have sent an email to confirm 
                        </p>

                        <Button children={"Return to login"} active={true} linkto={"/login"} />
                        {/* <div className="mt-6 flex items-center justify-between">
                            <Link to={"/login"}>
                                <p className="flex items-center gap-x-2 text-richblack-5">
                                    <BiArrowBack/> Back to Login
                                </p>
                            </Link>
                        </div> */}
                    </div>
        </div>
  )
}

export default ResetCompleted
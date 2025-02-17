import React from 'react'
import ReviewSlider from '../components/common/ReviewSlider'
import Footer from '../components/common/Footer'
import ContactUsForm from '../components/core/About/ContactUsForm'
import ContactDetails from '../components/core/Contact/ContactDetails'

const ContactUs = () => {


    return (
        <div>
            <div className="mx-auto mt-16 flex w-11/12 max-w-maxContent flex-col justify-between text-white lg:flex-row py-5">
                <div className="lg:w-[40%]">
                    <ContactDetails/>
                </div>
                <div className="mt-16 lg:w-[50%] border border-richblack-200 p-8 rounded-xl">
                    <ContactUsForm/>
                </div>
            </div>
            <div className="relative mx-auto  flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                {/* Reviws from Other Learner */}
                <h1 className="text-center text-4xl font-semibold mt-20">
                    Reviews from other learners
                </h1>
                <ReviewSlider />
            </div>
            <Footer />
        </div>
    )
}

export default ContactUs
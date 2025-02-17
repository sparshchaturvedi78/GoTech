import React from 'react'
import ContactUsForm from '../core/About/ContactUsForm'

const ContactForm = () => {
  return (
    <div className="mx-auto mt-16 flex w-11/12 max-w-maxContent flex-col justify-between text-white lg:flex-row">
      <div>
      <h1 className="text-center text-4xl font-semibold">Get in Touch</h1>
      <p className="text-center text-richblack-300 mt-3">
        We&apos;d love to here for you, Please fill out this form.
      </p>
      </div>
      <div className="mt-16 lg:w-[50%] border border-richblack-200 p-8 rounded-xl">
        <ContactUsForm />
      </div>
    </div>
  )
}

export default ContactForm
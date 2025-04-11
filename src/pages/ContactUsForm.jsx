import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { apiConnector } from "../serivces/apiConnector"
import { userEndpoints } from "../serivces/apis"

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  const submitContactForm = async (data) => {
    // console.log("Form Data - ", data)
    try {
      setLoading(true)
      const res = await apiConnector(
        "POST",
        userEndpoints.CONTACT_US_API,
        data
      )
      // console.log("Email Res - ", res)
      setLoading(false)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      })
    }
  }, [reset, isSubmitSuccessful])

  return (
    <div className="bg-gray-100 py-8 mt-[62px]">
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Contact Us
      </h2>
      <form
        className="bg-white shadow-md rounded-md p-6"
        onSubmit={handleSubmit(submitContactForm)}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="firstname"
              className="text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              className="py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
              {...register("firstname", {
                required: "Please enter your first name",
              })}
            />
            {errors.firstname && (
              <p className="text-xs text-red-500">{errors.firstname.message}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="lastname"
              className="text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              className="py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
              {...register("lastname")}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
              {...register("email", {
                required: "Please enter your email address",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="message"
              className="text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              className="py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
              {...register("message", { required: "Please enter your message" })}
            />
            {errors.message && (
              <p className="text-xs text-red-500">{errors.message.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 transition duration-300"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>

      <div className="mt-8 bg-white shadow-md rounded-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Location</h3>
        <div className="flex items-center mb-4">
          <i className="fas fa-map-marker-alt text-2xl text-blue-500 mr-3"></i>
          {/* <div>
            <h4 className="text-lg font-semibold text-gray-800">N. K ENTERPRISES</h4>
            <p className="text-gray-600">Jodhpur Road, Pipar City, Dist. Jodhpur, 342601</p>
          </div> */}
        </div>
        <div className="w-full aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d228974.42754781805!2d72.86572683929448!3d26.270573216973286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418c4eaa06ccb9%3A0x8114ea5b0ae1abb8!2sJodhpur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1718273199672!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
  
  )
}

export default ContactUsForm

"use client"

import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { SessionContext } from "../contexts"
import Navbar from "../components/Navbar"
import { API_URL } from "../constants"

function Application() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const session = useContext(SessionContext)

  // Personal Information
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [age, setAge] = useState("")
  const [location, setLocation] = useState("")

  // Education and Experience
  const [education, setEducation] = useState("")
  const [workExperience, setWorkExperience] = useState("")
  const [skills, setSkills] = useState("")

  // Application Details
  const [fitAnswer, setFitAnswer] = useState("")
  const [resumeUrl, setResumeUrl] = useState("")

  // Prevent unauthorized users from accessing this page
  useEffect(() => {
    if (session.username === null) {
      navigate("/login")
    } else if (!session.roles.includes("student")) {
      navigate("/portal")
    }
  }, [session])

  const handleSubmit = () => {
    // Ensure all required fields are filled in
    if (
      fullName === "" ||
      email === "" ||
      phoneNumber === "" ||
      age === "" ||
      location === "" ||
      education === "" ||
      workExperience === "" ||
      skills === "" ||
      fitAnswer === "" ||
      resumeUrl === ""
    ) {
      return toast.error("Please fill in all fields")
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email address")
    }

    // Validate age is a number
    if (isNaN(Number(age)) || Number(age) < 16 || Number(age) > 100) {
      return toast.error("Please enter a valid age between 16 and 100")
    }

    // Validate the resume URL
    try {
      new URL(resumeUrl)
      if (!resumeUrl.startsWith("http://") && !resumeUrl.startsWith("https://")) {
        throw new Error()
      }
    } catch {
      return toast.error("Invalid resume URL")
    }

    fetch(`${API_URL}/internship/${id}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email,
        phoneNumber,
        age: Number(age),
        location,
        education,
        workExperience,
        skills,
        fitAnswer,
        resumeUrl,
      }),
      credentials: "include",
      mode: "cors",
    })
      .then((res) => {
        if (res.ok) {
          alert("Application submitted successfully!")
          navigate("/portal")
        } else {
          toast.error("An error occurred")
        }
      })
      .catch(() => {
        toast.error("An error occurred")
      })
  }

  const handleClear = () => {
    // Clear personal information
    setFullName("")
    setEmail("")
    setPhoneNumber("")
    setAge("")
    setLocation("")

    // Clear education and experience
    setEducation("")
    setWorkExperience("")
    setSkills("")

    // Clear application details
    setFitAnswer("")
    setResumeUrl("")
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto my-10 grid grid-cols-12">
        <div className="col-span-1">{/* Offset the application page contents using an empty div */}</div>
        <div className="col-span-10">
          <h1 className="text-3xl font-semibold text-center">Apply to Posting</h1>

          {/* Personal Information Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Full Name</span>
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
                  placeholder="Enter your full name"
                  onChange={(e) => setFullName(e.target.value)}
                  value={fullName}
                />
              </div>
              <div>
                <span className="font-semibold">Email</span>
                <input
                  type="email"
                  className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
                  placeholder="Enter your email address"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div>
                <span className="font-semibold">Phone Number</span>
                <input
                  type="tel"
                  className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
                  placeholder="Enter your phone number"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  value={phoneNumber}
                />
              </div>
              <div>
                <span className="font-semibold">Age</span>
                <input
                  type="number"
                  className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
                  placeholder="Enter your age"
                  min="16"
                  max="100"
                  onChange={(e) => setAge(e.target.value)}
                  value={age}
                />
              </div>
            </div>
            <div className="mt-4">
              <span className="font-semibold">Location</span>
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
                placeholder="Enter your city, state, and country"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
              />
            </div>
          </div>

          {/* Education and Experience Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Education and Experience</h2>
            <div>
              <span className="font-semibold">Education</span>
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
                placeholder="Enter your highest level of education and institution"
                onChange={(e) => setEducation(e.target.value)}
                value={education}
              />
            </div>
            <div className="mt-4">
              <span className="font-semibold">Work Experience</span>
              <textarea
                className="w-full border border-gray-300 rounded-md mt-1 py-2 px-3"
                rows={5}
                placeholder="Describe your relevant work experience"
                onChange={(e) => setWorkExperience(e.target.value)}
                value={workExperience}
              />
            </div>
            <div className="mt-4">
              <span className="font-semibold">Skills</span>
              <textarea
                className="w-full border border-gray-300 rounded-md mt-1 py-2 px-3"
                rows={3}
                placeholder="List your relevant skills"
                onChange={(e) => setSkills(e.target.value)}
                value={skills}
              />
            </div>
          </div>

          {/* Application Details Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Application Details</h2>
            <div>
              <span className="font-semibold">Why are you a good fit for this position?</span>
              <textarea
                className="w-full border border-gray-300 rounded-md mt-1 py-2 px-3"
                rows={10}
                placeholder="Explain why you are a good fit for this position"
                onChange={(e) => setFitAnswer(e.target.value)}
                value={fitAnswer}
              />
            </div>
            <div className="mt-4">
              <span className="font-semibold">Resume URL</span>
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
                placeholder="Enter Resume URL"
                onChange={(e) => setResumeUrl(e.target.value)}
                value={resumeUrl}
              />
            </div>
          </div>

          <div className="my-6 mx-auto grid grid-cols-2 gap-4 content-center w-60">
            <button className="bg-primary text-white rounded-lg py-3 font-semibold" onClick={handleSubmit}>
              Submit
            </button>
            <button className="border border-primary rounded-lg py-3 font-semibold" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  )
}

export default Application


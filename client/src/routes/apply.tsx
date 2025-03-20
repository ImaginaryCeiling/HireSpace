import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { SessionContext } from "../contexts";
import Navbar from "../components/Navbar";
import { API_URL } from "../constants";

function Application() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const session = useContext(SessionContext);
  const [fitAnswer, setFitAnswer] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  // Prevent unauthorized users from accessing this page
  useEffect(() => {
    if (session.username === null) {
      navigate("/login");
    } else if (!session.roles.includes("student")) {
      navigate("/");
    }
  }, [session]);

  const handleSubmit = () => {
    // Ensure all fields are filled in
    if (fitAnswer === "" || resumeUrl === "") {
      return toast.error("Please fill in all fields");
    }

    // Validate the resume URL
    try {
      new URL(resumeUrl);
      if (
        !resumeUrl.startsWith("http://") &&
        !resumeUrl.startsWith("https://")
      ) {
        throw new Error();
      }
    } catch {
      return toast.error("Invalid resume URL");
    }

    fetch(`${API_URL}/internship/${id}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fitAnswer,
        resumeUrl,
      }),
      credentials: "include",
      mode: "cors",
    })
      .then((res) => {
        if (res.status === 200) {
          alert("Application submitted successfully!");
          navigate("/");
        } else {
          toast.error("An error occurred");
        }
      })
      .catch(() => {
        toast.error("An error occurred");
      });
  };

  const handleClear = () => {
    setFitAnswer("");
    setResumeUrl("");
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto my-10 grid grid-cols-12">
        <div className="col-span-1">
          {/* Offset the application page contents using an empty div */}
        </div>
        <div className="col-span-10">
          <h1 className="text-3xl font-semibold text-center">
            Apply to Posting
          </h1>
          <div className="mt-4">
            <span className="font-semibold">Why are you a good fit for this position?</span>
            <textarea
              className="w-full border border-gray-300 rounded-md mt-1 py-2 px-3"
              rows={20}
              placeholder="Explain why you are a good fit for this position"
              onChange={(e) => {
                setFitAnswer(e.target.value);
              }}
              value={fitAnswer}
            />
          </div>
          <div className="mt-2">
            <span className="font-semibold">Resume URL</span>
            <input
              type="text"
              className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
              placeholder="Enter Resume URL"
              onChange={(e) => {
                setResumeUrl(e.target.value);
              }}
              value={resumeUrl}
            />
          </div>
          <div className="my-4 mx-auto grid grid-cols-2 gap-4 content-center w-60">
            <button
              className="bg-primary text-white rounded-lg py-3 font-semibold"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="border border-primary rounded-lg py-3 font-semibold"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default Application;
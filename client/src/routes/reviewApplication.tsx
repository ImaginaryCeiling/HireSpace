import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { SessionContext } from "../contexts";
import Navbar from "../components/Navbar";
import { API_URL } from "../constants";

function ReviewApplication() {
  const navigate = useNavigate();
  const session = useContext(SessionContext);
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [internship, setInternship] = useState<any>(null);

  // Ensure only employers can access this page
  useEffect(() => {
    if (!session.roles.includes("employer")) {
      navigate("/portal");
    }
  }, [session]);

  // Fetch the application data
  useEffect(() => {
    fetch(`${API_URL}/application/${id}`, {
        credentials: 'include'
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setApplication(data);
      } else {
        toast.error("Failed to fetch application data");
      }
    });
  }, [id]);

  // Fetch the user and internship data
  useEffect(() => {
    if (application) {
      fetch(`${API_URL}/profile/${application.user}`).then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          toast.error("Failed to fetch applicant data");
        }
      });

      fetch(`${API_URL}/internship/${application.internship}`).then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setInternship(data);
        } else {
          toast.error("Failed to fetch internship data");
        }
      });
    }
  }, [application]);

  return (
    <div>
      <Navbar />
      <div className="container my-10 px-10 mx-auto">
        <h1 className="text-3xl text-center font-semibold">
          Application for {internship?.title}
        </h1>
        <p className="text-center text-lg my-1">
          Submitted by <u className="font-semibold">{user?.username}</u>
        </p>
        <p className="text-center text-lg text-gray-600 my-1">
          {internship?.companyName}
        </p>
        <h3 className="text-2xl font-semibold text-center mt-10">
          Why the Candidate is a Good Fit
        </h3>
        <p className="lg:text-justify text-lg mt-2">
          {application?.fitAnswer
            .split("\n")
            .map((line: string, i: number) => (
              <Fragment key={i}>
                {line}
                <br />
              </Fragment>
            ))}
        </p>
        <div className="my-4 mx-auto grid grid-cols-1 gap-4 content-center w-full md:w-96">
          <a
            href={application?.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-white rounded-lg py-3 font-semibold text-center"
          >
            View Resume
          </a>
        </div>
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-center">Application Details</h3>
          <p className="text-lg mt-2"><strong>Full Name:</strong> {application?.fullName}</p>
          <p className="text-lg mt-2"><strong>Email:</strong> {application?.email}</p>
          <p className="text-lg mt-2"><strong>Phone Number:</strong> {application?.phoneNumber}</p>
          <p className="text-lg mt-2"><strong>Age:</strong> {application?.age}</p>
          <p className="text-lg mt-2"><strong>Location:</strong> {application?.location}</p>
          <p className="text-lg mt-2"><strong>Education:</strong> {application?.education}</p>
          <p className="text-lg mt-2"><strong>Work Experience:</strong> {application?.workExperience}</p>
          <p className="text-lg mt-2"><strong>Skills:</strong> {application?.skills}</p>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default ReviewApplication;

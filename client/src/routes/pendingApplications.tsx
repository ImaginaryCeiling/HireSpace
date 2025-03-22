import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../contexts";
import Navbar from "../components/Navbar";
import ApplicationSummary from "../components/ApplicationSummary";
import { API_URL } from "../constants";

function PendingApplications() {
  const navigate = useNavigate();
  const session = useContext(SessionContext);
  const [applications, setApplications] = useState<any[]>([]);
  const [users, setUsers] = useState<{ [key: string]: any }>({});
  const [internships, setInternships] = useState<{ [key: string]: any }>({});

  // Ensure only employers can access this page
  useEffect(() => {
    if (!session.roles.includes("employer")) {
      navigate("/portal");
    }
  }, [session]);

  // Fetch the applications from the backend
  useEffect(() => {
    fetch(`${API_URL}/applications/pending`, {
      credentials: "include",
      mode: "cors",
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setApplications(data);
        });
      }
    });
  }, []);

  // Fetch the users and internships from the backend
  useEffect(() => {
    applications.forEach((application) => {
      // Fetch user data
      fetch(`${API_URL}/profile/${application.user}`, {
        credentials: "include",
        mode: "cors",
      }).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setUsers((prev) => ({ ...prev, [application.user]: data }));
          });
        }
      });

      // Fetch internship data
      fetch(`${API_URL}/internship/${application.internship}`, {
        credentials: "include",
        mode: "cors",
      }).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setInternships((prev) => ({ ...prev, [application.internship]: data }));
          });
        }
      });
    });
  }, [applications]);

  return (
    <div>
      <Navbar />
      <div className="container px-6 mx-auto mt-10">
        <h1 className="text-3xl font-semibold text-center">
          Applications Pending Review
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Showing {applications.length} application
          {applications.length !== 1 && "s"}
        </p>
        {applications.length === 0 && (
          <p className="text-xl text-center text-gray-600 mt-5">
            No applications pending review
          </p>
        )}
        <div className="mt-5 divide-y">
          {applications.map((application) => (
            <ApplicationSummary
              key={application?._id}
              application={application}
              user={users[application?.user]}
              internship={internships[application?.internship]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PendingApplications;

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../contexts";
import Navbar from "../components/Navbar";
import ApprovalSummary from "../components/ApprovalSummary";
import { API_URL } from "../constants";

function PendingApproval() {
  const navigate = useNavigate();
  const session = useContext(SessionContext);
  const [internships, setInternships] = useState<any[]>([]);
  const [users, setUsers] = useState<{ [key: string]: any }>({});

  // Ensure only moderators can access this page
  useEffect(() => {
    if (!session.roles.includes("moderator")) {
      navigate("/");
    }
  }, [session]);

  // Fetch the internships from the backend
  useEffect(() => {
    fetch(`${API_URL}/internships`, {
      credentials: "include",
      mode: "cors",
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setInternships(
            data.filter((internship: any) => internship.approved === false)
          );
        });
      }
    });
  }, []);

  // Fetch the users from the backend
  useEffect(() => {
    internships.forEach((internship) => {
      fetch(`${API_URL}/profile/${internship.creator}`, {
        credentials: "include",
        mode: "cors",
      }).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setUsers((prev) => ({ ...prev, [internship.creator]: data }));
          });
        }
      });
    });
  }, [internships]);

  return (
    <div>
      <Navbar />
      <div className="container px-6 mx-auto mt-10">
        <h1 className="text-3xl font-semibold text-center">
          Postings Pending Approval
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Showing {internships.length} posting
          {internships.length !== 1 && "s"}
        </p>
        {internships.length === 0 && (
          <p className="text-xl text-center text-gray-600 mt-5">
            No postings pending approval
          </p>
        )}
        <div className="mt-5 divide-y">
          {internships.map((internship) => (
            <ApprovalSummary
              key={internship._id}
              internship={internship}
              creator={users[internship.creator]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PendingApproval;

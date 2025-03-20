import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { SessionContext } from "../contexts";
import Navbar from "../components/Navbar";
import { API_URL } from "../constants";

function Register() {
  const navigate = useNavigate();
  const session = useContext(SessionContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");

  // Prevent logged in users from accessing this page
  useEffect(() => {
    if (session.username !== null) {
      navigate("/");
    }
  }, [session]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Ensure all fields are filled in
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      return toast.error("Please fill in all fields");
    }

    // Validate the password
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    } else if (password.length < 8) {
      return toast.error("Password must be at least 8 characters long");
    }

    fetch(`${API_URL}/account/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        username,
        email,
        password,
        roles: [role],
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          navigate("/login");
        } else if (res.status === 400) {
          toast.error("Username already exists");
        } else {
          toast.error("An error occurred");
        }
      })
      .catch(() => {
        toast.error("An error occurred");
      });
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto max-w-80 md:max-w-96">
        <h1 className="text-5xl font-bold text-center mt-20 lg:mt-16">
          Register
        </h1>
        <form className="mt-5">
          <div className="mt-5">
            <span className="font-semibold">Username</span>
            <input
              type="text"
              className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="mt-5">
            <span className="font-semibold">Email</span>
            <input
              type="email"
              className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="mt-3 mb-5">
            <span className="font-semibold">Password</span>
            <input
              type="password"
              className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="mt-3 mb-5">
            <span className="font-semibold">Confirm Password</span>
            <input
              type="password"
              className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
          <div className="mt-3 mb-8">
            <span className="font-semibold">Role</span>
            <select
              className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="employer">Employer</option>
            </select>
          </div>
          <input
            type="submit"
            className="block w-full bg-primary text-white rounded-lg p-3"
            value="Register"
            onClick={(e) => {
              handleSubmit(e);
            }}
          />
        </form>
        <p className="text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold">
            Log in
          </Link>
        </p>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default Register;

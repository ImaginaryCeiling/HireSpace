import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { SessionContext, SessionDispatchContext } from "../contexts";
import Navbar from "../components/Navbar";
import { API_URL } from "../constants";

function Login() {
  const navigate = useNavigate();
  const session = useContext(SessionContext);
  const sessionDispatch = useContext(SessionDispatchContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Prevent logged in users from accessing this page
  useEffect(() => {
    if (session.username !== null) {
      navigate("/portal");
    }
  }, [session]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (username === "" || password === "") {
      return toast.error("Please fill in all fields");
    }

    fetch(`${API_URL}/account/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            sessionDispatch!({
              type: "login",
              payload: {
                username: data.username,
                id: data._id,
                roles: data.roles,
              },
            });
          });
          navigate("/portal");
        } else if (res.status === 401) {
          toast.error("Invalid username or password");
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
        <h1 className="text-5xl font-bold text-center mt-20">Login</h1>
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
          <input
            type="submit"
            className="block w-full bg-primary text-white rounded-lg p-3"
            value="Log In"
            onClick={(e) => {
              handleSubmit(e);
            }}
          />
        </form>
        <p className="text-center mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-semibold">
            Register
          </Link>
        </p>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default Login;

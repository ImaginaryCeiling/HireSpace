import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SessionContext } from "../contexts";
import logo from "../assets/Hirespace Logo.svg";

interface NavbarProps {
  searchBox?: JSX.Element;
}

const logoStyle = {
  filter: "brightness(0) invert(1)",
};

function Navbar({ searchBox }: NavbarProps) {
  const session = useContext(SessionContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <nav className="border-gray-200 border-b bg-primary">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex grow items-center">
          <Link to="/" className="flex text-white">
            <img
              src={logo}
              className="h-9 me-2 -mt-1 fill-white"
              style={logoStyle}
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap me-16">
              HireSpace
            </span>
          </Link>
          <div className="hidden w-full lg:block">{searchBox}</div>
        </div>
        {/* Navbar expansion toggle for small screens */}
        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="p-2 w-10 h-10 justify-center text-white lg:hidden"
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        {/* Small screen navbar contents */}
        <div className={`${navbarOpen ? "" : "hidden"} w-full`}>
          <ul className="font-medium text-gray-200 flex flex-col ps-12">
            <li>
              <Link to="/" className="block py-2 px-3 rounded">
                Find Internships
              </Link>
            </li>
            {session.loggedIn ? (
              <>
                {session.roles.includes("moderator") && (
                  <li>
                    <Link
                      to="/internship/submit"
                      className="block py-2 px-3 rounded"
                    >
                      Submit Posting
                    </Link>
                  </li>
                )}
                {session.roles.includes("moderator") && (
                  <li>
                    <Link
                      to="/internships/pending"
                      className="block py-2 px-3 rounded"
                    >
                      Pending Approval
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/logout" className="block py-2 px-3 rounded">
                    Log Out
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="block py-2 px-3 rounded">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
        {/* Large screen navbar contents */}
        <div className="hidden lg:block lg:w-auto">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0">
            <li>
              <Link to="/" className="block py-2 px-3 rounded text-white">
                Find Postings
              </Link>
            </li>
            <li>
              {session.loggedIn ? (
                <>
                  <button
                    className="bg-gray-200 text-primary font-bold rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    Actions <span className="text-xs ms-2 mt-0.5">▼</span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute divide-y text-sm bg-white divide-gray-200 rounded-lg border border-gray-200 w-44 mt-2">
                      <div className="px-4 py-2.5 truncate text-gray-600 font-semibold">
                        @{session.username}
                      </div>
                      <ul className="text-sm text-gray-600">
                        <li>
                          {session.roles.includes("employer") && (
                            <Link
                              to="/internship/submit"
                              className="block px-4 py-2.5 hover:bg-slate-100"
                            >
                              Submit Posting
                            </Link>
                          )}
                          {session.roles.includes("moderator") && (
                            <Link
                              to="/internships/pending"
                              className="block px-4 py-2.5 hover:bg-slate-100"
                            >
                              Pending Approval
                            </Link>
                          )}
                        </li>
                      </ul>
                      <Link
                        to="/logout"
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-slate-100"
                      >
                        Log out
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login">
                  <button className="bg-gray-200 text-primary rounded-lg px-5 py-2">
                    Login
                  </button>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

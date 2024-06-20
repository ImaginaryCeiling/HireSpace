import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { SessionContext } from "../contexts";
import Navbar from "../components/Navbar";

const MAX_TAGS = 2;

function Submission() {
  const navigate = useNavigate();
  const session = useContext(SessionContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [tags, setTags] = useState<any[]>([]);
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");

  // Prevent logged out users from accessing this page
  useEffect(() => {
    if (session.username === null) {
      navigate("/login");
    }
  }, [session]);

  const handleSubmit = () => {
    fetch("http://localhost:3000/internship", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        companyName,
        tags: tags.map((tag) => tag.value),
        location,
        startDate,
        endDate,
        hoursPerWeek,
        hourlyRate,
        applicationUrl,
      }),
      credentials: "include",
      mode: "cors",
    }).then((res) => {
      if (res.status === 200) {
        alert("Internship submitted successfully!");
        navigate("/");
      }
    });
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setCompanyName("");
    setTags([]);
    setLocation("");
    setStartDate("");
    setEndDate("");
    setHoursPerWeek("");
    setHourlyRate("");
    setApplicationUrl("");
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto my-10 grid grid-cols-12">
        <div className="col-span-1">
          {/* Offset the submission page contents using an empty div */}
        </div>
        <div className="col-span-10">
          <h1 className="text-3xl font-semibold text-center">
            Submit an Internship
          </h1>
          <div className="mt-2">
            <span className="font-semibold">Title</span>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
              placeholder="Enter Title"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              value={title}
            />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Company</span>
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
                placeholder="Enter Company Name"
                onChange={(e) => {
                  setCompanyName(e.target.value);
                }}
                value={companyName}
              />
            </div>
            <div>
              <span className="font-semibold">Location</span>
              <input
                className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
                placeholder="City, State"
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
                value={location}
              />
            </div>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-4">
            <div>
              <span className="font-semibold">Start Date</span>
              <input
                type="date"
                className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                value={startDate}
              />
            </div>
            <div>
              <span className="font-semibold">End Date</span>
              <input
                type="date"
                className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                value={endDate}
              />
            </div>
            <div>
              <span className="font-semibold">Hourly Rate</span>
              <input
                type="number"
                placeholder="$12.50"
                className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
                onChange={(e) => {
                  setHourlyRate(e.target.value);
                }}
                value={hourlyRate}
              />
            </div>
            <div>
              <span className="font-semibold">Hours Per Week</span>
              <input
                type="number"
                placeholder="20"
                className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
                onChange={(e) => {
                  setHoursPerWeek(e.target.value);
                }}
                value={hoursPerWeek}
              />
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Application URL</span>
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-md mt-1 py-2 px-3 h-10"
                placeholder="Enter URL"
                onChange={(e) => {
                  setApplicationUrl(e.target.value);
                }}
                value={applicationUrl}
              />
            </div>
            <div>
              <span className="font-semibold">Tags</span>
              <Select
                isMulti
                options={[
                  {
                    value: "Software Engineering",
                    label: "Software Engineering",
                  },
                  {
                    value: "Data Science",
                    label: "Data Science",
                  },
                  {
                    value: "Product Management",
                    label: "Product Management",
                  },
                  {
                    value: "Marketing",
                    label: "Marketing",
                  },
                  {
                    value: "Finance",
                    label: "Finance",
                  },
                  {
                    value: "Human Resources",
                    label: "Human Resources",
                  },
                  {
                    value: "Operations",
                    label: "Operations",
                  },
                  {
                    value: "Sales",
                    label: "Sales",
                  },
                  {
                    value: "Customer Support",
                    label: "Customer Support",
                  },
                  {
                    value: "Design",
                    label: "Design",
                  },
                ]}
                className="block w-full rounded-md mt-1"
                classNames={{
                  control: () => {
                    return "h-10";
                  },
                }}
                onChange={(selected) => {
                  if (selected.length > MAX_TAGS) {
                    return alert("You can only select up to 2 tags.");
                  }
                  setTags([...selected]);
                }}
                value={tags}
              />
            </div>
          </div>
          <div className="mt-2">
            <span className="mt-5 font-semibold">Description</span>
            <textarea
              className="w-full border border-gray-300 rounded-md mt-1 py-2 px-3"
              rows={10}
              placeholder="Enter Description"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={description}
            />
          </div>
          <div className="my-4 mx-auto grid grid-cols-2 gap-4 content-center w-60">
            <button
              className="bg-black text-white rounded-lg py-3 font-semibold"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="border border-black rounded-lg py-3 font-semibold"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Submission;

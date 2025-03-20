import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API_URL } from "../constants";

function View() {
  const { id } = useParams<{ id: string }>();
  const [internship, setInternship] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);

  // Format all dates in the internship data
  const startDate = new Date(internship?.startDate);
  const endDate = new Date(internship?.endDate);
  const submittedDate = new Date(internship?.createdAt);
  const fmtOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const startDateString = startDate.toLocaleDateString(undefined, fmtOptions);
  const endDateString = endDate.toLocaleDateString(undefined, fmtOptions);
  const submittedDateString = submittedDate.toLocaleDateString(
    undefined,
    fmtOptions
  );

  useEffect(() => {
    fetch(`${API_URL}/internship/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch posting data");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        setInternship(data);
      });
  }, [id]);

  useEffect(() => {
    if (internship?.creator) {
      fetch(`${API_URL}/profile/${internship.creator}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch posting creator");
          } else {
            return res.json();
          }
        })
        .then((data) => {
          setCreator(data);
        });
    }
  }, [internship?.creator]);

  return (
    <div>
      <Navbar />
      <div className="container my-10 px-10 mx-auto">
        <h1 className="text-3xl text-center font-semibold">
          {internship?.title}
        </h1>
        <p className="text-center text-lg my-1">
          Posted by <u className="font-semibold">{creator?.username}</u> on{" "}
          <u className="font-semibold">{submittedDateString}</u>
        </p>
        <p className="text-center text-lg text-gray-600 my-1">
          {internship?.companyName}
        </p>
        <p className="text-center text-lg text-gray-600 my-1">
          {internship?.location} • {startDateString} - {endDateString}
        </p>
        <p className="text-center text-lg text-gray-600 my-1">
          ${internship?.hourlyRate} / hour • {internship?.hoursPerWeek} hours /
          week
        </p>
        <h3 className="text-2xl font-semibold text-center mt-10">
          Posting Description
        </h3>
        <p className="text-lg mt-2 text-justify">
          {/* Safely render newlines in the description */}
          {internship?.description
            .split("\n")
            .map((line: string, i: number) => (
              <Fragment key={i}>
                {line}
                <br />
              </Fragment>
            ))}
        </p>
        <a
          href={`/internship/apply/${id}`}
          rel="noopener noreferrer"
          className="flex justify-center"
        >
          <button className="bg-primary text-white rounded-lg py-3 font-semibold mt-5 w-48">
            Apply
          </button>
        </a>
      </div>
    </div>
  );
}

export default View;

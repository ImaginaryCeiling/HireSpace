import { Fragment, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import InternshipSummary from "../components/InternshipSummary";
import SearchBox from "../components/SearchBox";

function Root() {
  const [internships, setInternships] = useState<any[]>([]);
  const [visibleInternships, setVisibleInternships] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedInternship, setSelectedInternship] = useState<any | null>(
    null
  );

  // Format the date string for when the selected internship was posted
  const fmtOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const datePosted = new Date(selectedInternship?.createdAt);
  const datePostedString = datePosted.toLocaleDateString(undefined, fmtOptions);

  useEffect(() => {
    fetch("http://localhost:3000/internships", {
      credentials: "include",
      mode: "cors",
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setInternships(
            data.filter((internship: any) => internship.approved === true)
          );
        });
      }
    });
  }, []);

  useEffect(() => {
    let filteredInternships = internships.filter((internship) => {
      return (
        internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        internship.companyName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        internship.tags
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        internship.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    if (filterQuery) {
      filteredInternships = filteredInternships.filter((internship) => {
        return internship.tags
          .join(" ")
          .toLowerCase()
          .includes(filterQuery.toLowerCase());
      });
    }
    setVisibleInternships(filteredInternships);
    setSelectedInternship(filteredInternships[0] || null);
  }, [internships, searchQuery, filterQuery]);

  return (
    <div className="flex flex-col max-h-screen">
      <Navbar
        searchBox={
          <SearchBox
            setSearchQuery={setSearchQuery}
            setFilterQuery={setFilterQuery}
          />
        }
      />
      <div className="grid grid-cols-12 flex-1 overflow-auto">
        <div className="col-span-3 border ps-14 pe-10 overflow-y-auto">
          {visibleInternships.map((internship) => (
            <InternshipSummary
              key={internship._id}
              internship={internship}
              setSelectedInternship={setSelectedInternship}
            />
          ))}
        </div>
        <div className="col-span-9 border px-16 py-10 overflow-auto">
          <h1 className="text-4xl font-semibold">
            {selectedInternship?.title}
          </h1>
          <h3 className="text-lg font-bold underline mt-3">
            {selectedInternship?.companyName}
          </h3>
          <p className="text-lg mt-3 text-gray-600">
            {selectedInternship?.location} • Posted on {datePostedString}
          </p>
          <p className="text-lg mt-3 text-gray-600">
            ${selectedInternship?.hourlyRate} / hour •{" "}
            {selectedInternship?.hoursPerWeek} hours / week
          </p>
          <a href={selectedInternship?.applicationUrl} target="_blank">
            <button className="bg-black text-white rounded-lg px-9 py-4 mt-4 font-semibold">
              Apply
            </button>
          </a>
          <h1 className="text-3xl font-semibold mt-10">
            Internship Description
          </h1>
          <p className="mt-3 text-lg">
            {/* Safely render newlines in the description */}
            {selectedInternship?.description
              .split("\n")
              .map((line: string, i: number) => (
                <Fragment key={i}>
                  {line}
                  <br />
                </Fragment>
              ))}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Root;

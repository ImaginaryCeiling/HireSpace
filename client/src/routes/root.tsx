import { Fragment, useContext, useState, useEffect } from "react";
import Fuse from "fuse.js";
import { SessionContext } from "../contexts";
import Navbar from "../components/Navbar";
import InternshipSummary from "../components/InternshipSummary";
import SearchBox from "../components/SearchBox";
import { API_URL } from "../constants";

function Root() {
  const session = useContext(SessionContext);
  const [internships, setInternships] = useState<any[]>([]);
  const [visibleInternships, setVisibleInternships] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagQuery, setTagQuery] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hourlyRate, setHourlyRate] = useState([0, 50]);
  const [hoursPerWeek, setHoursPerWeek] = useState([0, 40]);
  const [selectedInternship, setSelectedInternship] = useState<any | null>(
    null
  );
  const [bookmarkedInternships, setBookmarkedInternships] = useState<string[]>(
    []
  );

  // Format the date string for when the selected internship was posted
  const fmtOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const datePosted = new Date(selectedInternship?.createdAt);
  const datePostedString = datePosted.toLocaleDateString(undefined, fmtOptions);

  // Fetch all internships from the backend
  useEffect(() => {
    fetch(`${API_URL}/internships`, {
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

  // Regenerate the search results when the search query or filters change
  useEffect(() => {
    let filteredInternships = internships;

    // Use Fuse.js to complete a fuzzy search
    if (searchQuery.length > 0) {
      const fuse = new Fuse(internships, {
        isCaseSensitive: false,
        findAllMatches: true,
        includeScore: true,
        keys: ["title", "description", "companyName", "tags", "location"],
        threshold: 0.4, // Lower the threshold to increase the strictness of the search
      });
      const results = fuse.search(searchQuery);
      filteredInternships = results.map((result) => result.item);
    }

    // Further filter the results by tags
    if (tagQuery) {
      let parsedTagQuery = tagQuery.map((tag) => tag.value);
      filteredInternships = filteredInternships.filter((internship) => {
        return parsedTagQuery.every((value: string) =>
          internship.tags.includes(value)
        );
      });
    }

    // Further filter the results by start and end date
    if (startDate) {
      filteredInternships = filteredInternships.filter((internship) => {
        return new Date(internship.startDate) >= new Date(startDate);
      });
    }
    if (endDate) {
      filteredInternships = filteredInternships.filter((internship) => {
        return new Date(internship.endDate) <= new Date(endDate);
      });
    }

    // Further filter the results by hourly rate and hours per week
    filteredInternships = filteredInternships.filter((internship) => {
      return (
        internship.hourlyRate >= hourlyRate[0] &&
        internship.hourlyRate <= hourlyRate[1] &&
        internship.hoursPerWeek >= hoursPerWeek[0] &&
        internship.hoursPerWeek <= hoursPerWeek[1]
      );
    });

    setVisibleInternships(filteredInternships);
    setSelectedInternship(filteredInternships[0] || null);
  }, [
    internships,
    searchQuery,
    tagQuery,
    startDate,
    endDate,
    hourlyRate,
    hoursPerWeek,
  ]);

  // Fetch the bookmarked internships when the session changes
  useEffect(() => {
    if (session.loggedIn) {
      fetch(`${API_URL}/profile/bookmarks`, {
        credentials: "include",
        mode: "cors",
      }).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setBookmarkedInternships(data.bookmarkedInternships);
          });
        }
      });
    }
  }, [session]);

  // Handle updating the user's bookmarked internships with the backend. This is called from the InternshipSummary component
  const handleBookmarkUpdate = (
    internshipId: string,
    isBookmarked: boolean
  ) => {
    if (session.loggedIn) {
      fetch(`${API_URL}/profile/bookmarks`, {
        method: isBookmarked ? "DELETE" : "POST",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ internshipId }),
      }).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setBookmarkedInternships(data.bookmarkedInternships);
          });
        }
      });
    }
  };

  return (
    <div className="flex flex-col max-h-screen">
      <Navbar
        searchBox={
          <SearchBox
            tagQuery={tagQuery}
            startDate={startDate}
            endDate={endDate}
            hourlyRate={hourlyRate}
            hoursPerWeek={hoursPerWeek}
            setSearchQuery={setSearchQuery}
            setTagQuery={setTagQuery}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setHourlyRate={setHourlyRate}
            setHoursPerWeek={setHoursPerWeek}
          />
        }
      />
      <div className="grid grid-cols-12 flex-1 overflow-auto">
        {/* Small screen page contents */}
        <div className="lg:hidden w-lvw pt-5">
          <SearchBox
            tagQuery={tagQuery}
            startDate={startDate}
            endDate={endDate}
            hourlyRate={hourlyRate}
            hoursPerWeek={hoursPerWeek}
            setSearchQuery={setSearchQuery}
            setTagQuery={setTagQuery}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setHourlyRate={setHourlyRate}
            setHoursPerWeek={setHoursPerWeek}
          />
          <p className="text-gray-600 mt-4 mb-1 text-center">
            Found {visibleInternships.length} relevant posting
            {visibleInternships.length !== 1 && "s"}
          </p>
          <div className="divide-y">
            {visibleInternships.map((internship) => (
              <InternshipSummary
                key={internship._id}
                internship={internship}
                selectedInternship={selectedInternship}
                setSelectedInternship={setSelectedInternship}
                tagQuery={tagQuery}
                setTagQuery={setTagQuery}
                isBookmarked={bookmarkedInternships?.includes(internship._id)}
                handleBookmarkUpdate={handleBookmarkUpdate}
              />
            ))}
          </div>
        </div>
        {/* Large screen sidebar */}
        <div className="hidden col-span-3 border overflow-y-auto lg:block">
          <p className="text-gray-600 my-5 ps-8 text-sm xl:text-base">
            Found {visibleInternships.length} relevant posting
            {visibleInternships.length !== 1 && "s"}
          </p>
          {visibleInternships.map((internship) => (
            <InternshipSummary
              key={internship._id}
              internship={internship}
              selectedInternship={selectedInternship}
              setSelectedInternship={setSelectedInternship}
              tagQuery={tagQuery}
              setTagQuery={setTagQuery}
              isBookmarked={bookmarkedInternships?.includes(internship._id)}
              handleBookmarkUpdate={handleBookmarkUpdate}
            />
          ))}
        </div>
        {/* Large screen detailed internship contents */}
        <div className="hidden col-span-9 border px-16 py-10 overflow-auto lg:block">
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
          <a href={`/internship/apply/${selectedInternship?._id}`}>
            <button className="bg-primary text-white rounded-lg px-9 py-4 mt-4 font-semibold">
              Apply
            </button>
          </a>
          <h1 className="text-3xl font-semibold mt-10">
            Posting Description
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

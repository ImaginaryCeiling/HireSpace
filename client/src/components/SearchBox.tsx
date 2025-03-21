import { useState } from "react";
import Select from "react-select";
import { InputNumber, Slider } from "antd";
import { MAX_TAGS, TAGS } from "../constants";

interface SearchBoxProps {
  tagQuery: any[];
  startDate: string;
  endDate: string;
  hourlyRate: number[];
  hoursPerWeek: number[];
  setSearchQuery: (searchQuery: string) => void;
  setTagQuery: (tagQuery: any[]) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  setHourlyRate: (hourlyRate: number[]) => void;
  setHoursPerWeek: (hoursPerWeek: number[]) => void;
}

function SearchBox({
  tagQuery,
  startDate,
  endDate,
  hourlyRate,
  hoursPerWeek,
  setSearchQuery,
  setTagQuery,
  setStartDate,
  setEndDate,
  setHourlyRate,
  setHoursPerWeek,
}: SearchBoxProps) {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Handle resetting the filters
  const handleResetFilters = () => {
    setTagQuery([]);
    setStartDate("");
    setEndDate("");
    setHourlyRate([0, 50]);
    setHoursPerWeek([0, 40]);
  };

  return (
    <>
      {/* Search Box w/ Advanced Search Toggle Button*/}
      <div className="flex flex-row rounded-lg px-5 w-full lg:mx-0">
        <input
          type="text"
          className="block w-full rounded-lg border-0 py-2 pl-3 pr-20 text-primary placeholder-primary placeholder-bold ring-1 ring-inset ring-gray-300"
          placeholder="Search Postings"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="text-primary bg-white px-1.5 rounded-lg ml-2.5 border border-gray-300 flex items-center justify-center"
          onClick={() => setShowAdvancedSearch(true)}
        >
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 5L10 5M10 5C10 6.10457 10.8954 7 12 7C13.1046 7 14 6.10457 14 5M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5M14 5L20 5M4 12H16M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM8 19H20M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      {/* Advanced Search Modal */}
      <div
        className={`${
          showAdvancedSearch ? "" : "hidden"
        } flex fixed inset-0 z-50 justify-center w-full bg-opacity-30 bg-black`}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-semibold text-primary">
                Advanced Search
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:text-red-500 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                onClick={() => setShowAdvancedSearch(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <span className="font-semibold">Tags</span>
                <Select
                  isMulti
                  options={TAGS.map((tag) => ({
                    value: tag,
                    label: tag,
                  }))}
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
                    setTagQuery([...selected]);
                  }}
                  value={tagQuery}
                />
              </div>
              <div className="grid grid-cols-2 gap-x-4">
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
              </div>
              <div>
                <span className="font-semibold">Hourly Rate</span>
                <div className="flex flex-row space-x-4 mt-1">
                  <InputNumber
                    min={0}
                    max={hourlyRate[1]}
                    value={hourlyRate[0]}
                    onChange={(value: any) =>
                      setHourlyRate([value as number, hourlyRate[1]])
                    }
                    className="w-12 inputNumberCentered"
                  />
                  <Slider
                    range
                    min={0}
                    max={50}
                    onChange={(value: number[]) => setHourlyRate(value)}
                    value={hourlyRate}
                    className="grow"
                  />
                  <InputNumber
                    min={hourlyRate[0]}
                    max={50}
                    value={hourlyRate[1]}
                    onChange={(value: any) =>
                      setHourlyRate([hourlyRate[0], value as number])
                    }
                    className="w-12 inputNumberCentered"
                  />
                </div>
              </div>
              <div>
                <span className="font-semibold">Hours Per Week</span>
                <div className="flex flex-row space-x-4 mt-1">
                  <InputNumber
                    min={0}
                    max={hoursPerWeek[1] - 1}
                    value={hoursPerWeek[0]}
                    onChange={(value: any) =>
                      setHoursPerWeek([value as number, hoursPerWeek[1]])
                    }
                    className="w-12 inputNumberCentered"
                  />
                  <Slider
                    range
                    min={0}
                    max={40}
                    onChange={(value: number[]) => setHoursPerWeek(value)}
                    value={hoursPerWeek}
                    className="grow"
                  />
                  <InputNumber
                    min={hoursPerWeek[0] + 1}
                    max={40}
                    value={hoursPerWeek[1]}
                    onChange={(value: any) =>
                      setHoursPerWeek([hoursPerWeek[0], value as number])
                    }
                    className="w-12 inputNumberCentered"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center p-4 border-t border-gray-200">
              <button
                className="text-red-500 bg-white border border-red-500 rounded-md px-4 py-2 text-sm font-semibold hover:bg-red-500 hover:text-white"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchBox;

import { Link } from "react-router-dom";

interface ApplicationSummaryProps {
  application: any;
  user: any;
  internship: any;
}

function ApplicationSummary({ application, user, internship }: ApplicationSummaryProps) {
  // Format the date the application was submitted
  const submittedDate = new Date(application?.createdAt);
  const fmtOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const submittedDateString = submittedDate.toLocaleDateString(
    undefined,
    fmtOptions
  );

  return (
    <div>
      {/* ^^^ Adding a div is necessary for the `divide-y` class on the parent in pendingApplications.tsx to work */}
      <Link to={`/application/review/${application?._id}`}>
        <div className="pt-4 pb-8 px-6 hover:bg-slate-100">
          <h1 className="text-2xl font-semibold">{internship?.title}</h1>
          <p className="font-semibold mt-0.5">
            Submitted by <u>{user?.username}</u> on{" "}
            <u>{submittedDateString}</u>
          </p>
          <p className="line-clamp-3 text-gray-600 mt-0.5">
            {application?.fitAnswer}
          </p>
          <div className="mt-4">
            <span className="bg-primary text-white rounded-lg px-3 py-2 text-sm me-1 whitespace-nowrap">
              Resume: <a href={application?.resumeUrl} target="_blank" rel="noopener noreferrer">View</a>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ApplicationSummary;

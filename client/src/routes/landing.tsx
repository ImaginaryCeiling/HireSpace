import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pcLogo from "../assets/pclogo.png";

// Custom hook for typing animation
const useTypingEffect = (text: string, typingSpeed = 150, startDelay = 500) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (currentIndex === 0) {
      const timeout = setTimeout(() => {
        setCurrentIndex(1);
        setDisplayText(text.substring(0, 1));
      }, startDelay);

      return () => clearTimeout(timeout);
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.substring(0, currentIndex + 1));
        setCurrentIndex((prev) => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex, text, typingSpeed, startDelay]);

  return { displayText, isTypingComplete };
};

const CatamountCareers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const headingText = "What job are you looking for?";
  const { displayText } = useTypingEffect(headingText, 100);
  const navigate = useNavigate(); // FIX: useNavigate inside the component

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="border-b p-4">
  <div className="container mx-auto flex justify-between items-center px-4">
    <div className="flex items-center gap-2">
      <img src={pcLogo} alt="Panther Creek Logo" className="h-10" />
      <h1 className="text-2xl md:text-3xl font-bold text-blue-600">Catamount Careers</h1>
    </div>
    <div className="flex gap-4">
      <button
        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        onClick={() => navigate('/portal')}
      >
        For Employers
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onClick={() => navigate('/portal')}
      >
        For Students
      </button>
    </div>
  </div>
</header>

      {/* Main Content */}
      <main className="flex-grow bg-blue-50 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-5xl font-bold text-blue-900 mb-8 text-center min-h-[3.5rem] md:min-h-[4rem]">
            {displayText}
            <span className="animate-blink">|</span>
          </h2>

          <form onSubmit={handleSearch} className="w-full max-w-2xl mb-6">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full py-3 pl-12 pr-24 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 h-full px-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <p className="text-blue-600 text-lg text-center">
            Panther Creek High School's student-friendly job and internship platform
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t p-4 text-center">
        <p className="text-blue-600">© 2025 Catamount Careers</p>
      </footer>
    </div>
  );
};

// Global Styles for Blinking Cursor
const GlobalStyles = () => {
  return (
    <style>{`
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      
      .animate-blink {
        animation: blink 1s step-end infinite;
      }
    `}</style>
  );
};

const CatamountCareersWithStyles: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <CatamountCareers />
    </>
  );
};

export default CatamountCareersWithStyles;

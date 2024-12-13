import { useState, useEffect } from "react";
import "../styles/global.css";
import SkeletonLoader from "./SkeletonLoader";
import WordList from "./WordList";

function WordOfTheDay() {
  const [wordData, setWordData] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading
  const [error, setError] = useState(""); // Add this state to hold the error message
  const [pendingRequests, setPendingRequests] = useState(0);
  const [wordHistory, setWordHistory] = useState([]); // State for storing previous words
  const [currentIndex, setCurrentIndex] = useState(-1); // Keeps track of the current word index in the history

  const fetchWord = async (word = "") => {
    setPendingRequests((prev) => prev + 1); // Increment the pending requests counter
    setError(""); // Reset error state before each fetch

    try {
      if (!word) {
        const wordResponse = await fetch(
          "https://random-word-api.herokuapp.com/word"
        );
        const wordArray = await wordResponse.json();
        word = wordArray[0]; // Get the first word from the API response
      }

      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          return fetchWord(); // Automatically fetch a new random word if the word is not found
        } else {
          setError("An error occurred while fetching the word data.");
          setWordData(null); // Handle API errors gracefully
          return;
        }
      }

      const data = await response.json();
      setWordData(data[0]);
      setShowMoreInfo(false); // Reset dropdown state for the new word

      // Update history and current index
      setWordHistory((prevHistory) => [...prevHistory, data[0]]);
      setCurrentIndex(wordHistory.length); // Set current index to the new word's position
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while fetching the word data.");
    } finally {
      setPendingRequests((prev) => prev - 1); // Decrement the pending requests counter
    }
  };

  // Fetch a random word on component mount
  useEffect(() => {
    fetchWord();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    if (searchWord.trim()) {
      fetchWord(searchWord.trim());
      setSearchWord(""); // Clear the input field after submitting
    }
  };

  const handlePreviousWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setWordData(wordHistory[currentIndex - 1]);
    }
  };

  const handleNextWord = () => {
    if (currentIndex < wordHistory.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setWordData(wordHistory[currentIndex + 1]);
    }
  };

  return (
    <div className="flex flex-col max-w-3xl width-full align-items gap-4 container mx-auto">
      {pendingRequests > 0 ? (
        <SkeletonLoader />
      ) : wordData ? (
        <>
          <div className="bg-gray-100 p-4 rounded shadow-md">
            <h2 className="text-3xl text-slate-800 font-semibold">
              {wordData.word}
            </h2>
            <p className="text-gray-700 mt-2">
              {wordData.meanings[0]?.definitions[0]?.definition ||
                "Definition not available"}
            </p>
            <div className="mt-4">
              <button
                className="text-blue-500 hover:underline focus:outline-none"
                onClick={() => setShowMoreInfo(!showMoreInfo)}
              >
                {showMoreInfo ? "Hide More Info" : "Show More Info"}
              </button>
              <div className="flex justify-between mt-4"></div>

              {showMoreInfo && (
                <div className="mt-2 p-2 border-t border-gray-300 space-y-2">
                  {wordData.origin && (
                    <p className="text-gray-600">
                      <strong>Origin:</strong> {wordData.origin}
                    </p>
                  )}
                  {wordData.phonetic && (
                    <p className="text-gray-600">
                      <strong>Phonetic:</strong> {wordData.phonetic}
                    </p>
                  )}
                  {wordData.meanings[0]?.partOfSpeech && (
                    <p className="text-gray-600">
                      <strong>Part of Speech:</strong>{" "}
                      {wordData.meanings[0].partOfSpeech}
                    </p>
                  )}
                  {wordData.meanings[0]?.synonyms?.length > 0 && (
                    <p className="text-gray-600">
                      <strong>Synonyms:</strong>{" "}
                      {wordData.meanings[0].synonyms.join(", ")}
                    </p>
                  )}
                </div>
              )}
              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePreviousWord}
                  disabled={currentIndex <= 0}
                  className="text-slate-500 hover:text-blue-400 px-3 rounded disabled:opacity-30 disabled:cursor-not-allowed text-md border-2 border-slate-500 active:border-blue-400 hover:border-blue-400"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextWord}
                  disabled={currentIndex >= wordHistory.length - 1}
                  className="text-slate-500 hover:text-blue-400 px-2 py-1 w-[90px] rounded disabled:opacity-30 disabled:cursor-not-allowed text-md border-2 border-slate-500 active:border-blue-400 hover:border-blue-400"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      ) : error ? (
        <p className="text-red-500 bg-gray-100 p-4 rounded shadow-md">
          {error}
        </p>
      ) : (
        <p className="text-slate-400 bg-gray-100 p-4 rounded shadow-md">
          Fetching word of the day...
        </p>
      )}
      <form onSubmit={handleSearch} className="">
        <input
          type="text"
          className="w-full p-2 border rounded mb-4 shadow-md"
          placeholder="Search for a word"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
        />
        <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-3 rounded hover:bg-blue-600 transition shadow-md"
          >
            Search
          </button>
          <button
            onClick={() => fetchWord()}
            disabled={pendingRequests > 0} // Disable button while any requests are pending
            className={`w-full p-3 button text-white rounded transition shadow-md ${
              pendingRequests > 0 ? "cursor-not-allowed" : ""
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {pendingRequests > 0 && (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Loading spinner"
                  role="img"
                >
                  <style>
                    {`.spinner_7uc5 {
          animation: spinner_3l8F .9s linear infinite;
          animation-delay: -.9s;
          fill: white; /* Sets the bars to white */
        }
        .spinner_RibN {
          animation-delay: -.7s;
        }
        .spinner_ZAxd {
          animation-delay: -.5s;
        }
        @keyframes spinner_3l8F {
          0%, 66.66% {
            animation-timing-function: cubic-bezier(0.14, .73, .34, 1);
            y: 6px;
            height: 12px;
          }
          33.33% {
            animation-timing-function: cubic-bezier(0.65, .26, .82, .45);
            y: 1px;
            height: 22px;
          }
        }`}
                  </style>
                  <rect
                    className="spinner_7uc5 spinner_ZAxd"
                    x="1"
                    y="6"
                    width="2.8"
                    height="12"
                  />
                  <rect
                    className="spinner_7uc5 spinner_RibN"
                    x="5.8"
                    y="6"
                    width="2.8"
                    height="12"
                  />
                  <rect
                    className="spinner_7uc5"
                    x="10.6"
                    y="6"
                    width="2.8"
                    height="12"
                  />
                  <rect
                    className="spinner_7uc5 spinner_RibN"
                    x="15.4"
                    y="6"
                    width="2.8"
                    height="12"
                  />
                  <rect
                    className="spinner_7uc5 spinner_ZAxd"
                    x="20.2"
                    y="6"
                    width="2.8"
                    height="12"
                  />
                </svg>
              )}
              <span>
                {pendingRequests > 0 ? "Fetching..." : "✨  Fetch Random Word"}
              </span>
            </div>
          </button>
        </div>
      </form>
      {wordData && <WordList wordData={wordData} />}
    </div>
  );
}

export default WordOfTheDay;

import { useState, useEffect } from 'react';
import "../styles/global.css";

function WordOfTheDay() {
  const [wordData, setWordData] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading
  const [error, setError] = useState(""); // Add this state to hold the error message
  const [pendingRequests, setPendingRequests] = useState(0);


  const fetchWord = async (word = "") => {
    setPendingRequests((prev) => prev + 1); // Increment the pending requests counter
    setError(""); // Reset error state before each fetch
  
    try {
      // If no word is provided, fetch a random word from the random-word API
      if (!word) {
        const wordResponse = await fetch('https://random-word-api.herokuapp.com/word');
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
    } catch (error) {
      console.error('Error:', error);
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
    }
  };

  return (
    <div className="flex flex-col mt-2 max-w-3xl width-full align-items gap-4 container p-4 mx-auto">
<div className="flex flex-row justify-between items-center bg-gray-100 p-4 rounded shadow-md">
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="125.211" height="17.49" viewBox="0 0 125.211 17.49">
  <defs>
    <clipPath id="clip-path">
      <rect id="Rectangle_5" data-name="Rectangle 5" width="125.211" height="17.49" fill="#fff"/>
    </clipPath>
  </defs>
  <g id="Group_19498" data-name="Group 19498" transform="translate(0 0)">
    <rect id="Rectangle_3" data-name="Rectangle 3" width="16.747" height="16.726" transform="translate(20.844 0.382)" fill="#ff5858"/>
    <g id="Group_13" data-name="Group 13" transform="translate(0 0)">
      <g id="Group_12" data-name="Group 12" clip-path="url(#clip-path)">
        <path id="Path_1" data-name="Path 1" d="M403.692,0a8.745,8.745,0,1,0,8.745,8.745A8.733,8.733,0,0,0,403.692,0m0,3.587a5.158,5.158,0,1,1-5.157,5.158,5.163,5.163,0,0,1,5.157-5.158" transform="translate(-287.226 0)" fill="#2f2f2f" fill-rule="evenodd"/>
        <path id="Path_2" data-name="Path 2" d="M157.667,1.246V17.993h6.623c5.242,0,8.872-3.312,8.872-8.364s-3.63-8.384-8.872-8.384Zm6.623,3.142a4.889,4.889,0,0,1,5.242,5.242,5.006,5.006,0,0,1-5.242,5.222h-3.057V4.388Z" transform="translate(-114.664 -0.906)" fill="#2f2f2f" fill-rule="evenodd"/>
        <rect id="Rectangle_4" data-name="Rectangle 4" width="3.566" height="16.747" transform="translate(63.274 0.34)" fill="#2f2f2f"/>
        <path id="Path_3" data-name="Path 3" d="M268.048.311c-3.948,0-6.347,2.313-6.347,5.094,0,3.821,3.5,4.585,6.24,5.2,1.847.446,3.4.807,3.4,2.038,0,.955-.955,1.868-2.908,1.868A7.329,7.329,0,0,1,263.1,12.24l-1.931,2.717a9.558,9.558,0,0,0,7.069,2.653c4.521,0,6.707-2.313,6.707-5.37,0-3.8-3.5-4.627-6.283-5.264-1.8-.446-3.332-.786-3.332-1.868,0-1,.849-1.677,2.4-1.677a7.2,7.2,0,0,1,4.861,1.826l2-2.611A9.4,9.4,0,0,0,268.048.311" transform="translate(-189.937 -0.226)" fill="#2f2f2f" fill-rule="evenodd"/>
        <path id="Path_4" data-name="Path 4" d="M333.808,0a8.745,8.745,0,1,0,7.408,13.394L337.947,11.8a5.151,5.151,0,1,1-.021-6.156l3.269-1.57A8.684,8.684,0,0,0,333.808,0" transform="translate(-236.403 0)" fill="#2f2f2f" fill-rule="evenodd"/>
        <path id="Path_5" data-name="Path 5" d="M8.6.545a8.6,8.6,0,1,0,8.617,8.6A8.587,8.587,0,0,0,8.6.545" transform="translate(0 -0.396)" fill="#00afa9" fill-rule="evenodd"/>
      </g>
    </g>
  </g>
</svg><h1 className="text-[13px] leading-none mt-0 font-bold flex flex-col gap-2 text-slate-800 items-center text-right text-balance"> Marketing Word of the Day</h1></div>


      {wordData ? (
        <div className="bg-gray-100 p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold">{wordData.word}</h2>
          <p className="text-gray-700 mt-2">{wordData.meanings[0]?.definitions[0]?.definition || "Definition not available"}</p>
          <div className="mt-4">
            <button
              className="text-blue-500 hover:underline focus:outline-none"
              onClick={() => setShowMoreInfo(!showMoreInfo)}
            >
              {showMoreInfo ? 'Hide More Info' : 'Show More Info'}
            </button>
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
                    <strong>Part of Speech:</strong> {wordData.meanings[0].partOfSpeech}
                  </p>
                )}
                {wordData.meanings[0]?.synonyms?.length > 0 && (
                  <p className="text-gray-600">
                    <strong>Synonyms:</strong> {wordData.meanings[0].synonyms.join(', ')}
                  </p>
                  
                )}
               

              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-slate-400 bg-gray-100 p-4 rounded shadow-md">Fetching word of the day...</p>
      )} {error && <p className="text-red-500 bg-gray-100 p-4 rounded shadow-md">{error}</p>}
          <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          placeholder="Search for a word"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            Search
          </button>
          <button
  onClick={() => fetchWord()}
  disabled={pendingRequests > 0} // Disable button while any requests are pending
  className={`p-3 bg-blue-500 text-white rounded ${
    pendingRequests > 0 ? 'cursor-not-allowed' : ''
  }`}
>
<div className="flex items-center space-x-2">
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
      <rect className="spinner_7uc5 spinner_ZAxd" x="1" y="6" width="2.8" height="12" />
      <rect className="spinner_7uc5 spinner_RibN" x="5.8" y="6" width="2.8" height="12" />
      <rect className="spinner_7uc5" x="10.6" y="6" width="2.8" height="12" />
      <rect className="spinner_7uc5 spinner_RibN" x="15.4" y="6" width="2.8" height="12" />
      <rect className="spinner_7uc5 spinner_ZAxd" x="20.2" y="6" width="2.8" height="12" />
    </svg>
  )}
  <span>{pendingRequests > 0 ? "Fetching..." : "Fetch Random Word"}</span>
</div>


</button>


        </div>
      </form>
    </div>
  );
}

export default WordOfTheDay;

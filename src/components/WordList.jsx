import { useState, useEffect } from "react";
import "../styles/global.css";

function WordList({ wordData }) {
  const [savedWords, setSavedWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingWords, setDeletingWords] = useState(new Set());
  const [uploadingPhoto, setUploadingPhoto] = useState(new Set());
  const [highlightedWord, setHighlightedWord] = useState(null);

  // Fetch saved words when component mounts
  useEffect(() => {
    fetchSavedWords();
  }, []);

  const fetchSavedWords = async () => {
    try {
      // Log the initial message, but remove the uninitialized 'data' reference
      console.log("Fetching words from DynamoDB...");

      const response = await fetch("/api/word");

      if (!response.ok) throw new Error("Failed to fetch saved words");

      const data = await response.json();
      console.log("Fetched words:", data); // Log the fetched data
      setSavedWords(data); // Assuming 'setSavedWords' is a state setter for your saved words
    } catch (err) {
      setError("Failed to load saved words");
      console.error(err); // Log the actual error for debugging
    }
  };

  const saveWord = async () => {
    if (!wordData) return;

    setLoading(true);
    setError(null);

    try {
      const wordEntry = {
        dt: new Date().toISOString().split("T")[0],
        wd: wordData.word,
        definition:
          wordData.meanings[0]?.definitions[0]?.definition ||
          "No definition available",
        partOfSpeech: wordData.meanings[0]?.partOfSpeech || "unknown",
        photoUrl: "", // Ensure photoUrl is included
      };

      // Check if the word already exists
      const wordExists = savedWords.some((word) => word.wd === wordEntry.wd);
      if (wordExists) {
        setError("This word has already been added.");
        setLoading(false);

        setTimeout(() => {
          setError(null);
        }, 2000);

        return; // Exit if the word already exists
      }

      const response = await fetch("/api/word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wordEntry),
      });

      if (!response.ok) throw new Error("Failed to save word");

      // Update the savedWords state directly
      setSavedWords((prevWords) => [wordEntry, ...prevWords]);
      setHighlightedWord(wordEntry.wd); // Set the highlighted word

      // Clear the highlight after 2 seconds
      setTimeout(() => {
        setHighlightedWord(null); // Clear the highlighted word
      }, 2000);
    } catch (err) {
      setError("Failed to save word");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteWord = async (dt) => {
    setDeletingWords((prev) => new Set([...prev, dt])); // Add the current word to the deleting set
    try {
      const response = await fetch(`/api/word?dt=${dt}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete word");

      // Refresh the word list
      await fetchSavedWords();
    } catch (err) {
      setError("Failed to delete word");
      console.error(err);
    } finally {
      // Remove the word from the deleting state
      setDeletingWords((prev) => {
        const newSet = new Set(prev);
        newSet.delete(dt);
        return newSet;
      });
    }
  };

  const handlePhotoUpload = async (dt, file, e) => {
    e.stopPropagation(); // Stop event propagation
    if (!file) return;

    setUploadingPhoto((prev) => new Set([...prev, dt]));
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("dt", dt);

      const response = await fetch("/api/upload-photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload photo");

      const { photoUrl } = await response.json();

      // Update the word entry with the photo URL
      const updateResponse = await fetch(`/api/word`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dt, photoUrl }),
      });

      if (!updateResponse.ok)
        throw new Error("Failed to update word with photo");

      // Update the word in the current list instead of fetching all words
      setSavedWords((prevWords) =>
        prevWords.map((word) => (word.dt === dt ? { ...word, photoUrl } : word))
      );
    } catch (err) {
      setError("Failed to upload photo");
      console.error(err);
    } finally {
      setUploadingPhoto((prev) => {
        const newSet = new Set(prev);
        newSet.delete(dt);
        return newSet;
      });
    }
  };

  // Format date to American English format
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={saveWord}
          disabled={loading || !wordData}
          className={`p-3 rounded transtion-all duration-200	${
            loading || !wordData
              ? "w-full bg-purple-500 text-white cursor-not-allowed"
              : "w-full bg-purple-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Saving..." : "Save Current Word to Whiteboard"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4">Virtual Whiteboard</h2>
      <div className="">
        {savedWords.map((word) => (
          <div
            key={`${word.wd}-${word.dt}`}
            className={`flex flex-col bg-gray-100 p-4 rounded shadow-md hover:shadow-lg transition-shadow ${
              word.wd === highlightedWord ? "bg-yellow-200" : ""
            } ${highlightedWord === word.wd ? "fade-out" : ""}`} // Apply fade-out class
          >
            <div className="flex w-full">
              <div className="w-full">
                <h3 className="text-3xl font-semibold text-slate-800">
                  {word.wd}
                </h3>
                <div className="w-full">
                  <p className="text-gray-600 w-full mb-4 mt-4">
                    {word.definition}
                  </p>
                </div>
                <div className="flex gap-2 text-gray-600 mb-4 pt-4 flex mt-2 border-t border-gray-300 w-full">
                  <strong>Part of Speech: </strong> {word.partOfSpeech}
                  {/* The space after the label is now included */}
                </div>
              </div>
            </div>

            <div class="flex items-center justify-center w-full">
              <label
                for="dropzone-file"
                class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p class="mb-2 text-sm p-4 text-center text-balance text-gray-500">
                    <span class="font-semibold">
                      Click to upload image of the whiteboard
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p class="text-xs text-gray-500">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input id="dropzone-file" type="file" class="hidden" />
              </label>
            </div>
            <div className="flex justify-between mt-4 gap-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                {formatDate(word.dt)}
              </span>
              <button
                onClick={() => deleteWord(word.dt)}
                disabled={deletingWords.has(word.dt)} // This should only disable the button for the specific word being deleted
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                title="Delete word"
              >
                {deletingWords.has(word.dt) ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
            <div className="flex flex-col gap-4"></div>
          </div>
        ))}
        {savedWords.length === 0 && !loading && (
          <p className="text-gray-500 text-center py-4">No words saved yet</p>
        )}
      </div>
    </div>
  );
}

export default WordList;

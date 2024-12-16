import { useState, useEffect } from "react";
import "../styles/global.css";
import SkeletonLoader from "./SkeletonLoader";
import { useUploadThing } from "../utils/uploadthing-config";

function WordList({ wordData }) {
  const [savedWords, setSavedWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingWords, setDeletingWords] = useState(new Set());
  const [uploadingPhoto, setUploadingPhoto] = useState(new Set());
  const [highlightedWord, setHighlightedWord] = useState(null);
  const [wordImages, setWordImages] = useState({});

  const { startUpload } = useUploadThing("imageUploader");

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

  const deleteWord = async (wordToDelete) => {
    // Create a unique identifier for the word using both dt and wd
    const wordId = `${wordToDelete.dt}-${wordToDelete.wd}`;

    // Update loading state for this specific word only
    setDeletingWords((prev) => new Set([...prev, wordId]));

    try {
      // Log the deletion attempt
      console.log("Attempting to delete word:", wordToDelete);

      const response = await fetch(
        `/api/word?dt=${encodeURIComponent(
          wordToDelete.dt
        )}&wd=${encodeURIComponent(wordToDelete.wd)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete word: ${errorMessage}`);
      }

      // Only remove the specific word that was deleted
      setSavedWords((prevWords) =>
        prevWords.filter(
          (word) => word.dt !== wordToDelete.dt || word.wd !== wordToDelete.wd
        )
      );
    } catch (err) {
      setError(`Failed to delete word: ${err.message}`);
      console.error("Delete error:", err);
    } finally {
      setDeletingWords((prev) => {
        const newSet = new Set(prev);
        newSet.delete(wordId);
        return newSet;
      });
    }
  };

  const handleUploadComplete = async (word, res) => {
    if (!Array.isArray(res) || res.length === 0) {
      console.error("Invalid upload response");
      return;
    }

    const uploadedFile = res[0];
    const photoUrl =
      uploadedFile.url || uploadedFile.fileUrl || uploadedFile.data?.url;

    if (!photoUrl) {
      console.error("No URL found in response");
      return;
    }

    try {
      // Update local state immediately for better UX
      setSavedWords((prevWords) =>
        prevWords.map((w) =>
          w.dt === word.dt && w.wd === word.wd ? { ...w, photoUrl } : w
        )
      );

      // Then update the backend
      const updateResponse = await fetch(`/api/word`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dt: word.dt,
          wd: word.wd,
          photoUrl,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update word with photo");
      }
    } catch (err) {
      console.error("Failed to update word with photo:", err);
      setError("Failed to save photo URL");

      // Revert the state change on error
      setSavedWords((prevWords) =>
        prevWords.map((w) =>
          w.dt === word.dt && w.wd === word.wd
            ? { ...w, photoUrl: word.photoUrl }
            : w
        )
      );
    }
  };

  const handleUploadError = (error) => {
    console.error("Upload error:", error);
    setError(`Upload failed: ${error.message}`);
  };

  const handleFileUpload = async (e, word) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto((prev) => new Set([...prev, word.dt]));

    try {
      const uploadResponse = await startUpload([file]);
      if (!uploadResponse) {
        throw new Error("Upload failed");
      }

      const uploadedFile = uploadResponse[0];
      const photoUrl = uploadedFile.url;

      if (!photoUrl) {
        throw new Error("No URL in response");
      }

      // Update local state first
      setSavedWords((prevWords) =>
        prevWords.map((w) =>
          w.dt === word.dt && w.wd === word.wd ? { ...w, photoUrl } : w
        )
      );

      // Then update the server
      const response = await fetch("/api/word", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dt: word.dt,
          wd: word.wd,
          photoUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to update word with photo");
    } catch (err) {
      console.error("Failed to upload photo:", err);
      setError("Failed to upload photo");

      // Revert the state change on error
      setSavedWords((prevWords) =>
        prevWords.map((w) =>
          w.dt === word.dt && w.wd === word.wd
            ? { ...w, photoUrl: word.photoUrl }
            : w
        )
      );
    } finally {
      setUploadingPhoto((prev) => {
        const newSet = new Set(prev);
        newSet.delete(word.dt);
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
      <div className="flex flex-col gap-4">
        {savedWords.map((word) => (
          <div
            key={`${word.wd}-${word.dt}`}
            className={`flex flex-col bg-gray-100 p-4 rounded shadow-md hover:shadow-lg transition-shadow ${
              word.wd === highlightedWord ? "bg-yellow-200" : ""
            } ${highlightedWord === word.wd ? "fade-out" : ""}`}
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
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center w-full">
              {word.photoUrl ? (
                <div className="w-full h-64 sm:h-[350px] relative">
                  <img
                    key={word.photoUrl}
                    src={word.photoUrl}
                    alt={`Image for ${word.wd}`}
                    className="w-full h-64 sm:h-[350px] object-cover rounded-lg"
                    onError={(e) => {
                      console.error("Image failed to load:", word.photoUrl);
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor={`dropzone-file-${word.dt}`}
                    className="flex flex-col items-center justify-center w-full h-64 sm:h-[350px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadingPhoto.has(word.dt) ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mb-4"></div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Uploading...
                          </p>
                        </div>
                      ) : (
                        <>
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF (MAX 2mb)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      id={`dropzone-file-${word.dt}`}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, word)}
                      accept="image/*"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-4 gap-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                {formatDate(word.dt)}
              </span>
              <button
                onClick={() => deleteWord(word)}
                disabled={deletingWords.has(`${word.dt}-${word.wd}`)}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                title="Delete word"
              >
                {deletingWords.has(`${word.dt}-${word.wd}`) ? (
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
          </div>
        ))}
        {savedWords.length === 0 && !loading && <SkeletonLoader client:load />}
      </div>
    </div>
  );
}

export default WordList;

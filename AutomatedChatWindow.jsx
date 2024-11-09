import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Troubleshoot = () => {
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [driverDetails, setDriverDetails] = useState("");
  const [updateDetails, setUpdateDetails] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [diskCheckOutput, setDiskCheckOutput] = useState("");
  const [abortController, setAbortController] = useState(null);
  const [eventSource, setEventSource] = useState(null);
  const [transition, setTransition] = useState(false);
  const [transitionIndex, setTransitionIndex] = useState(-1);
  const transitionMessages = [
    "Finding a fix...",
    "Running required steps to fix...",
    "Waiting for the task to be completed, please be patient...",
  ];

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const messagesEndRef = useRef(null); // Reference for the end of messages

  useEffect(() => {
    // Scroll to bottom whenever messages update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  const determineAction = (input) => {
    const lowerCaseInput = input.toLowerCase();
    if (
      lowerCaseInput.includes("wifi") ||
      lowerCaseInput.includes("internet")
    ) {
      return "wifi";
    } else if (
      lowerCaseInput.includes("sound") ||
      lowerCaseInput.includes("audio") ||
      lowerCaseInput.includes("no sound") ||
      lowerCaseInput.includes("speaker not working")
    ) {
      return "sound";
    } else if (
      lowerCaseInput.includes("reset network") ||
      lowerCaseInput.includes("wifi reset") ||
      lowerCaseInput.includes("internet reset") ||
      lowerCaseInput.includes("wifi adapter reset")
    ) {
      return "reset-network";
    } else if (
      lowerCaseInput.includes("dns problem") ||
      lowerCaseInput.includes("clear dns") ||
      lowerCaseInput.includes("dns issue") ||
      lowerCaseInput.includes("reset dns") ||
      lowerCaseInput.includes("dns")
    ) {
      return "clear-dns";
    } else if (
      lowerCaseInput.includes("graphics driver update") ||
      lowerCaseInput.includes("update gpu driver") ||
      lowerCaseInput.includes("graphics issue") ||
      lowerCaseInput.includes("update graphics") ||
      lowerCaseInput.includes("gpu not working") ||
      lowerCaseInput.includes("update my graphics driver") ||
      lowerCaseInput.includes("graphics driver issue")
    ) {
      return "update-graphics";
    } else if (
      lowerCaseInput.includes("disk issue") ||
      lowerCaseInput.includes("check disk") ||
      lowerCaseInput.includes("hard disk check") ||
      lowerCaseInput.includes("disk not working") ||
      lowerCaseInput.includes("slow disk") ||
      lowerCaseInput.includes("hard disk issue")
    ) {
      return "check-disk";
    } else {
      setTransitionIndex(-1); // Stop transition messages

      setMessage(
        "Sorry, I am unable to help with this issue. Don't worry, you can book a service with MachineVice and our experts will help you."
      );
      return null;
    }
  };

  const handleTroubleshoot = async () => {
    setLoading(true);
    setTransitionIndex(0); // Start displaying transition messages
    setMessage("");
    const controller = new AbortController();
    setAbortController(controller);

    const action = determineAction(userInput);
    if (!action) {
      setLoading(false);
      return; // Early exit if no action was determined
    }

    // Display transition messages one by one
    const transitionTimeout = setInterval(() => {
      setTransitionIndex((prevIndex) => {
        if (prevIndex < transitionMessages.length - 1) {
          return prevIndex + 1;
        } else {
          clearInterval(transitionTimeout);
          return prevIndex;
        }
      });
    }, 3000);

    if (action === "check-disk") {
      const newEventSource = new EventSource(`api/chatbot/check-disk`);

      setEventSource(newEventSource);

      newEventSource.onmessage = (event) => {
        setDiskCheckOutput((prev) => prev + event.data + "\n");
      };

      newEventSource.onerror = (errorEvent) => {
        setLoading(false);
        setMessage("Error checking disk.");
        setTransitionIndex(-1); //
        console.error("EventSource error:", errorEvent);
        newEventSource.close();
      };

      newEventSource.onopen = () => {
        setLoading(true);
      };

      newEventSource.addEventListener("close", () => {
        newEventSource.close();
        setTransitionIndex(-1);
        clearInterval(transitionTimeout);
        setLoading(false);
      });

      newEventSource.onclose = () => {
        console.log("Connection to server closed");
        setEventSource(null);
      };

      return;
    }

    try {
      const response = await axios.post(`/api/chatbot/${action}`, {
        signal: controller.signal,
      });
      setTransition("false");
      setMessage(response.data.message);
      setErrorDetails(response.data.errorDetails);
      setDriverDetails(response.data.driverDetails);
      setUpdateDetails(response.data.updateDetails);
      setUserInput("");
      setDiskCheckOutput("");
    } catch (error) {
      if (axios.isCancel(error)) {
        setMessage("Troubleshooting task was canceled.");
      } else {
        setMessage(
          `Error: ${error.response?.data?.message || "An error occurred"}`
        );
        console.error("Axios error:", error);
      }
    } finally {
      setLoading(false);
      setAbortController(null);
      clearInterval(transitionTimeout);
      setTransitionIndex(-1);
    }
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setLoading(false);
      setMessage("Troubleshooting task was canceled.");
      setAbortController(null);
    }
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (abortController) abortController.abort();
      if (eventSource) eventSource.close();
    };
  }, [abortController, eventSource]);

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto bg-gray-900 text-gray-200 p-4 rounded-lg shadow-lg">
      <h1 className="text-xl font-bold mb-2">Machinevice Troubleshooter</h1>
      <h2 className="text-sm text-center mb-4">
        If the issue continues, our Service team is here to help! Book a service
        on our{" "}
        <a
          className="text-red-500 underline"
          href="https://www.machinevice.com/bookservice"
          target="_blank"
          rel="noopener noreferrer"
        >
          FIX-Device Page
        </a>
      </h2>

      <textarea
        value={userInput}
        onChange={handleInputChange}
        placeholder="Describe your problem (e.g., 'I can't connect to Wi-Fi')"
        className="mt-2 p-3 border border-gray-700 rounded w-full h-24 bg-gray-800 text-gray-200 focus:outline-none focus:ring focus:ring-blue-500"
      />

      <div className="flex space-x-2 mt-4 w-full">
        <button
          onClick={handleTroubleshoot}
          className={`flex-grow p-2 rounded transition duration-300 ${
            loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-500"
          } text-white`}
          disabled={loading || !userInput}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Troubleshooting...
            </span>
          ) : (
            "Troubleshoot"
          )}
        </button>

        <button
          onClick={handleCancel}
          className="flex-grow p-2 bg-red-600 rounded text-white hover:bg-red-500"
          disabled={!loading}
        >
          Cancel Task
        </button>
      </div>

      {/* Transition Message */}
      {transitionIndex >= 0 && transitionIndex < transitionMessages.length && (
        <div className="mt-2 text-center">
          <p
            className={`text-sm transition duration-500 transform translate-y-${
              transitionIndex >= 0 ? 0 : 10
            } opacity-${transitionIndex >= 0 ? 100 : 0}`}
            style={{ transitionDelay: `${transitionIndex * 300}ms` }}
          >
            {transitionMessages[transitionIndex]}
          </p>
        </div>
      )}

      {/* Final Message Display */}
      <div ref={messagesEndRef} />
      {!loading && message && (
        <p className="mt-2 text-sm text-center">
          {message} {errorDetails && `| ${errorDetails}`}
        </p>
      )}
      {updateDetails && <p className="mt-2 text-sm">{updateDetails}</p>}

      {driverDetails && (
        <div className="mt-2 bg-gray-800 p-3 rounded w-full max-w-xs mx-auto">
          <h2 className="text-sm font-bold">Driver Details:</h2>
          <div
            className="max-h-40 overflow-y-auto p-1 border border-gray-700 rounded bg-gray-900 text-xs"
            style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
          >
            {driverDetails}
          </div>
        </div>
      )}

      {diskCheckOutput && (
        <div className="mt-2 bg-gray-800 p-3 rounded w-full max-w-xs mx-auto">
          <h2 className="text-sm font-bold">Disk Check Output:</h2>
          <div
            className="max-h-40 overflow-y-auto p-1 border border-gray-700 rounded bg-gray-900 text-xs"
            style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
          >
            {diskCheckOutput}
          </div>
        </div>
      )}
    </div>
  );
};

export default Troubleshoot;

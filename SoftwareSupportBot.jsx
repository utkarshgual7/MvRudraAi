import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import tasks from "./taskSteps"; // Import the task steps
import { FaRobot, FaUser } from "react-icons/fa";
import DOMPurify from "dompurify";

const SoftwareSupportBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
      ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      : null;

  const [currentStep, setCurrentStep] = useState(-1);
  const [taskName, setTaskName] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const affirmativePhrases = [
    "yes",
    "backup completed",
    "i took a backup",
    "backuped my data",
    "it's done",
    "all set",
    "ready",
    "I finished",
    "completed",
    "done",
    "reached",
    "selected printer",
    "checked",
    "got it",
  ];

  const negativePhrases = [
    "no",
    "stop",
    "quit",
    "cancel",
    "not ready",
    "don't continue",
    "not yet",
    "not completed",
    "skip",
  ];

  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        handleSendMessage(transcript);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        handleMicToggle();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [recognition]);

  const handleSendMessage = async (message) => {
    const userMessage = message || userInput.trim();
    if (userMessage) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: userMessage },
      ]);
      setUserInput("");

      // Debugging log
      console.log("User Message:", userMessage);

      if (
        userMessage.toLowerCase().includes("clean install windows") &&
        currentStep === -1
      ) {
        console.log("Starting clean install windows task");
        startTask("cleanInstallWindows");
        return;
      }
      if (
        userMessage.toLowerCase().includes("install windows") &&
        currentStep === -1
      ) {
        console.log("Starting install windows on new laptop task");
        startTask("InstallWindowsOnNewLaptop");
        return;
      }
      if (
        userMessage.toLowerCase().includes("update windows to windows 11") &&
        currentStep === -1
      ) {
        console.log("Starting update windows 10 to 11 task");
        startTask("updateWindows10To11");
        return;
      }

      if (
        userMessage.toLowerCase().includes("change wallpaper") &&
        currentStep === -1
      ) {
        console.log("Starting change wallpaper task");
        startTask("changewallpaper");
        return;
      }
      if (
        userMessage.toLowerCase().includes("enable disable startup programs") &&
        currentStep === -1
      ) {
        console.log("Starting enable/disable startup programs task");
        startTask("configurestartupprograms");
        return;
      }

      if (
        userMessage.toLowerCase().includes("set up microsoft account") &&
        currentStep === -1
      ) {
        console.log("Starting setup microsoft account task");
        startTask("setupmicrosoftaccount");
        return;
      }

      if (
        userMessage
          .toLowerCase()
          .includes("setup windows lock pin facerecognition or hello") &&
        currentStep === -1
      ) {
        console.log("Starting setup windows pin or recognition task");
        startTask("setupwindowspinorrecognition");
        return;
      }

      if (
        userMessage.toLowerCase().includes("Customize taskbar or start menu") &&
        currentStep === -1
      ) {
        console.log("Starting customize taskbar and start menu task");
        startTask("CustomizeTaskbarandStartMenu");
        return;
      }

      if (
        userMessage.toLowerCase().includes("enable clipboard history") &&
        currentStep === -1
      ) {
        console.log("Starting enable clipboard history task");
        startTask("EnableClipboardHistory");
        return;
      }

      if (
        userMessage.toLowerCase().includes("set default app") &&
        currentStep === -1
      ) {
        console.log("Starting set default app task");
        startTask("SetDefaultApp");
        return;
      }

      if (
        /set up printer|help me set up printer|enable printer|how to set up printer in windows|how to setup printer in windows/i.test(
          userMessage
        ) &&
        currentStep === -1
      ) {
        console.log("Starting setup printer task");
        startTask("Setupprinter");
        return;
      }

      // Handle task flow if task is in progress
      if (taskName && currentStep < tasks[taskName].length) {
        const isAffirmative = affirmativePhrases.some((phrase) =>
          userMessage.toLowerCase().includes(phrase)
        );

        const isNegative = negativePhrases.some((phrase) =>
          userMessage.toLowerCase().includes(phrase)
        );

        if (isAffirmative) {
          proceedToNextStep();
        } else if (isNegative) {
          stopTaskFlow();
        } else if (
          userMessage.toLowerCase().includes("error") ||
          userMessage.toLowerCase().includes("help")
        ) {
          setIsPaused(true);
          handleHelpRequest(userMessage);
        } else {
          const confirmationMessage =
            "Please confirm if you are ready to proceed.";
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: "bot", content: confirmationMessage },
          ]);
          speak(confirmationMessage);
        }
        return;
      }

      // Standard chatbot response if no task is in progress
      try {
        const response = await axios.post("/api/chatbot/ask", {
          question: userMessage,
          context: messages,
        });
        const botResponse = response.data.answer;
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "bot", content: botResponse },
        ]);
        speak(botResponse);
      } catch (error) {
        handleError();
      }
    }
  };

  const stopTaskFlow = () => {
    const stopMessage = "The task flow has been stopped.";
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "bot", content: stopMessage },
    ]);
    speak(stopMessage);
    setCurrentStep(-1);
    setTaskName("");
  };

  const handleHelpRequest = async (errorMessage) => {
    try {
      const response = await axios.post("/api/chatbot/ask", {
        question: errorMessage,
        context: messages,
      });

      const errorSolution = response.data.answer;
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: errorSolution },
      ]);
      speak(errorSolution);

      // Wait for the solution to finish speaking, then ask if they want to continue
      const continueMessage = "Would you like to continue with the steps?";
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "bot", content: continueMessage },
        ]);
        speak(continueMessage); // Speak the continue message
      }, errorSolution.length * 80); // Delay based on solution length to give time for speaking
    } catch (error) {
      handleError();
    }
  };

  const proceedToNextStep = () => {
    if (isPaused) {
      setIsPaused(false);
    }
    setCurrentStep((prevStep) => prevStep + 1);

    if (currentStep + 1 < tasks[taskName].length) {
      const nextStep = tasks[taskName][currentStep + 1];
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: nextStep },
      ]);
      speak(nextStep);
    } else {
      const completionMessage =
        "You have completed all the steps for " + taskName + ".";
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: completionMessage },
      ]);
      speak(completionMessage);
      setCurrentStep(-1);
      setTaskName("");
    }
  };

  const startTask = (taskName) => {
    setTaskName(taskName);
    setCurrentStep(0);
    const firstStep = tasks[taskName][0];
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "bot", content: firstStep },
    ]);
    speak(firstStep);
  };

  const handleMicToggle = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };
  const speak = (text) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const plainText = text.replace(/<[^>].*>?/gm, "");
    const utterance = new SpeechSynthesisUtterance(plainText);
    speechSynthesis.speak(utterance);
  };
  const handleError = () => {
    const errorMessage = "I'm sorry, I couldn't understand that.";
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "bot", content: errorMessage },
    ]);
    speak(errorMessage);
  };
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="text-white max-w mx-auto rounded-lg shadow-md h-full flex flex-col justify-between">
      <h2 className="text-sm font-semibold mb-1">Software Support</h2>
      <p className="text-xs mb-1">
        If you face error just say error and tell the error faced
      </p>
      <div className="messages max-h-72 overflow-y-auto mb-4 flex-grow">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message mb-2 text-sm p-2 rounded ${
              msg.role === "bot" ? "bg-gray-700" : "bg-gray-600"
            } flex items-start`}
          >
            {msg.role === "bot" ? (
              <FaRobot className="text-blue-400 w-6 mr-2" />
            ) : (
              <FaUser className="text-green-400 mr-2" />
            )}
            <span
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(msg.content, {
                  USE_PROFILES: { html: true },
                }),
              }}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area flex items-center p-2 sticky bottom-0 bg-gray-800 rounded-lg">
        <span className="flex-grow text-xs p-2 bg-gray-700 border border-gray-600 text-white rounded">
          Use mic or press spacebar to ask.
        </span>
        <button
          onClick={handleMicToggle}
          className="p-2 ml-2 rounded bg-blue-600 text-white"
        >
          {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
      </div>
    </div>
  );
};

export default SoftwareSupportBot;

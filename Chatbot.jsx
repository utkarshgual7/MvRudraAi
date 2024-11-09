import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OrderHelp from "./OrderHelp";
import AutomatedChatWindow from "./AutomatedChatWindow";
import DOMPurify from "dompurify";
import { FaUser, FaRobot } from "react-icons/fa";
import SoftwareSupportBot from "./SoftwareSupportBot";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isInitial, setIsInitial] = useState(true);
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  const [showOrderHelp, setShowOrderHelp] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isGuiding, setIsGuiding] = useState(false);
  const [showAutomatedChat, setShowAutomatedChat] = useState(false);
  const [showQuickRepairAI, setShowQuickRepairAI] = useState(false);
  const [showSoftwareSupportBot, setShowSoftwareSupportBot] = useState(false);

  const navigate = useNavigate();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const handleUserSelection = async (selection) => {
    if (selection === "Order Related") {
      setShowAuthMessage(true);
      setIsInitial(false);
    } else if (selection === "Service Related") {
      const initialMessage =
        "You can start asking your questions related to your device. I will be happy to help you :) ";
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: initialMessage },
      ]);
      setIsInitial(false);
    } else if (selection === "QuickRepair") {
      setShowQuickRepairAI(true);
      setIsInitial(false);
    } else if (selection === "Software Support") {
      setShowSoftwareSupportBot(true);
      setIsInitial(false);
    } else {
      const userMessage = `I need ${selection.toLowerCase()} help`;
      setMessages([...messages, { role: "user", content: userMessage }]);
      const response = await axios.post("api/chatbot/ask", {
        question: userMessage,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: response.data.answer },
      ]);
      setIsInitial(false);
    }
  };

  const handleAuthResponse = (response) => {
    if (response === "authenticate") {
      setShowOrderHelp(true);
      setShowAuthMessage(false);
      const authMessage = "Please fill in the form below to authenticate.";
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: authMessage },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      const userMessage = userInput.trim();
      setMessages([...messages, { role: "user", content: userMessage }]);
      setUserInput("");
      const response = await axios.post("api/chatbot/ask", {
        question: userMessage,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: response.data.answer },
      ]);
    }
  };

  const handleRestartChat = () => {
    setMessages([]);
    setIsInitial(true);
    setShowAuthMessage(false);
    setShowOrderHelp(false);
    setUserInput("");
    setIsGuiding(false);
    setShowAutomatedChat(false);
    setShowQuickRepairAI(false);
  };

  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  });

  const sanitizeMessage = (message) => {
    return DOMPurify.sanitize(message);
  };

  return (
    <div className="w-[390px] h-[330px] flex flex-col bg-gray-900 text-gray-200 rounded-lg shadow-lg p-3 space-y-1 max-md:w-[360px] ">
      <h2 className="text-center text-xl underline font-semibold text-red-400">
        Rudra - Machinevice Assistant
      </h2>

      <div className="flex-1 overflow-y-auto p-1 space-y-2">
        {isInitial && (
          <div className="space-y-1 text-center">
            <p className="text-lg mt-1 mb-2">Select a category:</p>{" "}
            <button
              onClick={() => handleUserSelection("Order Related")}
              className="w-[95%] py-2 px-4 flex items-center justify-center space-x-3 transition ease-in-out delay-150 translate-x-1 hover:scale-105 duration-300 hover:bg-green-700 text-white text-lg rounded-lg"
            >
              <span>Order Help</span>
              <img
                className="w-8 h-8" // Adjusted size to fit better
                src="https://img.icons8.com/color/96/move-by-trolley.png"
              />{" "}
              {/* Added span for better control */}
            </button>
            <button
              onClick={() => handleUserSelection("Service Related")}
              className="w-[95%] py-2 flex items-center justify-center space-x-3 ease-in-out delay-150 translate-x-1 hover:scale-105 duration-300 hover:bg-red-700 text-white text-lg rounded-lg"
            >
              <span>Device Help</span>
              <img
                className="w-8 h-8"
                src="https://img.icons8.com/color/96/multiple-devices.png"
              />{" "}
            </button>
            <button
              onClick={() => handleUserSelection("Software Support")}
              className="w-[95%] flex items-center justify-center space-x-3  py-2 ease-in-out delay-150 translate-x-1 hover:scale-105 duration-300 hover:bg-yellow-500 text-white text-lg rounded-lg"
            >
              {" "}
              <span>Software Support</span>
              <img
                className="w-8 h-8"
                src="https://img.icons8.com/color/96/headset.png"
              />{" "}
            </button>
            <button
              onClick={() => handleUserSelection("QuickRepair")}
              className="w-[95%] flex items-center justify-center space-x-3   py-2 ease-in-out delay-150 translate-x-1 hover:scale-105 duration-300 hover:bg-purple-600 text-white text-lg  rounded-lg"
            >
              <span>QuickRepair AI</span>
              <span className="text-xs">(only for PCs)</span>
              <img
                className="w-8 h-8"
                src="https://img.icons8.com/color/96/artificial-intelligence.png"
              />{" "}
            </button>
          </div>
        )}

        {showQuickRepairAI && (
          <div>
            <AutomatedChatWindow />
          </div>
        )}

        {showSoftwareSupportBot && (
          <div>
            <SoftwareSupportBot />
          </div>
        )}
        {showAuthMessage && (
          <div className="flex flex-col space-y-2 text-center">
            <p>You need to be authenticated to access order-related help.</p>
            <button
              onClick={() => handleAuthResponse("authenticate")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Get Authenticated
            </button>
            <a href="/">
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg">
                No, Exit
              </button>
            </a>
          </div>
        )}

        {!isInitial &&
          !showAuthMessage &&
          !showOrderHelp &&
          !showAutomatedChat &&
          !showQuickRepairAI &&
          !showSoftwareSupportBot && (
            <div className="flex-1 overflow-y-auto max-h space-y-1">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start mt-2 mb-1 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "bot" && (
                    <FaRobot className="mr-2 text-sm text-gray-500" />
                  )}
                  <span
                    className={`inline-block px-2 py-1 mt-2 rounded-lg text-sm break-words max-w-[90%] ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(message.content, {
                        USE_PROFILES: { html: true },
                      }),
                    }}
                    style={{ color: "darkblue", textDecoration: "underline" }}
                  />
                  {message.role === "user" && (
                    <FaUser className="ml-2 text-blue-500" />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
              <div className="mt-24 flex flex-col p-1">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your message..."
                  className="px-1 py-1 mb-2 mt-5  text-sm bg-gray-800 border border-gray-600 rounded text-white"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-2 max-w-[50%] items-center py-2 mt-2 bg-indigo-600 text-xs rounded-lg text-white"
                >
                  Send
                </button>
                <button
                  onClick={handleRestartChat}
                  className="px-2 py-2 max-w-[30%] mt-2 bg-red-600 text-xs rounded text-white"
                >
                  Restart Chat
                </button>
              </div>
            </div>
          )}

        {showOrderHelp && <OrderHelp />}
      </div>
    </div>
  );
};

export default Chatbot;

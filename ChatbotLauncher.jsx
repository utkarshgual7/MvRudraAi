import React, { useState, useEffect, useRef } from "react";
import Chatbot from "./Chatbot.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChatbotLauncher = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const chatbotRef = useRef(null);
  const floatingButtonRef = useRef(null);

  // Get the authentication state from Redux (or wherever you're storing it)
  const isLoggedIn = useSelector((state) => state.user.currentUser); //

  const navigate = useNavigate();

  const toggleChatbot = () => {
    if (isLoggedIn) {
      if (isChatbotOpen) {
        setIsChatbotOpen(false);
        setIsButtonDisabled(false);
      } else {
        setIsChatbotOpen(true);
        setIsButtonDisabled(true);
      }
    } else {
      setShowLoginPrompt(true);
    }
  };

  const redirectToLogin = () => {
    navigate("/login");
    setShowLoginPrompt(false);
    setIsButtonDisabled(false);
  };

  // Close the chatbot if user clicks outside of the chatbot window or the floating button
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target) &&
        floatingButtonRef.current &&
        !floatingButtonRef.current.contains(event.target)
      ) {
        setIsChatbotOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close the chatbot window when the user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      setIsChatbotOpen(false);
      setIsButtonDisabled(false);
    }
  }, [isLoggedIn]);

  return (
    <div>
      <div
        ref={floatingButtonRef}
        className={`fixed bottom-5 right-10 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg z-50 ${
          isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={toggleChatbot}
        disabled={isButtonDisabled}
      >
        <img
          className="w-12 h-12"
          src="https://i.ibb.co/MSFpxZL/chaticon.png"
          alt="message-bot"
        />
      </div>

      {/* Chatbot Window */}
      {isChatbotOpen && (
        <div
          ref={chatbotRef}
          className="fixed bottom-20 right-5 w-[400px] h-[335px] border rounded-lg shadow-lg z-50 max-md:w-[340px]"
        >
          <Chatbot />
        </div>
      )}

      {/* Login Prompt (only shows when the user tries to open the chatbot while not logged in) */}
      {showLoginPrompt && (
        <div className="fixed bottom-20 right-5 w-[400px] h-[100px] bg-gray-800 border rounded-lg shadow-lg z-50 flex items-center justify-center max-md:w-[340px]">
          <p className="text-center">
            Please{" "}
            <button
              className="text-blue-500 underline cursor-pointer"
              onClick={redirectToLogin}
            >
              login
            </button>{" "}
            to use the Rudra AI assistant.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatbotLauncher;

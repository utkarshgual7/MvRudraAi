import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OrderHelp() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trackingSuccess, setTrackingSuccess] = useState(false);
  const navigate = useNavigate();

  const handleAuthenticate = async () => {
    try {
      const response = await axios.post("api/chatbot/order-help", {
        email,
      });
      setMessage(response.data.message);
      setIsAuthenticated(true);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error authenticating user");
    }
  };

  const handleViewOrders = async () => {
    try {
      const response = await axios.get(`api/chatbot/vieworders?email=${email}`);
      setOrders(response.data.orders);
      setMessage("Here are your orders:");
    } catch (error) {
      setMessage(error.response?.data?.error || "Error fetching orders");
    }
  };

  const handleTrackOrder = async () => {
    const orderIdToTrack = prompt("Enter the order ID to track:");
    if (orderIdToTrack) {
      try {
        const response = await axios.get(`api/chatbot/track/${orderIdToTrack}`);
        setMessage(`Tracking info: ${response.data.trackingInfo}`);
        setTrackingSuccess(true);
      } catch (error) {
        setMessage(error.response?.data?.error || "Error tracking order");
      }
    }
  };

  const handleRestartChat = () => {
    setEmail("");
    setMessage("");
    setOrders([]);
    setTrackingSuccess(false);
    setIsAuthenticated(false);

    setIsInitial(true);
    setShowAuthMessage(false);
    setShowOrderHelp(false);
    setUserInput("");
    setIsGuiding(false);
    setShowAutomatedChat(false);
  };

  return (
    <div className="flex flex-col items-center justify-center text-white bg-gray-900 overflow-hidden">
      <h3 className="mb-4 text-lg font-bold">Order Help</h3>
      {!isAuthenticated ? (
        <div className="flex flex-col items-center">
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2 px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg"
            required
          />
          <button
            onClick={handleAuthenticate}
            className="mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Authenticate
          </button>

          {message && <p className="mt-2 text-red-400">{message}</p>}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p>{message}</p>
          <button
            onClick={handleViewOrders}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            View Orders
          </button>
          <button
            onClick={handleTrackOrder}
            className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg"
          >
            Track Order
          </button>
          <button
            onClick={handleRestartChat}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg"
          >
            Exit
          </button>
        </div>
      )}
      {orders.length > 0 && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg max-h-40 overflow-y-auto">
          <h4 className="mb-2 font-bold">Your Orders:</h4>
          <ul>
            {orders.map((order, index) => (
              <li key={index} className="mb-1">
                {order.name} - {order.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default OrderHelp;

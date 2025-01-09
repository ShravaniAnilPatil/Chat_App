import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Welcome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-violet-200 to-violet-300 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center w-full max-w-md">
        {user && (
          <div
            className="flex justify-center mb-6 cursor-pointer"
            onClick={handleProfileClick}
          >
            <FaUserCircle size={60} color="#6B46C1" title="Profile" />
          </div>
        )}

        <h1 className="text-4xl font-extrabold text-violet-800 mb-4">
          Welcome to ChatApp
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Connect with your friends and family in a seamless and fun way!
        </p>

        <div className="space-y-4">
          <a
            href="/login"
            className="block bg-violet-500 text-white py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            Log In
          </a>
          <a
            href="/signup"
            className="block bg-violet-400 text-white py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            Sign Up
          </a>
          <a
            href="/recivers"
            className="block bg-violet-600 text-white py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            Chat Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

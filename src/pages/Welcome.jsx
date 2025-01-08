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
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center w-full max-w-md">
        {user && (
          <div
            className="flex justify-center mb-6 cursor-pointer"
            onClick={handleProfileClick}
          >
            <FaUserCircle size={60} color="#4CAF50" title="Profile" />
          </div>
        )}

        <h1 className="text-4xl font-extrabold text-violet-800 mb-4">Welcome to ChatApp</h1>
        <p className="text-lg text-gray-700 mb-8">
          Connect with your friends and family in a seamless and fun way!
        </p>

        <div className="space-y-4">
          <a
            href="/login"
            className="block bg-violet-600 text-white py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            Log In
          </a>
          <a
            href="/signup"
            className="block bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Sign Up
          </a>
          <a
            href="/recivers"
            className="block bg-indigo-600 text-white py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Chat Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

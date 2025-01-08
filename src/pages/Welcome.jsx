import React from "react";
import "../styles/welcome.css"; // Import CSS directly

const Welcome = () => {
  return (
    <div className="welcome">
      <div className="welcome-container">
        <h1>Welcome to ChatApp</h1>
        <p>Connect with your friends and family in a seamless and fun way!</p>
        <div className="button-group">
          <a href="/login" className="button">
            Log In
          </a>
          <a href="/signup" className="button">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

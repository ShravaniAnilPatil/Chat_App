import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEdit, FaSignOutAlt, FaTrashAlt } from "react-icons/fa";

const Profile = () => {
  const { logout, email } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phone_number: "",
    state: "",
    gender: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/auth/user/profile?email=${email}`);
        const data = await response.json();

        if (data.email) {
          setProfile(data);
          setFormData({
            username: data.username,
            phone_number: data.phone_number,
            state: data.state,
            gender: data.gender,
          });
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [email]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    logout();
    navigate("/login");
  };

  const handleEditClick = () => setEditMode(true);

  const handleCancelEdit = () => {
    setFormData({
      username: profile.username,
      phone_number: profile.phone_number,
      state: profile.state,
      gender: profile.gender,
    });
    setEditMode(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/auth/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: profile.email, ...formData }),
      });

      const data = await response.json();

      if (data.updatedUser) {
        setProfile(data.updatedUser);
        setEditMode(false);
        console.log("Profile updated successfully.");
      } else {
        console.error("Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;

    try {
      const response = await fetch("http://localhost:5001/api/auth/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: profile.email }),
      });

      const data = await response.json();

      if (data.message === "User successfully deleted") {
        console.log("Account deleted successfully.");
        handleLogout();
      } else {
        console.error("Error deleting account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  if (isLoading) return <p className="text-center text-violet-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 to-violet-800 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center text-violet-700 mb-6">Your Profile</h1>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-violet-600">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                readOnly={!editMode}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  editMode
                    ? "border-gray-300 focus:ring-violet-500"
                    : "border-gray-100 bg-gray-100 cursor-not-allowed"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-violet-600">Email</label>
              <input
                type="text"
                value={profile?.email || ""}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-violet-600">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                readOnly={!editMode}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  editMode
                    ? "border-gray-300 focus:ring-violet-500"
                    : "border-gray-100 bg-gray-100 cursor-not-allowed"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-violet-600">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                readOnly={!editMode}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  editMode
                    ? "border-gray-300 focus:ring-violet-500"
                    : "border-gray-100 bg-gray-100 cursor-not-allowed"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-violet-600">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  editMode
                    ? "border-gray-300 focus:ring-violet-500"
                    : "border-gray-100 bg-gray-100 cursor-not-allowed"
                }`}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center space-x-4">
            {editMode ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEditClick}
                className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition"
              >
                Edit Profile
              </button>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

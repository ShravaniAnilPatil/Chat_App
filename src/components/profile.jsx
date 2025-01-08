// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import "../styles/profile.module.css";
// import { FaUserCircle, FaEdit, FaSignOutAlt } from "react-icons/fa";

// const Profile = () => {
//   const { user, logout, email } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     username: "",
//     phone_number: "",
//     state: "",
//     gender: "",
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!email) return;

//     const fetchProfile = async () => {
//       try {
//         const response = await fetch(`http://localhost:5001/api/auth/user/profile?email=${email}`);
//         const data = await response.json();

//         if (data.email) {
//           setProfile(data);
//           setFormData({
//             username: data.username,
//             phone_number: data.phone_number,
//             state: data.state,
//             gender: data.gender,
//           });
//         } else {
//           console.error("User not found");
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [email]);

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     logout();
//     navigate("/login");
//   };

//   const handleEditClick = () => setEditMode(!editMode);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:5001/api/auth/user/update", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email: profile.email, ...formData }),
//       });

//       const data = await response.json();

//       if (data.updatedUser) {
//         setProfile(data.updatedUser);
//         setEditMode(false);
//         console.log("Profile updated successfully.");
//       } else {
//         console.error("Error updating profile");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     }
//   };

//   if (isLoading) return <p>Loading...</p>;

//   return (
//     <div className="profilePage">
//       <div className="profileCard">
//         <FaUserCircle size={50} color="#4b0082" style={{ display: "block", margin: "0 auto" }} />
//         <h2>Your Profile</h2>
//         <div className="profileDetails">
//           {profile ? (
//             editMode ? (
//               <form onSubmit={handleUpdateProfile}>
//                 <div className="input-group">
//                   <label>Username:</label>
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="input-group">
//                   <label>Phone Number:</label>
//                   <input
//                     type="text"
//                     name="phone_number"
//                     value={formData.phone_number}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="input-group">
//                   <label>State:</label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="input-group">
//                   <label>Gender:</label>
//                   <select
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleChange}
//                   >
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>
//                 <button type="submit" className="edit-button">
//                   Save Changes
//                 </button>
//               </form>
//             ) : (
//               <>
//                 <p><strong>Username:</strong> {profile.username}</p>
//                 <p><strong>Email:</strong> {profile.email}</p>
//                 <p><strong>Phone Number:</strong> {profile.phone_number}</p>
//                 <p><strong>State:</strong> {profile.state}</p>
//                 <p><strong>Gender:</strong> {profile.gender}</p>
//               </>
//             )
//           ) : (
//             <p>No profile data available.</p>
//           )}
//         </div>
//         <button onClick={handleEditClick} className="edit-button">
//           <FaEdit style={{ marginRight: "5px" }} />
//           {editMode ? "Cancel Edit" : "Edit Profile"}
//         </button>
//         <button onClick={handleLogout} className="logout-button">
//           <FaSignOutAlt style={{ marginRight: "5px" }} />
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Profile;


import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/profile.module.css";
import { FaUserCircle, FaEdit, FaSignOutAlt, FaTrashAlt } from "react-icons/fa";

const Profile = () => {
  const { user, logout, email } = useAuth();
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

  const handleEditClick = () => setEditMode(!editMode);

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

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="profilePage">
      <div className="profileCard">
        <FaUserCircle size={50} color="#4b0082" style={{ display: "block", margin: "0 auto" }} />
        <h2>Your Profile</h2>
        <div className="profileDetails">
          {profile ? (
            editMode ? (
              <form onSubmit={handleUpdateProfile}>
                <div className="input-group">
                  <label>Username:</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>Phone Number:</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>State:</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>Gender:</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button type="submit" className="edit-button">
                  Save Changes
                </button>
              </form>
            ) : (
              <>
                <p><strong>Username:</strong> {profile.username}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone Number:</strong> {profile.phone_number}</p>
                <p><strong>State:</strong> {profile.state}</p>
                <p><strong>Gender:</strong> {profile.gender}</p>
              </>
            )
          ) : (
            <p>No profile data available.</p>
          )}
        </div>
        <button onClick={handleEditClick} className="edit-button">
          <FaEdit style={{ marginRight: "5px" }} />
          {editMode ? "Cancel Edit" : "Edit Profile"}
        </button>
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt style={{ marginRight: "5px" }} />
          Logout
        </button>
        <button onClick={handleDeleteAccount} className="delete-button">
          <FaTrashAlt style={{ marginRight: "5px" }} />
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;

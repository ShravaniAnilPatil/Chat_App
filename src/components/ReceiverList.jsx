import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';  
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ReceiverList = () => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/auth/users'); 
        const filteredUsers = response.data.filter(u => u.email !== user.email);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (user?.email) {
      fetchUsers();
    }
  }, [user?.email]);

  const handleReceiverClick = (receiver) => {
    localStorage.setItem('receiver', receiver.username);  
    navigate('/chat'); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-indigo-500 to-blue-600 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Select a Receiver</h2>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.username}
              className="receiver-item bg-gradient-to-r from-green-400 to-teal-500 hover:bg-gradient-to-r hover:from-teal-500 hover:to-green-400 text-white p-4 rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => handleReceiverClick(user)}
            >
              <span className="font-semibold">{user.username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReceiverList;

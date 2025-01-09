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
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-violet-200 to-violet-300 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-violet-700 mb-6">Select a Receiver</h2>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.username}
              className="receiver-item bg-gradient-to-r from-violet-400 to-violet-600 hover:from-violet-500 hover:to-violet-700 text-white p-4 rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
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

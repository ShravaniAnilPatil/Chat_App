import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';  
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/receiverList.css';

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
    <div className="receiver-list-container">
      <h2>Select a Receiver</h2>
      <div className="receiver-list">
        {users.map((user) => (
          <div
            key={user.username}
            className="receiver-item"
            onClick={() => handleReceiverClick(user)}
          >
            <span>{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceiverList;

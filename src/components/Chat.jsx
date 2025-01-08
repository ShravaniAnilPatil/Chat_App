import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import '../styles/chat.css';
import { AuthContext } from "../context/AuthContext";

const socket = io('http://localhost:5000');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState('');
  const [receiver, setReceiver] = useState(localStorage.getItem('receiver') || '');
  const [receiverExists, setReceiverExists] = useState(true);
  const { login, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/messages`, {
          params: { sender: username, receiver }
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (username && receiver) {
      fetchMessages();
    }

    socket.on('message', (message) => {
      if (
        (message.sender === username && message.receiver === receiver) ||
        (message.sender === receiver && message.receiver === username)
      ) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });

    return () => socket.off('message');
  }, [username, receiver]);

  useEffect(() => {
    if (user?.email) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:5001/api/auth/user/profile?email=${user.email}`);
          if (response.status === 200) {
            setUsername(response.data.username);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [user?.email]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const sendMessage = async () => {
    if (!input && !file) return;
    if (!receiverExists) {
      alert('Receiver does not exist!');
      return;
    }

    const message = {
      sender: username,
      receiver: receiver,
      text: input,
      timestamp: new Date().toISOString()
    };

    const formData = new FormData();
    formData.append('sender', message.sender);
    formData.append('receiver', message.receiver);
    formData.append('text', message.text);
    formData.append('timestamp', message.timestamp);

    if (file) {
      formData.append('file', file);
    }

    try {
      await axios.post('http://localhost:5000/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setInput('');
      setFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat with {receiver}</h1>
      </div>
      <div className="messages-container">
        {messages
          .filter(
            (msg) =>
              (msg.sender === username && msg.receiver === receiver) ||
              (msg.sender === receiver && msg.receiver === username)
          )
          .map((msg, index) => (
            <div key={index} className={`message ${msg.sender === username ? 'sent' : 'received'}`}>
              <div className="message-box">
                <strong>{msg.sender}:</strong> {msg.text}
                {msg.file_id && (
                  <iframe
                    src={`http://localhost:5000/file/${msg.file_id}`}
                    className="document-viewer"
                    title="Document Viewer"
                    width="100%"
                    height="300px"
                  />
                )}
                <small className="message-time">{new Date(msg.timestamp).toLocaleString()}</small>
              </div>
            </div>
          ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="message-input"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input"
        />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
};

export default Chat;

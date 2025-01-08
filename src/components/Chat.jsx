import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const socket = io("http://localhost:5000");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [receiver, setReceiver] = useState(localStorage.getItem("receiver") || "");
  const [receiverExists, setReceiverExists] = useState(true);
  const [documentURL, setDocumentURL] = useState(null); // Track the currently opened document
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/messages`, {
          params: { sender: username, receiver },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (username && receiver) {
      fetchMessages();
    }

    socket.on("message", (message) => {
      if (
        (message.sender === username && message.receiver === receiver) ||
        (message.sender === receiver && message.receiver === username)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => socket.off("message");
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
      alert("Receiver does not exist!");
      return;
    }

    const message = {
      sender: username,
      receiver: receiver,
      text: input,
      timestamp: new Date().toISOString(),
    };

    const formData = new FormData();
    formData.append("sender", message.sender);
    formData.append("receiver", message.receiver);
    formData.append("text", message.text);
    formData.append("timestamp", message.timestamp);

    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post("http://localhost:5000/messages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setInput("");
      setFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDocumentClick = (file_id) => {
    setDocumentURL(`http://localhost:5000/file/${file_id}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-6 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 flex flex-col space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-700">Chat with {receiver}</h1>
        </div>

        <div className="flex flex-col space-y-4 h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg">
          {messages
            .filter(
              (msg) =>
                (msg.sender === username && msg.receiver === receiver) ||
                (msg.sender === receiver && msg.receiver === username)
            )
            .map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg shadow-md ${
                  msg.sender === username
                    ? "bg-blue-100 self-end text-right"
                    : "bg-gray-200 self-start text-left"
                }`}
              >
                <div className="font-semibold text-gray-600">{msg.sender}</div>
                <div>{msg.text}</div>
                {msg.file_id && (
                  <button
                    onClick={() => handleDocumentClick(msg.file_id)}
                    className="text-sm text-blue-500 underline mt-2"
                  >
                    View Document
                  </button>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
        </div>

        {documentURL && (
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg">
            <iframe
              src={documentURL}
              className="w-full h-64 border border-gray-300 rounded"
              title="Document Viewer"
            />
            <button
              onClick={() => setDocumentURL(null)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Enter your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="p-3 rounded-lg border border-gray-300"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

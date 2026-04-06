import { useState } from "react";
import socket from "../services/socket";

export default function ChatPanel({
  isConnected,
  setLatestMessage,
  messages,
  setMessages,
}) {
  const [message, setMessage] = useState("");

  if (!isConnected) return null;

  const handleSend = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", message);
    setMessage("");
  };

  return (
    <div
      style={{
        width: "300px",
        height: "600px",
        backgroundColor: "#111827",
        color: "white",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2>Chat Room</h2>

      <div
        style={{
          marginTop: "20px",
          height: "420px",
          border: "1px solid gray",
          padding: "10px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, index) => (
          <p
            key={index}
            style={{
              textAlign: msg.senderId === socket.id ? "right" : "left",
              margin: "8px 0",
            }}
          >
            {msg.senderId === socket.id ? "You" : "Other"}: {msg.text}
          </p>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "10px",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={handleSend}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "10px",
        }}
      >
        Send
      </button>
    </div>
  );
}
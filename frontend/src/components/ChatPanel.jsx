import { useState } from "react";

export default function ChatPanel({
  isConnected,
  setLatestMessage,
}) {
  const [message, setMessage] = useState("");

  if (!isConnected) return null;

  const handleSend = () => {
    if (!message.trim()) return;

    setLatestMessage(message);
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
        borderLeft: "2px solid white",
      }}
    >
      <h2>Chat Room</h2>

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
import { useState } from "react";
import socket from "../services/socket";

export default function ChatPanel({
  partnerId,
  setPartnerId,
  messages,
  players,
}) {
  const [message, setMessage] = useState("");

  if (!partnerId) return null;

  // Filter messages for the current conversation thread
  const threadMessages = messages.filter(msg =>
    (msg.senderId === partnerId && (msg.targetId === socket.id || !msg.targetId)) ||
    (msg.senderId === socket.id && msg.targetId === partnerId)
  );

  // Identify other active conversations
  const otherConversations = [...new Set(messages
    .filter(msg => msg.senderId !== socket.id && msg.senderId !== partnerId)
    .map(msg => msg.senderId)
  )];

  const handleSend = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", { text: message, targetId: partnerId });
    setMessage("");
  };

  const getSenderName = (senderId) => {
    if (senderId === socket.id) return "You";
    return players[senderId]?.name || "Other";
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
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>With: {getSenderName(partnerId)}</h2>
        <button
          onClick={() => setPartnerId(null)}
          style={{ background: "transparent", border: "none", color: "#9ca3af", fontSize: "20px", cursor: "pointer" }}
        >✕</button>
      </div>

      {/* Thread Switcher */}
      {otherConversations.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <p style={{ margin: "0 0 5px 0", fontSize: "11px", color: "#9ca3af" }}>Other Chats:</p>
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {otherConversations.map(id => (
              <button
                key={id}
                onClick={() => setPartnerId(id)}
                style={{
                  background: "#374151",
                  border: "none",
                  color: "white",
                  padding: "4px 8px",
                  fontSize: "11px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                {players[id]?.name || "User"} (New)
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          flex: 1,
          border: "1px solid #374151",
          padding: "10px",
          overflowY: "auto",
          backgroundColor: "#0f172a",
          borderRadius: "4px"
        }}
      >
        {threadMessages.length === 0 ? (
          <p style={{ color: "#9ca3af", textAlign: "center", marginTop: "20px", fontSize: "12px" }}>
            No messages yet. Say hello!
          </p>
        ) : (
          threadMessages.map((msg, index) => (
            <p
              key={index}
              style={{
                textAlign: msg.senderId === socket.id ? "right" : "left",
                margin: "12px 0",
                fontSize: "13px"
              }}
            >
              <span style={{ fontWeight: "bold", color: msg.senderId === socket.id ? "#3b82f6" : "#22c55e" }}>
                {getSenderName(msg.senderId)}:
              </span> {msg.text}
            </p>
          ))
        )}
      </div>

      <input
        type="text"
        value={message}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{
          width: "100%",
          marginTop: "15px",
          padding: "10px",
          background: "#1f2937",
          border: "1px solid #374151",
          color: "white",
          borderRadius: "4px",
          outline: "none"
        }}
      />

      <button
        onClick={handleSend}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "10px",
          background: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Send
      </button>
    </div>
  );
}
import { useState } from "react";

export default function JoinScreen({ onJoin }) {
  const [name, setName] = useState("");

  const handleJoin = () => {
    if (!name.trim()) return;
    onJoin(name);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#d1d5db",
      }}
    >
      <div
        style={{
          padding: "30px",
          backgroundColor: "#111827",
          color: "white",
          borderRadius: "12px",
          width: "350px",
        }}
      >
        <h2>Enter your name</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "10px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleJoin}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "10px",
          }}
        >
          Join Cosmos
        </button>
      </div>
    </div>
  );
}
import { useState } from "react";
import { createAvatar } from "@dicebear/core";
import * as adventurer from "@dicebear/adventurer";

const AVATAR_SEEDS = [
  "Jasper", "Willow", "Alexander", "Milo", "Luna", "Oliver"
];

export default function JoinScreen({ onJoin }) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_SEEDS[0]);

  const handleJoin = () => {
    if (!name.trim()) return;
    onJoin(name, selectedAvatar);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111827",
      }}
    >
      <div
        style={{
          padding: "40px",
          backgroundColor: "#1f2937",
          color: "white",
          borderRadius: "20px",
          width: "400px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "1.8rem" }}>Join the Cosmos</h2>

        <div style={{ marginBottom: "25px" }}>
          <p style={{ marginBottom: "10px", color: "#9ca3af" }}>Choose your Avatar</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
            padding: "10px",
            backgroundColor: "#374151",
            borderRadius: "12px"
          }}>
            {AVATAR_SEEDS.map((seed) => (
              <div
                key={seed}
                onClick={() => setSelectedAvatar(seed)}
                style={{
                  cursor: "pointer",
                  borderRadius: "8px",
                  padding: "5px",
                  border: `3px solid ${selectedAvatar === seed ? "#3b82f6" : "transparent"}`,
                  backgroundColor: selectedAvatar === seed ? "#1e40af" : "transparent",
                  transition: "all 0.2s"
                }}
              >
                <img
                  src={createAvatar(adventurer, { seed }).toDataUri()}
                  alt={seed}
                  style={{ width: "100%", borderRadius: "4px" }}
                />
              </div>
            ))}
          </div>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#374151",
            color: "white",
            fontSize: "1rem",
            marginBottom: "20px",
            boxSizing: "border-box",
            outline: "none"
          }}
        />

        <button
          onClick={handleJoin}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#3b82f6",
            color: "white",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
        >
          Enter Cosmos
        </button>
      </div>
    </div>
  );
}
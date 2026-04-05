import { useState } from "react";
import Canvas from "./components/Canvas";
import ChatPanel from "./components/ChatPanel";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [latestMessage, setLatestMessage] = useState("Move closer to chat");

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#d1d5db",
        overflow: "hidden",
      }}
    >
      <Canvas
        setIsConnected={setIsConnected}
        latestMessage={latestMessage}
      />

      <ChatPanel
        isConnected={isConnected}
        setLatestMessage={setLatestMessage}
      />
    </div>
  );
}
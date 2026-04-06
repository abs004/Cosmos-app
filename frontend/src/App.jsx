import { useState, useEffect } from "react";
import Canvas from "./components/Canvas";
import ChatPanel from "./components/ChatPanel";
import socket from "./services/socket";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [latestMessage, setLatestMessage] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (messageData) => {
      setLatestMessage(messageData);
      setMessages((prev) => [...prev, messageData]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

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
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}
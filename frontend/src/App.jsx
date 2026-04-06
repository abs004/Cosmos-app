import { useState, useEffect } from "react";
import Canvas from "./components/Canvas";
import ChatPanel from "./components/ChatPanel";
import UserList from "./components/UserList";
import JoinScreen from "./components/JoinScreen";
import socket from "./services/socket";

export default function App() {
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  const [latestMessage, setLatestMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState({});

  useEffect(() => {
    socket.on("receiveMessage", (messageData) => {
      setLatestMessage(messageData);
      setMessages((prev) => [...prev, messageData]);
    });

    socket.on("playersUpdate", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("playersUpdate");
    };
  }, []);

  const handleJoin = (name) => {
    setUsername(name);
    setIsJoined(true);

    socket.emit("joinUser", {
      name,
    });
  };

  if (!isJoined) {
    return <JoinScreen onJoin={handleJoin} />;
  }

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
      <div style={{ position: "relative" }}>
        {/* Left Panel: Online Users */}
        <div
          style={{
            position: "absolute",
            right: "calc(100% + 2px)",
            top: 0,
            zIndex: 10,
          }}
        >
          <UserList players={players} />
        </div>

        <Canvas
          setIsConnected={setIsConnected}
          latestMessage={latestMessage}
          username={username}
          players={players}
        />

        {/* Right Panel: Chat Room */}
        <div
          style={{
            position: "absolute",
            left: "calc(100% + 2px)",
            top: 0,
            zIndex: 10,
          }}
        >
          <ChatPanel
            isConnected={isConnected}
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import Canvas from "./components/Canvas";
import ChatPanel from "./components/ChatPanel";
import UserList from "./components/UserList";
import JoinScreen from "./components/JoinScreen";
import socket from "./services/socket";

import LoadingSpinner from "./components/LoadingSpinner";

export default function App() {
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [partnerId, setPartnerId] = useState(null);
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

  const handleJoin = (name, avatarSeed) => {
    setUsername(name);
    setIsJoined(true);
    setIsLoading(true);

    socket.emit("joinUser", {
      name,
      avatarSeed,
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
      {isLoading && <LoadingSpinner />}

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
          setIsConnected={setPartnerId}
          latestMessage={latestMessage}
          username={username}
          players={players}
          setIsLoading={setIsLoading}
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
            partnerId={partnerId}
            setPartnerId={setPartnerId}
            messages={messages}
            setMessages={setMessages}
            players={players}
          />
        </div>
      </div>
    </div>
  );
}
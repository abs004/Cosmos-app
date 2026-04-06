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

  const handleExit = () => {
    socket.emit("leaveUser");
    setIsJoined(false);
    setUsername("");
    setPartnerId(null);
    setMessages([]);
    setIsLoading(false);
  };

  if (!isJoined) {
    return <JoinScreen onJoin={handleJoin} />;
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-slate-900 overflow-hidden relative">
      {isLoading && <LoadingSpinner />}

      <button
        onClick={handleExit}
        className="absolute top-6 right-6 z-50 px-5 py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 flex items-center gap-2 group shadow-lg shadow-red-900/20"
      >
        <span>Exit Cosmos</span>
        <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>

      <div className="relative">
        <div className="absolute right-[calc(100%+8px)] top-0 z-10">
          <UserList players={players} />
        </div>

        <Canvas
          setIsConnected={setPartnerId}
          latestMessage={latestMessage}
          username={username}
          players={players}
          setIsLoading={setIsLoading}
        />

        <div className="absolute left-[calc(100%+8px)] top-0 z-10 h-full">
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
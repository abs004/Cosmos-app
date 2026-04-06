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

  const threadMessages = messages.filter(msg =>
    (msg.senderId === partnerId && (msg.targetId === socket.id || !msg.targetId)) ||
    (msg.senderId === socket.id && msg.targetId === partnerId)
  );

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
    <div className="w-80 h-[600px] bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">Direct Message</span>
          <h2 className="text-white font-black tracking-tight text-lg leading-tight uppercase truncate max-w-[180px]">
            {getSenderName(partnerId)}
          </h2>
        </div>
        <button
          onClick={() => setPartnerId(null)}
          className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {otherConversations.length > 0 && (
        <div className="mb-4 animate-in slide-in-from-top-2 duration-300">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Recent Chats</p>
          <div className="flex gap-2 flex-wrap max-h-20 overflow-y-auto no-scrollbar">
            {otherConversations.map(id => (
              <button
                key={id}
                onClick={() => setPartnerId(id)}
                className="bg-slate-800/50 hover:bg-slate-700 text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-slate-700/50 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                {players[id]?.name || "User"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 bg-slate-950/50 border border-slate-800/50 rounded-2xl p-4 overflow-y-auto space-y-4 no-scrollbar scroll-smooth">
        {threadMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-xs font-bold uppercase tracking-wider">No messages yet</p>
          </div>
        ) : (
          threadMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.senderId === socket.id ? "items-end" : "items-start"}`}
            >
              <span className={`text-[9px] font-black uppercase tracking-widest mb-1 opacity-50 ${msg.senderId === socket.id ? "text-blue-400" : "text-emerald-400"}`}>
                {getSenderName(msg.senderId)}
              </span>
              <div className={`max-w-[90%] px-4 py-2 text-sm font-medium leading-relaxed shadow-sm ${msg.senderId === socket.id
                ? "bg-blue-600 text-white rounded-2xl rounded-tr-none"
                : "bg-slate-800 text-slate-100 rounded-2xl rounded-tl-none"
                }`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 space-y-3">
        <input
          type="text"
          value={message}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="TYPE A MESSAGE..."
          className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-bold px-4 py-4 rounded-xl placeholder-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all uppercase tracking-tighter"
        />

        <button
          onClick={handleSend}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Send</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

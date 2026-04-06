import { useState } from "react";
import { createAvatar } from "@dicebear/core";
import * as adventurer from "@dicebear/adventurer";

export default function JoinScreen({ onJoin }) {
  const [username, setUsername] = useState("");
  const [selectedSeed, setSelectedSeed] = useState(() => Math.random().toString(36).substring(7));

  const handleJoin = () => {
    if (!username.trim()) return;
    onJoin(username, selectedSeed);
  };

  const handleShuffle = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setSelectedSeed(randomSeed);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50 p-4 font-sans">
      <div className="w-full max-w-sm p-8 flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-300 bg-slate-900/90 border border-slate-700 rounded-3xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-1 uppercase italic text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-600 leading-tight">Cosmos</h1>
          <p className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase">Connect to the Community</p>
        </div>

        <div className="relative group flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full border-4 border-blue-500/30 overflow-hidden bg-slate-950 shadow-[0_0_50px_rgba(59,130,246,0.15)] transition-all duration-300 group-hover:scale-105 group-hover:border-blue-400/50 relative">
            <div
              className="w-full h-full scale-125"
              dangerouslySetInnerHTML={{
                __html: createAvatar(adventurer, { seed: selectedSeed }).toString()
              }}
            />
          </div>

          <button
            onClick={handleShuffle}
            className="absolute -bottom-2 -right-2 bg-gradient-to-br from-indigo-500 to-blue-600 p-3 rounded-2xl shadow-xl border-4 border-slate-900 hover:rotate-12 transition-transform hover:scale-110 active:scale-95 group/dice"
            title="Shuffle Avatar"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="w-full space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Nickname</label>
            <input
              type="text"
              placeholder="ENTER NICKNAME"
              value={username}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all font-bold tracking-tight text-center text-lg"
            />
          </div>

          <button
            onClick={handleJoin}
            className="w-full py-5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-blue-900/40 transform active:scale-[0.97] transition-all flex items-center justify-center gap-3"
          >
            <span>Join Cosmos</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

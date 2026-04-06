import { useState, useEffect } from "react";
import { createAvatar } from "@dicebear/core";
import * as adventurer from "@dicebear/adventurer";

const AVATAR_SEEDS = [
  "Jasper", "Willow", "Alexander", "Milo", "Luna", "Oliver", "Felix", "Aria", "Leo"
];

export default function JoinScreen({ onJoin }) {
  const [username, setUsername] = useState("");
  const [selectedSeed, setSelectedSeed] = useState(AVATAR_SEEDS[0]);

  const handleJoin = () => {
    if (!username.trim()) return;
    onJoin(username, selectedSeed);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50 p-4 font-sans">
      <div className="w-full max-w-sm p-8 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300 bg-slate-900/90 border border-slate-700 rounded-3xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-1 uppercase italic text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-600 leading-tight">Cosmos</h1>
          <p className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase">Connect to the Community</p>
        </div>

        {/* Input */}
        <div className="w-full space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Nickname</label>
          <input
            type="text"
            placeholder="ENTER NICKNAME"
            value={username}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-5 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all font-bold tracking-tight"
          />
        </div>

        {/* Avatar Grid */}
        <div className="w-full space-y-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Select Avatar</label>
          <div className="grid grid-cols-3 gap-3 p-2 bg-slate-950/50 border border-slate-800/50 rounded-2xl">
            {AVATAR_SEEDS.map((seed) => (
              <button
                key={seed}
                onClick={() => setSelectedSeed(seed)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 transform active:scale-90 ${selectedSeed === seed
                  ? "border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  : "border-transparent bg-slate-900/50 hover:bg-slate-800"
                  }`}
              >
                <div
                  className="w-full h-full scale-125"
                  dangerouslySetInnerHTML={{
                    __html: createAvatar(adventurer, { seed }).toString()
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleJoin}
          className="w-full py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-blue-900/40 transform active:scale-[0.97] transition-all flex items-center justify-center gap-3 mt-2"
        >
          <span>Join Cosmos</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
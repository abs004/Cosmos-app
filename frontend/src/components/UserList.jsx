import { createAvatar } from "@dicebear/core";
import * as adventurer from "@dicebear/adventurer";

export default function UserList({ players }) {
    const playerList = Object.values(players);

    return (
        <div className="w-56 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl p-5 font-sans animate-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Online Users</h2>
                <span className="ml-auto text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md">
                    {playerList.length}
                </span>
            </div>

            <ul className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                {playerList.length === 0 ? (
                    <li className="text-slate-600 text-[10px] uppercase font-bold py-2 text-center tracking-wider italic">No users online</li>
                ) : (
                    playerList.map((player) => (
                        <li
                            key={player.id}
                            className="flex items-center gap-3 group cursor-pointer hover:translate-x-1 transition-transform"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-500/50 shadow-inner">
                                <div
                                    className="w-full h-full scale-110"
                                    dangerouslySetInnerHTML={{
                                        __html: createAvatar(adventurer, { seed: player.avatarSeed || player.name || "default" }).toString()
                                    }}
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white text-xs font-bold tracking-tight group-hover:text-blue-400 transition-colors">
                                    {player.name}
                                </span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Active</span>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

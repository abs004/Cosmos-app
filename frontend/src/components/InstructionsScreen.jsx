export default function InstructionsScreen({ onStart }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-xl z-[60] p-4 font-sans">
            <div className="w-full max-w-lg p-10 flex flex-col items-center gap-10 animate-in fade-in zoom-in duration-500 bg-slate-950 border border-slate-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

                <div className="text-center space-y-2">
                    <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2">Navigation Guide</h2>
                    <h1 className="text-3xl font-black text-white tracking-tight leading-none uppercase">Getting Started</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div className="flex flex-col items-center gap-4 p-6 bg-slate-900/50 rounded-3xl border border-white/5 group hover:border-blue-500/30 transition-colors">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex gap-2">
                                <kbd className="w-10 h-10 flex items-center justify-center bg-slate-800 border-b-4 border-slate-600 rounded-lg text-white font-bold group-hover:border-blue-600 transition-colors">W</kbd>
                            </div>
                            <div className="flex gap-2">
                                <kbd className="w-10 h-10 flex items-center justify-center bg-slate-800 border-b-4 border-slate-600 rounded-lg text-white font-bold group-hover:border-blue-600 transition-colors">A</kbd>
                                <kbd className="w-10 h-10 flex items-center justify-center bg-slate-800 border-b-4 border-slate-600 rounded-lg text-white font-bold group-hover:border-blue-600 transition-colors">S</kbd>
                                <kbd className="w-10 h-10 flex items-center justify-center bg-slate-800 border-b-4 border-slate-600 rounded-lg text-white font-bold group-hover:border-blue-600 transition-colors">D</kbd>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-white font-bold text-sm uppercase tracking-wider">Movement</p>
                            <p className="text-slate-500 text-[10px] uppercase font-medium mt-1">Use WASD or Arrow Keys</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 p-6 bg-slate-900/50 rounded-3xl border border-white/5 group hover:border-blue-500/30 transition-colors">
                        <div className="h-20 flex items-center justify-center">
                            <kbd className="w-14 h-14 flex items-center justify-center bg-slate-800 border-b-4 border-slate-600 rounded-xl text-white text-xl font-black group-hover:border-blue-600 transition-colors">E</kbd>
                        </div>
                        <div className="text-center">
                            <p className="text-white font-bold text-sm uppercase tracking-wider">Interaction</p>
                            <p className="text-slate-500 text-[10px] uppercase font-medium mt-1">Press E to Chat with Users</p>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center gap-6">
                    <div className="h-px w-24 bg-slate-800" />
                    <button
                        onClick={onStart}
                        className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transform active:scale-[0.97] transition-all flex items-center justify-center gap-3"
                    >
                        <span>Enter Cosmos</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

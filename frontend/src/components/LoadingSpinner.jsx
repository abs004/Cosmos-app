export default function LoadingSpinner() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md font-sans">
            <div className="relative w-24 h-24">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                {/* Spinner Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                {/* Inner Pulsing Core */}
                <div className="absolute inset-4 rounded-full bg-blue-500/10 animate-pulse flex items-center justify-center border border-blue-500/20">
                    <svg className="w-6 h-6 text-blue-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            </div>

            <div className="mt-8 text-center space-y-2">
                <h3 className="text-white font-black uppercase tracking-[0.3em] text-sm italic">Loading</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">Connecting to server...</p>
            </div>
        </div>
    );
}

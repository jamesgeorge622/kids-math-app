
export const MeasuringCupVisual = ({ question }: { question: any }) => {
    const { level, unit, max, liquidColor = 'bg-blue-400' } = question.visual;
    const fillPercent = (level / max) * 100;

    return (
        <div className="flex flex-col items-center mb-8">
            <div className="relative w-40 h-56 mt-4">
                {/* Glass Container */}
                <div className="absolute inset-x-0 bottom-0 top-0 border-4 border-gray-300 rounded-b-3xl rounded-t-lg bg-white/30 backdrop-blur-sm shadow-xl overflow-hidden z-20">
                    {/* Measurement Lines (Ticks) */}
                    {[...Array(5)].map((_, i) => {
                        const tickVal = Math.round((max / 4) * (i + 0)); // 0, 25, 50, 75, 100% basically
                        const tickHeight = (i / 4) * 100;
                        if (i === 0) return null; // Skip 0 line
                        return (
                            <div key={i} className="absolute w-full border-t border-gray-400/50 flex items-center px-2" style={{ bottom: `${tickHeight}%` }}>
                                <span className="text-xs font-bold text-gray-500 bg-white/80 px-1 rounded absolute right-2 -top-2">{tickVal}{unit}</span>
                            </div>
                        )
                    })}
                </div>

                {/* Handle */}
                <div className="absolute -right-8 top-12 w-8 h-24 border-4 border-gray-300 rounded-r-2xl border-l-0 z-10"></div>

                {/* Liquid */}
                <div className="absolute inset-x-1 bottom-1 rounded-b-[1.3rem] overflow-hidden z-10 h-[calc(100%-8px)] flex items-end">
                    <div
                        className={`w-full transition-all duration-1000 ease-out relative ${liquidColor} opacity-80`}
                        style={{ height: `${fillPercent}%` }}
                    >
                        {/* Bubbles / Surface */}
                        <div className="absolute top-0 w-full h-2 bg-white/30 animate-pulse"></div>
                        <div className="absolute top-[-4px] w-full h-4 bg-white/10 rounded-full"></div>
                    </div>
                </div>
            </div>

            <div className="mt-4 bg-indigo-50 px-6 py-2 rounded-full text-indigo-900 font-bold border border-indigo-100">
                Level: <span className="text-indigo-600 text-xl">?</span>
            </div>
        </div>
    );
};

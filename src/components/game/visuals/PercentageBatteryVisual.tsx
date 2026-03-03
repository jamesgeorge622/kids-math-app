import { useState, useEffect } from 'react';

export const PercentageBatteryVisual = ({ data }: { data: { percent: number; total?: number; filled?: boolean } }) => {
    const { percent, total = 100 } = data;
    const [fillLevel, setFillLevel] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);

    // Determines how many segments to slice the battery into for visual aid
    const getSegments = (p: number) => {
        if (p % 10 === 0 && p !== 50) return 10; // 10%, 20%, 30% -> 10 slice preference
        if (p === 25 || p === 75) return 4;
        if (p === 50) return 2;
        return 4; // Default quarters
    }

    const segments = getSegments(percent);

    // Animation to charge the battery on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setFillLevel(percent);
        }, 500);
        return () => clearTimeout(timer);
    }, [percent]);

    const getColor = (p: number) => {
        if (p <= 20) return 'bg-red-500';
        if (p <= 50) return 'bg-yellow-400';
        return 'bg-green-500';
    };

    const colorClass = getColor(percent);

    return (
        <div className="flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
            <div className="flex items-stretch gap-8">

                {/* Left Scale: Percentages */}
                <div className="flex flex-col justify-between py-2 text-gray-400 font-mono text-sm sm:text-base text-right h-64 sm:h-80 select-none">
                    <div className="relative">
                        <span className="absolute right-0 -top-3">100%</span>
                        <div className="w-4 h-0.5 bg-gray-300 absolute right-[-24px] top-0"></div>
                    </div>
                    {[...Array(segments - 1)].map((_, i) => {
                        const val = Math.round(100 - ((i + 1) * (100 / segments)));
                        return (
                            <div key={i} className="relative h-0 flex items-center justify-end">
                                {/* Only label major points to avoid clutter, e.g. 50% */}
                                {(segments === 2 || segments === 4) && (
                                    <span className="absolute right-0 -top-3 text-xs">{val}%</span>
                                )}
                                <div className="w-2 h-0.5 bg-gray-200 absolute right-[-24px] top-0"></div>
                            </div>
                        )
                    })}
                    <div className="relative">
                        <span className="absolute right-0 -top-3">0%</span>
                        <div className="w-4 h-0.5 bg-gray-300 absolute right-[-24px] top-0"></div>
                    </div>
                </div>

                {/* Battery Body */}
                <div className="relative w-24 sm:w-32 h-64 sm:h-80 border-8 border-gray-700 rounded-3xl p-2 bg-white flex flex-col justify-end shadow-2xl z-10">
                    {/* Battery Cap */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-4 bg-gray-700 rounded-t-lg" />

                    {/* Liquid Fill */}
                    <div
                        className={`w-full rounded-xl transition-all duration-[2000ms] ease-out ${colorClass} relative overflow-hidden`}
                        style={{ height: `${fillLevel}%` }}
                    >
                        {/* Bubbles/Shine Effect */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-white/30 rounded-full" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    {/* Grid Lines Overlay - Dynamic Slicing */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-evenly py-2 px-0">
                        {/* We need (segments - 1) lines */}
                        {[...Array(segments - 1)].map((_, i) => (
                            <div key={i} className="w-full h-0.5 bg-white/50 border-b-2 border-dashed border-gray-400/50" />
                        ))}
                    </div>
                </div>

                {/* Right Scale: Values */}
                <div className="flex flex-col justify-between py-2 text-indigo-600 font-bold font-mono text-sm sm:text-base text-left h-64 sm:h-80 select-none">
                    <div className="relative">
                        <div className="w-4 h-0.5 bg-indigo-200 absolute left-[-24px] top-0"></div>
                        <span className="absolute left-0 -top-3">{total}</span>
                    </div>

                    {/* Dynamic dividers on right scale based on segments */}
                    {[...Array(segments - 1)].map((_, i) => (
                        <div key={i} className="relative h-full flex items-center">
                            <div className="w-2 h-0.5 bg-indigo-100 absolute left-[-24px] top-0"></div>
                        </div>
                    ))}

                    <div className="relative">
                        <div className="w-4 h-0.5 bg-indigo-200 absolute left-[-24px] top-0"></div>
                        <span className="absolute left-0 -top-3">0</span>
                    </div>
                </div>

            </div>

            {/* Dynamic Hint based on Strategy */}
            <div className={`mt-4 w-full max-w-xs transition-opacity duration-1000 ${fillLevel > 0 ? 'opacity-100' : 'opacity-0'}`}>
                {/* Strategy Prompt */}
                <div className="bg-indigo-50 px-6 py-2 rounded-xl border border-indigo-100 shadow-sm text-center mb-2">
                    <div className="text-gray-500 text-sm font-medium mb-1">Strategy:</div>
                    <div className="text-indigo-800 font-bold">
                        {segments === 10 ? `Split ${total} into 10 parts?` :
                            segments === 4 ? `Split ${total} into 4 parts?` :
                                segments === 2 ? `Split ${total} in half?` : `Find the value!`}
                    </div>
                </div>

                {/* Explanation Toggle */}
                <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="w-full bg-white/50 border border-indigo-200 text-indigo-600 font-semibold text-sm py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all flex items-center justify-center gap-2"
                >
                    <span>{showExplanation ? 'Hide Steps' : '💡 How to solve?'}</span>
                </button>

                {/* Step-by-Step Explanation */}
                {showExplanation && (
                    <div className="mt-2 bg-white rounded-xl p-4 shadow-lg border border-indigo-100 text-left text-sm animate-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <span className="bg-gray-100 font-bold text-gray-600 px-1.5 rounded h-fit">1</span>
                                <span className="text-gray-700">The full battery is <strong>{total}</strong>.</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="bg-gray-100 font-bold text-gray-600 px-1.5 rounded h-fit">2</span>
                                <span className="text-gray-700">
                                    {percent}% means we split into <strong>{segments}</strong> blocks.
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <span className="bg-indigo-100 font-bold text-indigo-600 px-1.5 rounded h-fit">3</span>
                                <span className="text-gray-700">
                                    One block = {total} ÷ {segments} = <strong>{total / segments}</strong>.
                                </span>
                            </div>
                            {(percent / (100 / segments)) > 1 && (
                                <div className="flex gap-2">
                                    <span className="bg-green-100 font-bold text-green-600 px-1.5 rounded h-fit">4</span>
                                    <span className="text-gray-700">
                                        We need {percent / (100 / segments)} blocks. <br />
                                        {percent / (100 / segments)} x {total / segments} = <strong>{total * (percent / 100)}</strong>.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

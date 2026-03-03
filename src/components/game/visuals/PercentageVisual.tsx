

export const PercentageVisual = ({ question }: { question: any }) => {
    const { percent } = question.visual;

    return (
        <div className="flex flex-col items-center mb-8">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-64 h-64 bg-white border-4 border-blue-200 rounded-xl grid grid-cols-10 grid-rows-10 p-1 shadow-inner">
                        {Array.from({ length: 100 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-full h-full border-[0.5px] border-blue-50 rounded-sm transition-all duration-500
                                    ${i < percent
                                        ? 'bg-blue-500 scale-95'
                                        : 'bg-transparent'
                                    }`}
                            />
                        ))}
                    </div>
                    {/* Percentage Label Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-6xl font-black text-blue-600 drop-shadow-lg bg-white/80 px-4 py-2 rounded-xl backdrop-blur-sm border-2 border-blue-100">
                            {percent}%
                        </span>
                    </div>
                </div>

                <div className="mt-4 text-gray-500 font-medium text-lg text-center">
                    <span className="text-blue-500 font-bold">{percent}</span> out of <span className="font-bold">100</span> squares are blue
                </div>
            </div>
        </div>
    );
};

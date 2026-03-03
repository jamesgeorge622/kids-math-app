

export const WordProblemVisual = ({ question }: { question: any }) => {
    const { start, amount, action, total, groups, day1, day2, item } = question.visual;
    const emoji = item || '⭐️';

    // 1. Subtraction: "Gave away"
    if (action === 'gave away' && start !== undefined && amount !== undefined) {
        return (
            <div className="flex flex-col items-center mb-8">
                <div className="flex flex-wrap justify-center gap-4 max-w-md">
                    {Array.from({ length: start }).map((_, i) => {
                        // The last 'amount' items are the ones given away
                        const isGivenAway = i >= (start - amount);
                        return (
                            <div key={i} className="relative text-5xl transition-all duration-500">
                                <span className={isGivenAway ? "opacity-40 grayscale" : ""}>{emoji}</span>
                                {isGivenAway && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-1 bg-red-500 transform rotate-45" />
                                        <div className="w-full h-1 bg-red-500 transform -rotate-45" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 text-gray-500 font-medium">
                    {start} {emoji} - {amount} {emoji} given away
                </div>
            </div>
        );
    }

    // 2. Addition: "Got" (more)
    if (action === 'got' && start !== undefined && amount !== undefined) {
        return (
            <div className="flex flex-col items-center mb-8">
                <div className="flex items-center gap-4">
                    {/* Start Items */}
                    <div className="flex flex-wrap justify-center gap-2 max-w-[150px] p-2 bg-blue-50 rounded-lg border border-blue-100">
                        {Array.from({ length: start }).map((_, i) => (
                            <div key={`start-${i}`} className="text-4xl">{emoji}</div>
                        ))}
                    </div>

                    <div className="text-3xl font-bold text-gray-400">+</div>

                    {/* Additional Items */}
                    <div className="flex flex-wrap justify-center gap-2 max-w-[150px] p-2 bg-green-50 rounded-lg border border-green-100 relative">
                        {Array.from({ length: amount }).map((_, i) => (
                            <div key={`more-${i}`} className="text-4xl animate-bounce-subtle" style={{ animationDelay: `${i * 100}ms` }}>{emoji}</div>
                        ))}
                        <span className="absolute -top-3 -right-3 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">New!</span>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Division: "Share equally"
    if (action === 'share equally' && total !== undefined && groups !== undefined) {
        const perGroup = Math.floor(total / groups);
        return (
            <div className="flex flex-col items-center mb-8">
                {/* Groups */}
                <div className="flex flex-wrap justify-center gap-6">
                    {Array.from({ length: groups }).map((_, gIndex) => (
                        <div key={gIndex} className="flex flex-col items-center">
                            <div className="bg-gray-100 rounded-2xl p-3 grid grid-cols-2 gap-1 border-2 border-gray-200 min-w-[80px] min-h-[80px] items-center justify-items-center">
                                {Array.from({ length: perGroup }).map((_, i) => (
                                    <div key={i} className="text-2xl">{emoji}</div>
                                ))}
                            </div>
                            <span className="text-sm text-gray-400 font-bold mt-2">Friend {gIndex + 1}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // 4. Addition: "Total" (Day 1 + Day 2)
    if (action === 'total' && day1 !== undefined && day2 !== undefined) {
        return (
            <div className="flex flex-col items-center mb-8">
                <div className="flex items-end gap-2">
                    {/* Stacked visualization maybe? Or just side by side */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-bold text-gray-400">Day 1</span>
                        <div className="flex flex-wrap justify-center gap-2 max-w-[120px]">
                            {Array.from({ length: day1 }).map((_, i) => <div key={i} className="text-3xl">{emoji}</div>)}
                        </div>
                    </div>

                    <div className="h-16 w-px bg-gray-300 mx-2" />

                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-bold text-gray-400">Day 2</span>
                        <div className="flex flex-wrap justify-center gap-2 max-w-[120px]">
                            {Array.from({ length: day2 }).map((_, i) => <div key={i} className="text-3xl">{emoji}</div>)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

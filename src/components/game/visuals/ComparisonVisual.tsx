

export const ComparisonVisual = ({ question }: { question: any }) => {
    // Contract: visual.kind === 'twoGroups'
    // Fallback support for legacy groupA/groupB or left/right props
    const left = question.visual.left || question.visual.groupA;
    const right = question.visual.right || question.visual.groupB;

    if (left && right) {
        return (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 mb-8">
                {/* Group A */}
                <div className="flex-1 min-w-[200px] p-6 bg-blue-50 rounded-2xl border-4 border-blue-200 text-center relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full font-bold text-sm uppercase tracking-wider shadow-sm">
                        Group A
                    </div>
                    <div className="mt-2 flex flex-wrap justify-center gap-2">
                        {Array.isArray(left) ? (
                            left.length > 15 ? (
                                <>
                                    {left.slice(0, 10).map((item: any, i: number) => (
                                        <div key={i} className="text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>{item}</div>
                                    ))}
                                    <div className="text-2xl font-bold text-blue-400 self-center">+{left.length - 10}</div>
                                </>
                            ) : (
                                left.map((item: any, i: number) => (
                                    <div key={i} className="text-4xl transform hover:scale-125 transition-transform cursor-pointer">{item}</div>
                                ))
                            )
                        ) : (
                            <div className="text-6xl font-bold text-blue-500">{left}</div>
                        )}
                    </div>
                </div>

                <div className="text-4xl font-black text-gray-300">VS</div>

                {/* Group B */}
                <div className="flex-1 min-w-[200px] p-6 bg-purple-50 rounded-2xl border-4 border-purple-200 text-center relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full font-bold text-sm uppercase tracking-wider shadow-sm">
                        Group B
                    </div>
                    <div className="mt-2 flex flex-wrap justify-center gap-2">
                        {Array.isArray(right) ? (
                            right.length > 15 ? (
                                <>
                                    {right.slice(0, 10).map((item: any, i: number) => (
                                        <div key={i} className="text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>{item}</div>
                                    ))}
                                    <div className="text-2xl font-bold text-purple-400 self-center">+{right.length - 10}</div>
                                </>
                            ) : (
                                right.map((item: any, i: number) => (
                                    <div key={i} className="text-4xl transform hover:scale-125 transition-transform cursor-pointer">{item}</div>
                                ))
                            )
                        ) : (
                            <div className="text-6xl font-bold text-purple-500">{right}</div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return null;
};

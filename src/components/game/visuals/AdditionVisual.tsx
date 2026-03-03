


export const AdditionVisual = ({ question }: { question: any }) => {
    // 1. Age 10+ Vertical "Long Math" Mode
    if (question.visual.kind === 'verticalMath' || question.visual.isVertical) {
        // Handle both older 'isVertical' flag and new 'verticalMath' kind
        const valA = question.visual.a || question.visual.valA;
        const valB = question.visual.b || question.visual.valB;

        return (
            <div className="flex flex-col items-center mb-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="text-gray-500 mb-4 font-bold uppercase tracking-wider text-sm">Solve using column addition</div>
                <div className="flex flex-col items-end">
                    <div className="font-mono text-6xl font-bold text-gray-800 tracking-widest leading-none text-right px-4">
                        <div>{valA}</div>
                        <div className="relative">
                            <span className="absolute -left-12 text-gray-400">+</span>
                            {valB}
                        </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 my-2 rounded-full" />
                    <div className="text-6xl font-bold text-blue-600 animate-pulse text-center w-full">?</div>
                </div>
            </div>
        );
    }

    if (!question.visual.groupA) return null;

    const countA = question.visual.groupA.length;
    const countB = question.visual.groupB.length;

    // 2. Age 8-9 Base-10 Block Visualization
    if (countA > 10 || countB > 10) {

        const renderBase10 = (count: number) => {
            const tens = Math.floor(count / 10);
            const ones = count % 10;
            return (
                <div className="flex items-end gap-2">
                    {/* Tens Rods */}
                    {tens > 0 && (
                        <div className="flex gap-1">
                            {Array.from({ length: tens }).map((_, i) => (
                                <div key={`ten-${i}`} className="w-4 h-16 bg-blue-500 rounded-sm border border-blue-600 flex flex-col justify-between py-0.5">
                                    {Array.from({ length: 9 }).map((_, j) => (
                                        <div key={j} className="h-px w-full bg-blue-400/50" />
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Ones Cubes */}
                    {ones > 0 && (
                        <div className="grid grid-cols-2 gap-0.5 content-end w-8">
                            {Array.from({ length: ones }).map((_, i) => (
                                <div key={`one-${i}`} className="w-3.5 h-3.5 bg-yellow-400 rounded-sm border border-yellow-500" />
                            ))}
                        </div>
                    )}
                </div>
            );
        };

        return (
            <div className="flex flex-col items-center mb-8 bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
                <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 items-center">
                    {/* First Number */}
                    <div className="text-5xl font-bold text-gray-700 text-right font-mono tracking-widest">{countA}</div>
                    <div className="pl-4">{renderBase10(countA)}</div>

                    {/* Second Number with Plus */}
                    <div className="relative text-5xl font-bold text-gray-700 text-right font-mono tracking-widest flex justify-end items-center gap-4">
                        <span className="absolute -left-8 text-gray-400">+</span>
                        {countB}
                    </div>
                    <div className="pl-4">{renderBase10(countB)}</div>
                </div>

                {/* Divider Line */}
                <div className="w-64 h-1 bg-gray-800 my-4 rounded-full" />

                {/* Question Mark */}
                <div className="text-6xl font-bold text-blue-600 animate-pulse">?</div>
            </div>
        );
    }

    // 3. Fallback to simple dot groups for small numbers (< 10)
    return (
        <div className="flex justify-center items-center gap-6 mb-8">
            <div className="text-center">
                <div className="flex gap-2 flex-wrap justify-center max-w-xs">
                    {question.visual.groupA.map((obj: string, i: number) => (
                        <div key={i} className="text-4xl">{obj}</div>
                    ))}
                </div>
            </div>
            <div className="text-3xl font-bold text-gray-600">+</div>
            <div className="text-center">
                <div className="flex gap-2 flex-wrap justify-center max-w-xs">
                    {question.visual.groupB.map((obj: string, i: number) => (
                        <div key={i} className="text-4xl">{obj}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

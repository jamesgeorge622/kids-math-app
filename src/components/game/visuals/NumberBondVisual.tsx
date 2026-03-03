

export const NumberBondVisual = ({ question }: { question: any }) => {
    if (!question.visual.total) return null;

    return (
        <div className="flex flex-col items-center mb-12 relative">
            {/* Total Circle (Top) */}
            <div className="w-32 h-32 rounded-full border-4 border-purple-500 flex items-center justify-center bg-purple-50 relative z-10 mb-16">
                <div className="flex flex-wrap justify-center gap-1 p-2">
                    {question.visual.total.map((obj: string, i: number) => (
                        <span key={i} className="text-xl">{obj}</span>
                    ))}
                </div>
                {/* Connection Lines */}
                <div className="absolute -bottom-16 left-1/2 w-1 h-16 bg-purple-300 transform -translate-x-1/2 -rotate-45 origin-top"></div>
                <div className="absolute -bottom-16 left-1/2 w-1 h-16 bg-purple-300 transform -translate-x-1/2 rotate-45 origin-top"></div>
            </div>

            {/* Parts Circles (Bottom) */}
            <div className="flex gap-16">
                <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center bg-blue-50 relative z-10">
                    <div className="flex flex-wrap justify-center gap-1 p-2">
                        {question.visual.part1.map((obj: string, i: number) => (
                            <span key={i} className="text-lg">{obj}</span>
                        ))}
                    </div>
                </div>

                <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center bg-blue-50 relative z-10">
                    {typeof question.visual.part2 === 'number' ? (
                        <span className="text-4xl text-blue-300 font-bold">?</span>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-1 p-2">
                            {/* If it was an array it would render here */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

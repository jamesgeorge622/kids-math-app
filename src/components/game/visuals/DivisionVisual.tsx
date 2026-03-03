

export const DivisionVisual = ({ question }: { question: any }) => {
    const { total, groups } = question.visual;
    const perGroup = Math.floor(total / groups);

    return (
        <div className="flex flex-col items-center mb-8">
            {/* Groups */}
            <div className="flex flex-wrap justify-center gap-6">
                {Array.from({ length: groups }).map((_, gIndex) => (
                    <div key={gIndex} className="flex flex-col items-center">
                        <div className="bg-blue-50 rounded-2xl p-3 grid grid-cols-2 gap-1 border-2 border-blue-200 min-w-[80px] min-h-[80px] items-center justify-items-center">
                            {Array.from({ length: perGroup }).map((_, i) => (
                                <div key={i} className="text-2xl">🔵</div>
                            ))}
                        </div>
                        <span className="text-sm text-gray-400 font-bold mt-2">Group {gIndex + 1}</span>
                    </div>
                ))}
            </div>
            <div className="mt-6 text-gray-500 font-medium text-lg">
                {total} items ÷ {groups} groups = ?
            </div>
        </div>
    );
};

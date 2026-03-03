

export const SequenceVisual = ({ question }: { question: any }) => {
    const sequence = Array.isArray(question.visual) ? question.visual : [];
    return (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
            {sequence.map((item: string | number, i: number) => {
                const isMissing = item === '?' || item === '__';
                return (
                    <div
                        key={i}
                        className={`
                            w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-sm border-b-4 transition-all
                            ${isMissing
                                ? 'bg-gray-100 border-gray-200 text-gray-400 animate-pulse'
                                : 'bg-white border-blue-200 text-blue-600'
                            }
                        `}
                    >
                        {isMissing ? '?' : item}
                    </div>
                )
            })}
        </div>
    );
};

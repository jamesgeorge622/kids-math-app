

export const DecimalVisual = ({ question }: { question: any }) => {
    const num = parseFloat(question.visual.number);
    const whole = Math.floor(num);
    const fraction = Math.round((num - whole) * 100);

    return (
        <div className="flex flex-col items-center mb-8">
            <div className="flex flex-wrap justify-center gap-4 items-end">
                {/* Whole number blocks */}
                {Array.from({ length: whole }).map((_, i) => (
                    <div key={`whole-${i}`} className="flex flex-col items-center gap-2">
                        <div className="w-24 h-24 bg-blue-500 border-4 border-blue-600 rounded-lg shadow-md flex items-center justify-center">
                            <span className="text-white font-bold text-3xl">1</span>
                        </div>
                        <span className="text-sm font-bold text-gray-400">1.0</span>
                    </div>
                ))}

                {/* Fraction block */}
                {fraction > 0 && (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-24 h-24 border-2 border-gray-300 bg-white grid grid-cols-10 grid-rows-10 p-0.5 rounded-lg shadow-inner">
                            {Array.from({ length: 100 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-full h-full ${i < fraction ? 'bg-blue-400' : 'bg-gray-50'} border-[0.5px] border-white/20`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-bold text-gray-400">0.{fraction}</span>
                    </div>
                )}
            </div>
            <div className="mt-6 text-2xl font-bold tracking-wider text-blue-600">
                {num}
            </div>
        </div>
    );
};

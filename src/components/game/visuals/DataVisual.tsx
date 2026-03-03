

export const DataVisual = ({ question }: { question: any }) => {
    const data = question.visual as Record<string, number>;
    const maxVal = Math.max(...Object.values(data));
    // Ensure scale is at least 5 or slightly larger than max for nice visual headroom
    const scaleMax = maxVal < 5 ? 5 : Math.ceil(maxVal / 2) * 2;

    return (
        <div className="flex items-start justify-center mb-8 w-full max-w-lg mx-auto gap-3">
            {/* Y-Axis */}
            <div className="flex flex-col-reverse justify-between h-64 py-0 text-gray-400 text-sm font-bold text-right w-6">
                {Array.from({ length: scaleMax + 1 }).map((_, i) => (
                    <span key={i} className="leading-none transform translate-y-1/2">{i}</span>
                ))}
            </div>

            {/* Chart Area */}
            <div className="flex-1 flex flex-col">
                {/* Grid & Bars Container */}
                <div className="relative h-64 border-l-2 border-b-2 border-gray-300 w-full bg-white bg-opacity-50 rounded-tr-lg">
                    {/* Grid Lines */}
                    <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col-reverse justify-between pointer-events-none z-0">
                        {Array.from({ length: scaleMax + 1 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-full border-t border-gray-100 ${i === 0 ? 'border-transparent' : 'border-dashed'}`}
                                style={{ height: '0px' }}
                            />
                        ))}
                    </div>

                    {/* Bars */}
                    <div className="absolute inset-0 flex items-end justify-around px-2 z-10">
                        {Object.entries(data).map(([label, value]) => (
                            <div key={label} className="flex flex-col items-center w-full px-1 sm:px-3 h-full justify-end group">
                                <div
                                    className="w-full bg-blue-500 rounded-t-sm sm:rounded-t-md transition-all relative group-hover:bg-blue-600 shadow-sm"
                                    style={{ height: `${(value / scaleMax) * 100}%` }}
                                >
                                    <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 font-bold text-blue-600 bg-white px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        {value}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* X-Axis Labels */}
                <div className="flex justify-around px-2 mt-2">
                    {Object.keys(data).map((label) => (
                        <div key={label} className="flex-1 text-center text-xs sm:text-sm font-bold text-gray-600 capitalize truncate px-1">
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

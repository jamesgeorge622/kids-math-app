

export const MeasurementVisual = ({ question }: { question: any }) => {
    const { unit, type, item } = question.visual;
    const isLength = ['inches', 'feet', 'yards'].includes(unit);
    const isWeight = ['ounces', 'pounds', 'tons'].includes(unit);

    // Object Estimation (e.g., Pencil length)
    // Option 1: Virtual Ruler (Aligned to Scale)
    if (type === 'object') {
        const lengthValue = question.visual.length || 5; // Default if missing
        const rulerMax = 12; // Standard 12-inch/unit ruler
        const widthPercent = (lengthValue / rulerMax) * 100;

        return (
            <div className="flex flex-col items-center mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-indigo-100 max-w-md w-full relative">
                    <div className="flex flex-col items-start gap-0 relative">
                        {/* Object Visual (Aligned) */}
                        <div
                            className="bg-blue-100 rounded-lg flex items-center justify-center text-4xl shadow-sm mb-1 z-10 border border-blue-200 transition-all duration-1000"
                            style={{
                                width: `${widthPercent}%`,
                                height: '3rem',
                                borderTopLeftRadius: '0.5rem',
                                borderBottomLeftRadius: '0.5rem',
                                borderTopRightRadius: '0',
                                borderBottomRightRadius: '0'
                            }}
                        >
                            {item === 'pencil' && '✏️'}
                            {item === 'crayon' && '🖍️'}
                            {item === 'spoon' && '🥄'}
                            {item === 'brush' && '🖌️'}
                            {!['pencil', 'crayon', 'spoon', 'brush'].includes(item || '') && '📏'}
                        </div>

                        {/* Ruler Visual */}
                        <div className="w-full h-12 bg-yellow-300 border-2 border-yellow-500 rounded-md shadow-sm relative flex items-end overflow-hidden">
                            {[...Array(rulerMax + 1)].map((_, i) => (
                                <div key={i} className="absolute h-full flex flex-col justify-end items-center" style={{ left: `${(i / rulerMax) * 100}%` }}>
                                    <div className="w-0.5 h-3 bg-yellow-800/60"></div>
                                    <span className="text-[10px] text-yellow-900 font-bold mb-1 -translate-x-1/2">{i}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 text-center text-gray-500 font-medium">
                        Use the ruler to measure the length!
                    </div>
                </div>
            </div>
        );
    }

    // Conversion Visual (Standard)
    return (
        <div className="flex flex-col items-center mb-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-indigo-100 max-w-md w-full relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 to-purple-400"></div>

                <div className="flex flex-col items-center gap-6">
                    {/* Icon/Graphic Area */}
                    <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-6xl shadow-inner relative">
                        {isLength && <span className="transform -rotate-45">📏</span>}
                        {isWeight && <span>⚖️</span>}
                        {!isLength && !isWeight && <span>📏</span>}

                        {/* Decorative particles */}
                        <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                    </div>

                    {/* Conversion Visual */}
                    <div className="flex items-center gap-4 text-gray-700 font-bold text-xl md:text-2xl">
                        <div className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
                            1 {isLength ? (unit === 'inches' ? 'foot' : unit === 'feet' ? 'yard' : 'unit') : (unit === 'ounces' ? 'pound' : 'unit')}
                        </div>
                        <div className="text-indigo-400 text-3xl">➜</div>
                        <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200 text-indigo-700 flex items-center gap-2">
                            <span className="text-3xl">?</span>
                            <span className="text-lg opacity-70">{unit}</span>
                        </div>
                    </div>

                    {/* Visual Aid (Ruler or Scale hint) */}
                    {isLength && (
                        <div className="w-full h-12 bg-yellow-200 border-2 border-yellow-400 rounded-md relative mt-2 shadow-sm flex items-end overflow-hidden">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="flex-1 h-1/2 border-r border-yellow-500/50 flex justify-end flex-col items-center">
                                    <div className="w-0.5 h-2 bg-yellow-600/30"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

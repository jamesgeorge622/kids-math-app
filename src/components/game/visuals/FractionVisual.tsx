

export const FractionVisual = ({ question }: { question: any }) => {
    // Map new fields to legacy vars or use new ones
    const { theme = 'pizza', numerator, denominator } = question.visual;
    const filled = numerator;
    const total = denominator;

    if (theme === 'pizza') {
        return (
            <div className="flex flex-col items-center mb-8">
                <div className="relative w-64 h-64">
                    {/* Pizza Pan/Crust Background */}
                    <div className="absolute inset-0 rounded-full bg-yellow-600 border-4 border-yellow-700 shadow-xl" />

                    {/* Slices Overlay */}
                    <svg viewBox="0 0 100 100" className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] transform -rotate-90">
                        {Array.from({ length: total }).map((_, i) => {
                            // Calculate slice path
                            const startAngle = (i * 360) / total;
                            const endAngle = ((i + 1) * 360) / total;

                            // Convert polar to cartesian
                            const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
                            const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
                            const x2 = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
                            const y2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);

                            const isFilled = i < filled;
                            const largeArc = 360 / total > 180 ? 1 : 0;

                            // Path command: Move to center, Line to start, Arc to end, Line to center
                            const d = total === 1
                                ? "M 50,50 m -50,0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0" // Full circle special case
                                : `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;

                            return (
                                <g key={i}>
                                    <path
                                        d={d}
                                        fill={isFilled ? '#FCD34D' : '#FEF3C7'} // Cheese vs Dough
                                        stroke="#B45309"
                                        strokeWidth="0.5"
                                        className="transition-all duration-300"
                                    />
                                    {/* Pepperoni on filled slices */}
                                    {isFilled && (
                                        <circle
                                            cx={50 + 30 * Math.cos(((startAngle + endAngle) / 2 * Math.PI) / 180)}
                                            cy={50 + 30 * Math.sin(((startAngle + endAngle) / 2 * Math.PI) / 180)}
                                            r="4"
                                            fill="#EF4444"
                                            opacity="0.8"
                                        />
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                </div>
                {/* Label */}
                <div className="mt-4 bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-sm font-bold border border-yellow-200">
                    Pizza Party!
                </div>
            </div>
        );
    }

    if (theme === 'chocolate') {
        // Determine grid dimensions based on total pieces
        const cols = total <= 4 ? total : Math.ceil(total / 2);

        return (
            <div className="flex flex-col items-center mb-8">
                <div className="bg-yellow-900/10 p-4 rounded-xl">
                    <div
                        className="grid gap-1 bg-yellow-800/20 p-1 rounded-lg"
                        style={{
                            gridTemplateColumns: `repeat(${cols}, 1fr)`
                        }}
                    >
                        {Array.from({ length: total }).map((_, i) => {
                            const isFilled = i < filled;
                            return (
                                <div
                                    key={i}
                                    className={`
                                        w-16 h-24 rounded-md border-2 
                                        flex items-center justify-center relative overflow-hidden shadow-sm
                                        transition-all duration-300
                                        ${isFilled
                                            ? 'bg-amber-900 border-amber-950'
                                            : 'bg-amber-100 border-amber-200 opacity-50'
                                        }
                                    `}
                                >
                                    {isFilled && (
                                        <>
                                            {/* 3D-ish generic chocolate look using inner shadow/highlight */}
                                            <div className="absolute inset-2 border border-amber-800/50 rounded-sm opacity-50" />
                                            <div className="text-amber-950/20 font-bold text-xs select-none">YUM</div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Label */}
                <div className="mt-4 bg-amber-100 text-amber-900 px-4 py-1 rounded-full text-sm font-bold border border-amber-200">
                    Chocolate Bar
                </div>
            </div>
        );
    }

    // Fallback for "old style" string based fractions (or errors)
    if (typeof question.visual === 'string') {
        return (
            <div className="mb-8 text-center text-6xl tracking-widest">
                {question.visual}
            </div>
        );
    }

    return null;
};

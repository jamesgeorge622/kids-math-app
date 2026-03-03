
export const NumberLineVisual = ({ question }: { question: any }) => {
    const { min = 0, max = 20, start = 0, end, hops = [] } = question.visual;
    const range = max - min;

    // Layout
    const width = 600;
    const height = 160; // Increased for arcs
    const paddingX = 40;
    const effectiveWidth = width - (paddingX * 2);
    const step = effectiveWidth / range;
    const baseline = 120;

    const getX = (val: number) => paddingX + (val - min) * step;

    // Calculate arc paths
    let currentPos = start;
    const arcPaths: JSX.Element[] = [];

    hops.forEach((hop: number, index: number) => {
        const nextPos = currentPos + hop;
        const x1 = getX(currentPos);
        const x2 = getX(nextPos);

        // Control point for curve
        const cx = (x1 + x2) / 2;
        const arcHeight = Math.abs(x2 - x1) * 0.5;
        const cy = baseline - Math.min(60, Math.max(30, arcHeight));

        const path = `M ${x1} ${baseline} Q ${cx} ${cy} ${x2} ${baseline}`;

        // Arrow head logic (approximate) - Simplified for SVG
        // Just drawing the curve for now.

        arcPaths.push(
            <g key={`hop-${index}`}>
                <path d={path} fill="none" stroke={hop > 0 ? '#2563EB' : '#EF4444'} strokeWidth="3" strokeDasharray="4" />
                {/* Label */}
                <text x={cx} y={cy - 5} textAnchor="middle" className="text-sm font-bold fill-gray-500">
                    {hop > 0 ? `+${hop}` : hop}
                </text>
                <circle cx={x2} cy={baseline} r="4" fill={hop > 0 ? '#2563EB' : '#EF4444'} />
            </g>
        );

        currentPos = nextPos;
    });

    return (
        <div className="flex flex-col items-center w-full">
            {/* Option 3: Vertical Math (Hybrid Mode) */}
            {question.visual.showVertical && (
                <div className="flex flex-col items-center mb-6 bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                    <div className="text-gray-400 mb-2 text-xs font-bold uppercase tracking-wider">Column Addition</div>
                    <div className="flex flex-col items-end">
                        <div className="font-mono text-5xl font-bold text-gray-800 tracking-widest leading-none text-right px-4">
                            <div>{question.visual.verticalA}</div>
                            <div className="relative">
                                <span className="absolute -left-8 text-gray-400">+</span>
                                {question.visual.verticalB}
                            </div>
                        </div>
                        <div className="w-full h-1 bg-gray-800 my-2 rounded-full" />
                        <div className="text-5xl font-bold text-blue-600 animate-pulse text-center w-full">?</div>
                    </div>
                </div>
            )}

            {/* Option 1: Focused Number Line */}
            <div className="flex justify-center mb-8 overflow-x-auto w-full">
                <div style={{ minWidth: '600px' }}>
                    <svg width={width} height={height} className="w-full">
                        {/* Main Line */}
                        <line x1={paddingX} y1={baseline} x2={width - paddingX} y2={baseline} stroke="#374151" strokeWidth="4" strokeLinecap="round" />

                        {/* Ticks and Labels */}
                        {Array.from({ length: range + 1 }).map((_, i) => {
                            const val = min + i;
                            const x = getX(val);
                            const isStart = val === start;
                            const isEnd = val === end;
                            const isKey = isStart || isEnd;

                            return (
                                <g key={val}>
                                    <line x1={x} y1={baseline - 10} x2={x} y2={baseline + 10} stroke="#4B5563" strokeWidth="2" />
                                    <text x={x} y={baseline + 35} textAnchor="middle"
                                        className={`text-lg ${isKey ? 'font-bold' : ''}`}
                                        fill={isStart ? '#2563EB' : (isEnd ? '#16A34A' : '#4B5563')}
                                    >
                                        {val === end ? '?' : val}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Start Marker */}
                        <circle cx={getX(start)} cy={baseline} r="6" fill="#2563EB" />

                        {/* Arcs */}
                        {arcPaths}
                    </svg>
                </div>
            </div>
            <div className="text-gray-400 text-sm italic">Count the jumps on the number line!</div>
        </div>
    );
};

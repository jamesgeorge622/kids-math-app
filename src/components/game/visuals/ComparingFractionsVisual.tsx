export const ComparingFractionsVisual = ({ data }: { data: { mode: 'circle' | 'bar'; left: { numerator: number; denominator: number }; right: { numerator: number; denominator: number } } }) => {
    const { mode, left, right } = data;

    const renderCircle = (numerator: number, denominator: number, color: string) => {
        // SVG Pie Chart approach for accuracy
        const radius = 50;
        const center = 50;
        const slices = [];
        const angleStep = 360 / denominator;

        for (let i = 0; i < denominator; i++) {
            const startAngle = i * angleStep;
            const endAngle = (i + 1) * angleStep;

            // Convert polar to cartesian (subtract 90 deg to start from top)
            const x1 = center + radius * Math.cos(Math.PI * (startAngle - 90) / 180);
            const y1 = center + radius * Math.sin(Math.PI * (startAngle - 90) / 180);
            const x2 = center + radius * Math.cos(Math.PI * (endAngle - 90) / 180);
            const y2 = center + radius * Math.sin(Math.PI * (endAngle - 90) / 180);

            const isFilled = i < numerator;

            // Large arc flag must be 1 if angle > 180
            const largeArcFlag = angleStep > 180 ? 1 : 0;

            // SVG Path command for a slice
            // M = Move to center
            // L = Line to edge
            // A = Arc to next point
            // Z = Close path
            const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            slices.push(
                <path
                    key={i}
                    d={pathData}
                    fill={isFilled ? color : '#f3f4f6'} // filled vs gray-100
                    stroke="white"
                    strokeWidth="2"
                    className="transition-all duration-300"
                />
            );
        }

        return (
            <div className="flex flex-col items-center gap-2">
                <svg width="120" height="120" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50" fill="#f3f4f6" />
                    {slices}
                </svg>
                <div className="text-xl font-bold font-mono text-gray-700 bg-white px-3 py-1 rounded shadow-sm border border-gray-200">
                    {numerator}/{denominator}
                </div>
            </div>
        );
    };

    const renderBar = (numerator: number, denominator: number, color: string) => {
        return (
            <div className="flex flex-col items-center gap-2 w-32 sm:w-40">
                <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden flex flex-col-reverse relative">
                    {Array.from({ length: denominator }).map((_, i) => (
                        <div
                            key={i}
                            style={{ height: `${100 / denominator}%` }}
                            className={`w-full border-t border-white first:border-t-0 bg-transparent z-10`}
                        />
                    ))}
                    {/* Fill layer */}
                    <div
                        className="absolute bottom-0 w-full transition-all duration-500"
                        style={{ height: `${(numerator / denominator) * 100}%`, backgroundColor: color }}
                    />
                </div>
                <div className="text-xl font-bold font-mono text-gray-700 bg-white px-3 py-1 rounded shadow-sm border border-gray-200">
                    {numerator}/{denominator}
                </div>
            </div>
        );
    };

    // Theme selection based on mode
    const isPizza = mode === 'circle';
    const leftColor = isPizza ? '#ef4444' : '#8b5cf6'; // Red Pizza vs Purple Bar
    const rightColor = isPizza ? '#ef4444' : '#8b5cf6';

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                {isPizza ? 'Which fraction is bigger?' : 'Which bar is fuller?'}
            </div>

            <div className="flex items-center gap-8 sm:gap-16">
                {/* Left Item */}
                <div className="animate-in slide-in-from-left duration-500 fade-in">
                    {mode === 'circle'
                        ? renderCircle(left.numerator, left.denominator, leftColor)
                        : renderBar(left.numerator, left.denominator, leftColor)
                    }
                </div>

                <div className="text-4xl text-gray-300 font-bold">vs</div>

                {/* Right Item */}
                <div className="animate-in slide-in-from-right duration-500 fade-in delay-100">
                    {mode === 'circle'
                        ? renderCircle(right.numerator, right.denominator, rightColor)
                        : renderBar(right.numerator, right.denominator, rightColor)
                    }
                </div>
            </div>
        </div>
    );
};

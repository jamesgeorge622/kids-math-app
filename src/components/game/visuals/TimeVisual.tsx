

export const TimeVisual = ({ question }: { question: any }) => {
    if (question.visual.hour === undefined) return null;

    const { hour, minute } = question.visual;
    const minuteRotation = minute * 6; // 360 / 60 = 6 degrees per minute
    const hourRotation = (hour % 12) * 30 + (minute / 2); // 360 / 12 = 30 deg per hour + 0.5 deg per minute

    return (
        <div className="flex flex-col items-center mb-8">
            <div className="relative w-64 h-64 rounded-full border-8 border-gray-800 bg-white shadow-xl flex items-center justify-center">

                {/* Minute Numbers (Inner Ring) */}
                {[...Array(12)].map((_, i) => {
                    const val = (i + 1) * 5;
                    return (
                        <div
                            key={`min-${i}`}
                            className="absolute text-xs font-bold text-blue-400"
                            style={{
                                transform: `rotate(${(i + 1) * 30}deg) translateY(-60px) rotate(-${(i + 1) * 30}deg)`
                            }}
                        >
                            {val}
                        </div>
                    );
                })}

                {/* Hour Numbers (Outer Ring) */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={`hour-${i}`}
                        className="absolute text-xl font-bold text-gray-700"
                        style={{
                            transform: `rotate(${(i + 1) * 30}deg) translateY(-90px) rotate(-${(i + 1) * 30}deg)`
                        }}
                    >
                        {i + 1}
                    </div>
                ))}

                {/* Ticks for minutes */}
                {[...Array(60)].map((_, i) => (
                    <div
                        key={`tick-${i}`}
                        className={`absolute bg-gray-300 ${i % 5 === 0 ? 'w-1 h-3' : 'w-0.5 h-1.5'}`}
                        style={{
                            top: '4px',
                            transformOrigin: '50% 120px', // Center of clock relative to top edge
                            transform: `rotate(${i * 6}deg)`
                        }}
                    />
                ))}

                {/* Hour Hand */}
                <div
                    className="absolute w-2 h-16 bg-black rounded-full origin-bottom"
                    style={{
                        bottom: '50%',
                        left: 'calc(50% - 4px)',
                        transform: `rotate(${hourRotation}deg)`
                    }}
                />

                {/* Minute Hand */}
                <div
                    className="absolute w-1.5 h-24 bg-blue-500 rounded-full origin-bottom"
                    style={{
                        bottom: '50%',
                        left: 'calc(50% - 3px)',
                        transform: `rotate(${minuteRotation}deg)`
                    }}
                />

                {/* Center Dot */}
                <div className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white z-10" />
            </div>
        </div>
    );
};

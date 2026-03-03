import { useState } from 'react';

// Strict Type Definition matching the generator
interface SeriesItem {
    id: string;
    label: string;
    value: number;
    color: string;
    icon: string;
}

interface GraphData {
    kind: 'barGraph';
    title: string;
    yAxis: { min: number; max: number; step: number };
    series: SeriesItem[];
}

export const BarGraphVisual = ({ data }: { data: GraphData }) => {
    const { yAxis, series } = data;
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    // Canvas Dimensions
    const width = 500;
    const height = 350;
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };

    // Plot Dimensions
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // Scales
    const barWidth = 60;
    const gap = (plotWidth - (series.length * barWidth)) / (series.length + 1);

    const getY = (val: number) => {
        return plotHeight - (val / yAxis.max) * plotHeight;
    };

    // Grid Lines
    const gridLines = [];
    for (let i = 0; i <= yAxis.max; i += yAxis.step) {
        gridLines.push(i);
    }

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border-4 border-indigo-100 p-2 w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">

                    {/* Background Grid */}
                    <g transform={`translate(${margin.left}, ${margin.top})`}>
                        {gridLines.map((val) => {
                            const y = getY(val);
                            return (
                                <g key={val}>
                                    <line
                                        x1={0} y1={y} x2={plotWidth} y2={y}
                                        stroke="#E5E7EB"
                                        strokeWidth="2"
                                        strokeDasharray="4 4"
                                    />
                                    <text
                                        x={-15} y={y + 5}
                                        textAnchor="end"
                                        className="text-gray-400 font-bold text-sm fill-current"
                                        style={{ fontSize: '14px', fill: '#6B7280' }}
                                    >
                                        {val}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Axes */}
                        <line x1={0} y1={0} x2={0} y2={plotHeight} stroke="#9CA3AF" strokeWidth="2" />
                        <line x1={0} y1={plotHeight} x2={plotWidth} y2={plotHeight} stroke="#9CA3AF" strokeWidth="2" />

                        {/* Bars */}
                        {series.map((item, index) => {
                            const x = gap + index * (barWidth + gap);
                            const barHeight = (item.value / yAxis.max) * plotHeight;
                            const y = plotHeight - barHeight;

                            return (
                                <g
                                    key={item.id}
                                    className="cursor-pointer group"
                                    onMouseEnter={() => setHoverValue(item.value)}
                                    onMouseLeave={() => setHoverValue(null)}
                                >
                                    {/* The Bar */}
                                    <rect
                                        x={x}
                                        y={y}
                                        width={barWidth}
                                        height={barHeight}
                                        fill={item.color}
                                        rx={4}
                                        className="transition-all duration-300 hover:opacity-80"
                                    />

                                    {/* Icon Label (Bottom) */}
                                    <text
                                        x={x + barWidth / 2}
                                        y={plotHeight + 30}
                                        textAnchor="middle"
                                        style={{ fontSize: '24px' }}
                                    >
                                        {item.icon}
                                    </text>

                                    {/* Text Label */}
                                    <text
                                        x={x + barWidth / 2}
                                        y={plotHeight + 50}
                                        textAnchor="middle"
                                        className="fill-gray-500 font-medium"
                                        style={{ fontSize: '12px', fill: '#6B7280' }}
                                    >
                                        {item.label}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Interactive Guideline (shows on hover) */}
                        {hoverValue !== null && (
                            <line
                                x1={0}
                                y1={getY(hoverValue)}
                                x2={plotWidth}
                                y2={getY(hoverValue)}
                                stroke="#4F46E5"
                                strokeWidth="2"
                                strokeDasharray="4"
                                className="animate-pulse"
                            />
                        )}
                    </g>
                </svg>
            </div>

            <p className="mt-4 text-gray-500 text-sm font-medium">
                Tap a bar or follow the line to check the number!
            </p>
        </div>
    );
};

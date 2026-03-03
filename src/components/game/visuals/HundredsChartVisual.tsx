
import React from 'react';

interface HundredsChartVisualProps {
    question: {
        visual: {
            start: number;
            add: number;
        };
    };
}

export const HundredsChartVisual: React.FC<HundredsChartVisualProps> = ({ question }) => {
    const { start, add } = question.visual;
    const answer = start + add;

    // Standard 1-100 chart
    const numbers = Array.from({ length: 100 }, (_, i) => i + 1);

    // Calculate path for visual hints (Down for tens, Right for ones)
    const hints: number[] = [];
    const tens = Math.floor(add / 10);
    const ones = add % 10;

    // Add tens path
    let current = start;
    for (let i = 0; i < tens; i++) {
        current += 10;
        if (current !== answer) hints.push(current);
    }
    // Add ones path
    for (let i = 0; i < ones; i++) {
        current += 1;
        if (current !== answer) hints.push(current);
    }

    return (
        <div className="flex flex-col items-center w-full">
            {/* Header: Vertical Math */}
            <div className="flex flex-col items-center mb-6 bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                <div className="text-gray-400 mb-2 text-xs font-bold uppercase tracking-wider">Column Addition</div>
                <div className="flex flex-col items-end">
                    <div className="font-mono text-5xl font-bold text-gray-800 tracking-widest leading-none text-right px-4">
                        <div>{start}</div>
                        <div className="relative">
                            <span className="absolute -left-8 text-gray-400">+</span>
                            {add}
                        </div>
                    </div>
                    <div className="w-full h-1 bg-gray-800 my-2 rounded-full" />
                    <div className="text-5xl font-bold text-blue-600 animate-pulse text-center w-full">?</div>
                </div>
            </div>

            {/* Hundreds Chart */}
            <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-slate-200">
                <div className="grid grid-cols-10 gap-1 sm:gap-2">
                    {numbers.map((num) => {
                        const isStart = num === start;
                        const isAnswer = num === answer;
                        const isHint = hints.includes(num);

                        let bgClass = "bg-slate-50";
                        let textClass = "text-slate-400";

                        if (isStart) {
                            bgClass = "bg-blue-500 shadow-md transform scale-110 z-10";
                            textClass = "text-white font-bold";
                        } else if (isAnswer) {
                            bgClass = "bg-green-500 shadow-md transform scale-110 z-10 animate-pulse";
                            textClass = "text-white font-bold";
                        } else if (isHint) {
                            bgClass = "bg-blue-100";
                            textClass = "text-blue-800 font-medium";
                        } else {
                            // Default styling for other numbers
                            // Make them visible but subtle
                            bgClass = "bg-white border border-slate-100";
                            textClass = "text-slate-500";
                        }

                        return (
                            <div
                                key={num}
                                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-sm sm:text-base transition-all ${bgClass} ${textClass}`}
                            >
                                {isAnswer ? '?' : num}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 text-center text-gray-500 text-sm">
                Start at <span className="font-bold text-blue-600">{start}</span> and add <span className="font-bold">{add}</span>!
                <br />
                <span className="text-xs text-gray-400">(Move down for tens, right for ones)</span>
            </div>
        </div>
    );
};


import { useState } from 'react';

const VerticalMathView = ({ a, b }: { a: number, b: number }) => {
    const onesA = a % 10;
    const onesB = b % 10;
    const tensA = Math.floor(a / 10);
    const tensB = Math.floor(b / 10);
    const needsBorrow = onesA < onesB;

    return (
        <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-sm border border-indigo-100 min-h-[300px] justify-center">
            <div className="relative font-mono text-6xl font-bold text-gray-800 tracking-widest leading-none text-right px-8">
                {/* Tens Column */}
                <div className="absolute top-0 bottom-0 left-0 w-1/2 border-r border-dashed border-gray-100" />

                {/* Top Number (Minuend) */}
                <div className="mb-4 relative">
                    {/* Tens Digit */}
                    <span className="relative inline-block mr-4">
                        {needsBorrow ? (
                            <>
                                <span className="opacity-30 relative">
                                    {tensA}
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-1 bg-red-500 transform rotate-12" />
                                    </span>
                                </span>
                                <span className="absolute -top-8 left-0 text-3xl text-indigo-600 font-bold bg-indigo-50 px-2 rounded-md border border-indigo-100">
                                    {tensA - 1}
                                </span>
                            </>
                        ) : (
                            tensA
                        )}
                    </span>

                    {/* Ones Digit */}
                    <span className="relative inline-block">
                        {needsBorrow ? (
                            <>
                                <span className="opacity-30 relative">
                                    {onesA}
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-1 bg-red-500 transform rotate-12" />
                                    </span>
                                </span>
                                <span className="absolute -top-8 -left-2 text-3xl text-indigo-600 font-bold bg-indigo-50 px-2 rounded-md border border-indigo-100 whitespace-nowrap">
                                    1{onesA}
                                </span>
                            </>
                        ) : (
                            onesA
                        )}
                    </span>
                </div>

                {/* Bottom Number (Subtrahend) */}
                <div className="relative mb-4">
                    <span className="absolute -left-12 top-1 text-gray-400 font-light">-</span>
                    <span className="mr-4">{tensB > 0 ? tensB : ''}</span>
                    <span>{onesB}</span>
                </div>

                {/* Equals Line */}
                <div className="w-full h-1.5 bg-gray-800 rounded-full mb-4" />

                {/* Answer / Question Mark */}
                <div className="text-blue-600 animate-pulse text-center w-full">?</div>
            </div>

            {needsBorrow && (
                <div className="mt-8 text-center bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                    <div className="text-sm font-bold text-indigo-800 uppercase tracking-widest mb-1">Step 1: Regroup</div>
                    <div className="text-indigo-600">Borrow 1 ten to make {onesA} into 14!</div>
                </div>
            )}
        </div>
    );
};

const BeadsView = ({ a, b }: { a: number, b: number }) => {
    return (
        <div className="flex flex-col items-center w-full bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {Array.from({ length: a }).map((_, i) => {
                    // Cross out the LAST b items
                    const isCrossed = i >= (a - b);
                    return (
                        <div
                            key={i}
                            className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center
                                ${isCrossed ? 'bg-slate-100 border-slate-200' : 'bg-blue-400 border-blue-500 shadow-sm'}
                            `}
                        >
                            {isCrossed && (
                                <span className="text-red-500 font-bold text-lg leading-none">×</span>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="mt-6 flex gap-8 text-sm font-bold text-gray-500">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 rounded-full border border-blue-500" />
                    <span>Start: {a}</span>
                </div>
                <div className="flex items-center gap-2 text-red-500">
                    <span className="text-lg">×</span>
                    <span>Take Away: {b}</span>
                </div>
            </div>
            <div className="mt-2 text-md text-gray-600">
                Count the blue dots left!
            </div>
        </div>
    );
};

const ToggleSwitch = ({ mode, setMode }: { mode: 'math' | 'beads', setMode: (m: 'math' | 'beads') => void }) => (
    <div className="flex bg-slate-100 p-1 rounded-lg mb-6 shadow-inner w-64">
        <button
            onClick={() => setMode('math')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'math' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
        >
            🧮 Math
        </button>
        <button
            onClick={() => setMode('beads')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'beads' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
        >
            🔵 Beads
        </button>
    </div>
);

// Keep existing BlockGroup for Addition (legacy/other modes)
const BlockGroup = ({ value }: { value: number }) => {
    const tens = Math.floor(value / 10);
    const ones = value % 10;
    return (
        <div className="flex flex-col items-center gap-2 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
            <div className="flex items-end gap-3">
                {tens > 0 && (
                    <div className="flex gap-1">
                        {Array.from({ length: tens }).map((_, i) => (
                            <div key={`ten-${i}`} className="w-4 h-24 bg-blue-500 rounded-sm border border-blue-600 flex flex-col justify-between py-1">
                                {Array.from({ length: 9 }).map((_, j) => <div key={j} className="h-px w-full bg-blue-400/50" />)}
                            </div>
                        ))}
                    </div>
                )}
                {ones > 0 && (
                    <div className="grid grid-cols-2 gap-1 content-end pb-0.5">
                        {Array.from({ length: ones }).map((_, i) => (
                            <div key={`one-${i}`} className="w-4 h-4 bg-yellow-400 rounded-sm border border-yellow-500 shadow-sm" />
                        ))}
                    </div>
                )}
            </div>
            <div className="font-mono font-bold text-gray-600 text-lg mt-1">{value}</div>
        </div>
    );
};

export const PlaceValueVisual = ({ question }: { question: any }) => {
    const [mode, setMode] = useState<'math' | 'beads'>('math');

    // Mode 1: Addition/Subtraction with Full Props
    if (question.visual.a !== undefined && question.visual.b !== undefined) {
        const isSubtraction = question.visual.operator === '-';

        // Subtraction Specific Visual (Toggleable)
        if (isSubtraction) {
            return (
                <div className="flex flex-col items-center w-full">
                    <ToggleSwitch mode={mode} setMode={setMode} />

                    {mode === 'math' ? (
                        <VerticalMathView a={question.visual.a} b={question.visual.b} />
                    ) : (
                        <BeadsView a={question.visual.a} b={question.visual.b} />
                    )}
                </div>
            );
        }

        // Addition Mode (Two Groups) - Keeping existing Block Visual
        return (
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                    <div className="text-gray-400 mb-1 text-xs font-bold uppercase tracking-wider">Column Addition</div>
                    <div className="font-mono text-4xl font-bold text-gray-800 tracking-widest leading-none text-right px-4">
                        <div>{question.visual.a}</div>
                        <div className="relative">
                            <span className="absolute -left-6 text-gray-400">+</span>
                            {question.visual.b}
                        </div>
                        <div className="w-full h-1 bg-gray-800 my-1 rounded-full" />
                        <div className="text-blue-600 animate-pulse text-center">?</div>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md border-2 border-slate-100">
                    <BlockGroup value={question.visual.a} />
                    <div className="text-4xl font-bold text-gray-400">+</div>
                    <BlockGroup value={question.visual.b} />
                    <div className="text-4xl font-bold text-gray-400">=</div>
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                        <div className="text-5xl font-bold text-blue-500 animate-pulse">?</div>
                    </div>
                </div>
            </div>
        );
    }

    // Mode 2: Single Number View (Legacy)
    if (question.visual.tens === undefined) return null;

    return (
        <div className="flex flex-col items-center mb-8">
            {/* Keeping Legacy Place Value View for other concepts */}
            <div className="flex items-end gap-8 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-2">
                        {Array.from({ length: question.visual.tens }).map((_, i) => (
                            <div key={`ten-${i}`} className="w-4 h-32 bg-indigo-500 rounded-sm border border-indigo-600 flex flex-col justify-between py-1">
                                {Array.from({ length: 9 }).map((_, j) => <div key={j} className="h-px w-full bg-indigo-400/50" />)}
                            </div>
                        ))}
                    </div>
                    <span className="font-bold text-gray-500 text-sm uppercase tracking-wider">
                        {question.visual.tens} {question.visual.tens === 1 ? 'Ten' : 'Tens'}
                    </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="grid grid-cols-5 gap-1 content-end" style={{ height: '8rem' }}>
                        {Array.from({ length: question.visual.ones }).map((_, i) => (
                            <div key={`one-${i}`} className="w-4 h-4 bg-yellow-400 rounded-sm border border-yellow-500" />
                        ))}
                    </div>
                    <span className="font-bold text-gray-500 text-sm uppercase tracking-wider">
                        {question.visual.ones} {question.visual.ones === 1 ? 'One' : 'Ones'}
                    </span>
                </div>
            </div>
        </div>
    );
};

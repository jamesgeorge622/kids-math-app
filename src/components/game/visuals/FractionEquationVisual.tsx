import { useState } from 'react';

export const FractionEquationVisual = ({ data }: { data: { left: { n: number; d: number }; right: { n: number; d: number }; operation: '+' | '-' } }) => {
    const { left, right, operation } = data;
    const [step, setStep] = useState(0); // 0=Show Question, 1=Move Left, 2=Move Right (if add) / Remove Right (if sub)
    const [viewMode, setViewMode] = useState<'pie' | 'bar'>('pie');

    // Calculate Result
    let resN = operation === '+' ? left.n + right.n : left.n - right.n;
    const commonD = left.d; // Assuming common denominator for now

    const nextStep = () => setStep(s => Math.min(s + 1, 2));
    const reset = () => setStep(0);

    // PIE CHART HELPER (CSS Conic Gradient)
    const renderPie = (n: number, d: number, color: string, isEmpty = false) => {
        const percent = (n / d) * 100;
        return (
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-100 shadow-sm bg-white overflow-hidden">
                {!isEmpty && (
                    <div
                        className="absolute inset-0 transition-all duration-1000 ease-out"
                        style={{ background: `conic-gradient(${color} 0% ${percent}%, transparent ${percent}% 100%)` }}
                    />
                )}
                {/* Grid Lines */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent"
                    style={{
                        backgroundImage: `repeating-conic-gradient(transparent 0deg ${(360 / d) - 1}deg, rgba(255,255,255,0.5) ${(360 / d) - 1}deg ${(360 / d)}deg)`
                    }}
                />
            </div>
        );
    };

    // BAR CHART HELPER (Flex Grid)
    const renderBar = (n: number, d: number, color: string, isEmpty = false) => {
        return (
            <div className="flex w-24 sm:w-32 h-24 sm:h-32 border-4 border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                {isEmpty
                    ? Array(d).fill(0).map((_, i) => (
                        <div key={i} className="flex-1 border-r border-gray-200 last:border-r-0 bg-transparent" />
                    ))
                    : Array(d).fill(0).map((_, i) => (
                        <div key={i} className={`flex-1 border-r border-white/50 last:border-r-0 transition-all duration-500`}
                            style={{ backgroundColor: i < n ? color : 'transparent' }}
                        />
                    ))
                }
            </div>
        );
    };

    // Result Rendering Logic
    // Step 0: Empty
    // Step 1: Show Left Part (Blue)
    // Step 2: Show Right Part (Red) added on

    const renderResultPie = () => {
        // Conic Gradient with multiple stops for different colors
        // Blue: 0% -> Left%
        // Red: Left% -> Left+Right%
        const leftP = (left.n / left.d) * 100;
        const totalP = (resN / left.d) * 100;

        let grad = `transparent 0% 100%`;

        if (step >= 1) {
            grad = `var(--color-blue) 0% ${leftP}%`;
            if (step >= 2) {
                grad += `, var(--color-red) ${leftP}% ${totalP}%`;
            }
            grad += `, transparent ${step >= 2 ? totalP : leftP}% 100%`;
        }

        // CSS Variables for colors can be injected or hardcoded
        const blue = '#60A5FA'; // blue-400
        const red = '#F87171'; // rose-400

        const gradientStyle = step === 0 ? `transparent 0% 100%` :
            step === 1 ? `${blue} 0% ${leftP}%, transparent ${leftP}% 100%` :
                `${blue} 0% ${leftP}%, ${red} ${leftP}% ${totalP}%, transparent ${totalP}% 100%`;

        return (
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-200 shadow-inner bg-gray-50 overflow-hidden">
                <div
                    className="absolute inset-0 transition-[background] duration-1000 ease-in-out"
                    style={{ background: `conic-gradient(${gradientStyle})` }}
                />
                <div className="absolute inset-0 rounded-full"
                    style={{
                        backgroundImage: `repeating-conic-gradient(transparent 0deg ${(360 / left.d) - 1}deg, rgba(0,0,0,0.1) ${(360 / left.d) - 1}deg ${(360 / left.d)}deg)`
                    }}
                />
            </div>
        );
    };

    const renderResultBar = () => {
        return (
            <div className="flex w-24 sm:w-32 h-24 sm:h-32 border-4 border-gray-200 rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                {Array(left.d).fill(0).map((_, i) => {
                    let bg = 'transparent';
                    if (step >= 1 && i < left.n) bg = '#60A5FA'; // Blue
                    else if (step >= 2 && i >= left.n && i < (left.n + right.n)) bg = '#F87171'; // Red

                    return (
                        <div key={i} className={`flex-1 border-r border-gray-300 last:border-r-0 transition-colors duration-500`}
                            style={{ backgroundColor: bg }}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center w-full">
            {/* View Toggle */}
            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-full">
                <button
                    onClick={() => setViewMode('pie')}
                    className={`px-4 py-1 text-sm rounded-full transition-all ${viewMode === 'pie' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    🍕 Pies
                </button>
                <button
                    onClick={() => setViewMode('bar')}
                    className={`px-4 py-1 text-sm rounded-full transition-all ${viewMode === 'bar' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    🧱 Bars
                </button>
            </div>

            {/* Equation Layout */}
            <div className="flex items-center gap-2 sm:gap-4 md:gap-8 justify-center">

                {/* Left Operand */}
                <div className="flex flex-col items-center gap-2">
                    <div className={`transition-all duration-500 ${step >= 1 ? 'opacity-30 scale-95 blur-[1px]' : 'opacity-100 scale-100'}`}>
                        {viewMode === 'pie' ? renderPie(left.n, left.d, '#60A5FA') : renderBar(left.n, left.d, '#60A5FA')}
                    </div>
                    <div className="text-2xl font-bold text-blue-500">{left.n}/{left.d}</div>
                </div>

                {/* Operator */}
                <div className="text-4xl font-black text-gray-300">
                    {operation}
                </div>

                {/* Right Operand */}
                <div className="flex flex-col items-center gap-2">
                    <div className={`transition-all duration-500 ${step >= 2 ? 'opacity-30 scale-95 blur-[1px]' : 'opacity-100 scale-100'}`}>
                        {viewMode === 'pie' ? renderPie(right.n, left.d, '#F87171') : renderBar(right.n, left.d, '#F87171')}
                    </div>
                    <div className="text-2xl font-bold text-rose-500">{right.n}/{right.d}</div>
                </div>

                {/* Equals */}
                <div className="text-4xl font-black text-gray-300">
                    =
                </div>

                {/* Result */}
                <div className="flex flex-col items-center gap-2">
                    <div className="transition-all duration-500 scale-110">
                        {viewMode === 'pie' ? renderResultPie() : renderResultBar()}
                    </div>
                    <div className={`text-3xl font-bold text-purple-600 transition-all ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {resN}/{commonD}
                    </div>
                </div>

            </div>

            {/* Controls */}
            <div className="flex justify-center mt-10">
                {step < 2 ? (
                    <button
                        onClick={nextStep}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-lg rounded-xl shadow-lg font-bold transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        {step === 0 ? 'Combine' : 'Add Next Part'} ➔
                    </button>
                ) : (
                    <button
                        onClick={reset}
                        className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg rounded-xl font-bold transition-colors flex items-center gap-2"
                    >
                        ↺ Replay
                    </button>
                )}
            </div>
            <div className="text-gray-400 mt-4 text-center">
                {step === 0 && "Ready to add!"}
                {step === 1 && `Added ${left.n} blue part${left.n > 1 ? 's' : ''}...`}
                {step === 2 && `Added ${right.n} red part${right.n > 1 ? 's' : ''}! Total is ${resN}/${commonD}.`}
            </div>

        </div>
    );
};

import { useState } from 'react';

export const DecimalOperationVisual = ({ data }: { data: { a: number; b: number; operation: '+' | '-' } }) => {
    const { a: numA, b: numB, operation } = data;
    const [step, setStep] = useState(0);
    const [viewMode, setViewMode] = useState<'money' | 'grid'>('money');

    // Precision handling using integers (cents) to avoid float errors
    const centsA = Math.round(numA * 100);
    const centsB = Math.round(numB * 100);
    const resultCents = operation === '+' ? centsA + centsB : centsA - centsB;
    const result = resultCents / 100;

    const maxSteps = 2; // 0=Question, 1=Second operand appears/moves, 2=Result calculated
    const nextStep = () => setStep(s => Math.min(s + 1, maxSteps));
    const reset = () => setStep(0);

    // MONEY VIEW: Vertical Alignment with Dollar Signs
    const renderMoney = () => {
        return (
            <div className="flex flex-col items-end text-3xl sm:text-5xl font-mono font-bold tracking-wider bg-green-50 p-8 rounded-xl border-4 border-green-200 shadow-xl">
                {/* Row 1 */}
                <div className="flex items-center gap-4 text-green-800">
                    <span>$</span>
                    <span>{numA.toFixed(2)}</span>
                </div>

                {/* Row 2 */}
                <div className={`flex items-center gap-4 text-emerald-600 transition-all duration-500 ${step >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                    <span className="mr-auto">{operation}</span>
                    <span>$</span>
                    <span>{numB.toFixed(2)}</span>
                </div>

                {/* Divider */}
                <div className={`w-full border-b-4 border-green-800 my-2 transition-all ${step >= 1 ? 'scale-100' : 'scale-0'}`}></div>

                {/* Result */}
                <div className={`flex items-center gap-4 text-green-900 transition-all duration-500 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <span>$</span>
                    <span>{result.toFixed(2)}</span>
                </div>
            </div>
        );
    };

    // GRID VIEW: 100-Block Grids
    const renderGrid = () => {
        // We usually fit in one grid if result <= 1. If > 1, we need multiple grids.
        // Let's assume result fits in 2 grids max for this visualization scale.
        const gridCount = Math.ceil(Math.max(centsA, centsB, resultCents) / 100);

        return (
            <div className="flex flex-wrap gap-4 justify-center">
                {Array.from({ length: gridCount }).map((_, gridIdx) => (
                    <div key={gridIdx} className="w-48 h-48 bg-white border-2 border-gray-300 grid grid-cols-10 grid-rows-10 gap-px p-1 shadow-sm">
                        {Array.from({ length: 100 }).map((_, cellIdx) => {
                            const globalIdx = gridIdx * 100 + cellIdx;
                            let color = 'bg-gray-100'; // Empty

                            // Logic for coloring based on step context
                            // Step 0: Show A only
                            // Step 1: Show A and B (distinct)
                            // Step 2: Show Combined Result

                            if (operation === '+') {
                                if (globalIdx < centsA) {
                                    color = 'bg-blue-400'; // A is Blue
                                } else if (globalIdx < centsA + centsB) {
                                    // B part
                                    if (step >= 1) color = 'bg-emerald-400'; // Show B in Green
                                    if (step < 1) color = 'bg-gray-100'; // Hidden at step 0
                                }
                            } else {
                                // Subtraction
                                if (globalIdx < centsA) {
                                    color = 'bg-blue-400';
                                    // If part of the removed section
                                    if (step >= 1 && globalIdx >= (centsA - centsB)) {
                                        color = 'bg-red-200 diagonal-stripe'; // Mark as removed?
                                        if (step >= 2) color = 'bg-gray-200 opacity-50'; // Faded out result
                                    }
                                }
                            }

                            return <div key={cellIdx} className={`${color} rounded-sm transition-colors duration-300`} />
                        })}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full">
            {/* View Toggle */}
            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-full">
                <button
                    onClick={() => setViewMode('money')}
                    className={`px-4 py-1 text-sm rounded-full transition-all ${viewMode === 'money' ? 'bg-white shadow text-green-700 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    💵 Money
                </button>
                <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-1 text-sm rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    🟦 Grid
                </button>
            </div>

            {/* Main Visual Area */}
            <div className="min-h-[300px] flex items-center justify-center p-4 w-full">
                {viewMode === 'money' ? renderMoney() : renderGrid()}
            </div>

            {/* Controls */}
            <div className="flex justify-center mt-6">
                {step < maxSteps ? (
                    <button
                        onClick={nextStep}
                        className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-lg rounded-xl shadow-lg font-bold transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        {step === 0 ? 'Start' : 'Solve'} ➔
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

            <div className="text-gray-400 mt-4 text-center h-6">
                {step === 0 && "Let's align the decimal points!"}
                {step === 1 && (operation === '+' ? "Add the second amount..." : "Subtract the second amount...")}
                {step === 2 && `The total is ${result.toFixed(2)}`}
            </div>
        </div>
    );
};

import { useState } from 'react';

export const MultiDigitMultiplicationVisual = ({ data }: { data: { a: number; b: number } }) => {
    const { a, b } = data;
    const [step, setStep] = useState(0); // 0=Start, 1=Ones, 2=TensXOnes, 3=OnesXTens, 4=TensXTens, 5=Sum
    const [viewMode, setViewMode] = useState<'both' | 'area' | 'column'>('both');

    // Helper to decompose number into Tens and Ones
    const decompose = (n: number) => {
        const tens = Math.floor(n / 10) * 10;
        const ones = n % 10;
        return { tens, ones };
    };

    const decompA = decompose(a); // Top
    const decompB = decompose(b); // Side

    const p1 = decompA.tens * decompB.tens; // 10 * 10 = 100 (Blue)
    const p2 = decompA.ones * decompB.tens; // 2 * 10 = 20  (Green)
    const p3 = decompA.tens * decompB.ones; // 10 * 4 = 40  (Yellow)
    const p4 = decompA.ones * decompB.ones; // 2 * 4 = 8   (Red)

    const total = p1 + p2 + p3 + p4;

    const nextStep = () => setStep(s => Math.min(s + 1, 5));
    const reset = () => setStep(0);

    const isVisible = (targetStep: number) => step >= targetStep;
    const isCurrent = (targetStep: number) => step === targetStep;

    const renderAreaModel = () => (
        <div className="flex flex-col items-center animate-in fade-in">
            <div className="mb-2 text-gray-500 font-bold text-xs tracking-widest uppercase">Area Model</div>

            <div className="grid grid-cols-[auto_1fr_1fr] gap-2">
                {/* Top Labels */}
                <div />
                <div className="text-center font-bold text-gray-600">{decompA.tens}</div>
                <div className="text-center font-bold text-gray-600">{decompA.ones}</div>

                {/* Row 1 (Tens of B) */}
                <div className="flex items-center justify-end font-bold text-gray-600 pr-2">{decompB.tens}</div>

                {/* Box 1 (Blue) - Tens x Tens - Step 4 */}
                <div className={`
                    border-2 rounded p-2 flex flex-col items-center justify-center min-w-[60px] min-h-[50px] transition-all duration-500
                    ${isVisible(4) ? 'bg-blue-100 border-blue-200 opacity-100 transform scale-100' : 'bg-gray-50 border-gray-100 opacity-50 scale-95'}
                    ${isCurrent(4) ? 'ring-2 ring-offset-2 ring-blue-400' : ''}
                `}>
                    <span className={`text-xs ${isVisible(4) ? 'text-blue-400' : 'text-transparent'}`}>{decompA.tens}×{decompB.tens}</span>
                    <span className={`font-bold ${isVisible(4) ? 'text-blue-700' : 'text-transparent'}`}>{p1}</span>
                </div>

                {/* Box 2 (Green) - Ones x Tens - Step 3 */}
                <div className={`
                    border-2 rounded p-2 flex flex-col items-center justify-center min-w-[60px] min-h-[50px] transition-all duration-500
                    ${isVisible(3) ? 'bg-green-100 border-green-200 opacity-100 transform scale-100' : 'bg-gray-50 border-gray-100 opacity-50 scale-95'}
                    ${isCurrent(3) ? 'ring-2 ring-offset-2 ring-green-400' : ''}
                `}>
                    <span className={`text-xs ${isVisible(3) ? 'text-green-400' : 'text-transparent'}`}>{decompA.ones}×{decompB.tens}</span>
                    <span className={`font-bold ${isVisible(3) ? 'text-green-700' : 'text-transparent'}`}>{p2}</span>
                </div>

                {/* Row 2 (Ones of B) */}
                <div className="flex items-center justify-end font-bold text-gray-600 pr-2">{decompB.ones}</div>

                {/* Box 3 (Yellow) - Tens x Ones - Step 2 */}
                <div className={`
                    border-2 rounded p-2 flex flex-col items-center justify-center min-w-[60px] min-h-[50px] transition-all duration-500
                    ${isVisible(2) ? 'bg-yellow-100 border-yellow-200 opacity-100 transform scale-100' : 'bg-gray-50 border-gray-100 opacity-50 scale-95'}
                    ${isCurrent(2) ? 'ring-2 ring-offset-2 ring-yellow-400' : ''}
                `}>
                    <span className={`text-xs ${isVisible(2) ? 'text-yellow-500' : 'text-transparent'}`}>{decompA.tens}×{decompB.ones}</span>
                    <span className={`font-bold ${isVisible(2) ? 'text-yellow-700' : 'text-transparent'}`}>{p3}</span>
                </div>

                {/* Box 4 (Red) - Ones x Ones - Step 1 */}
                <div className={`
                    border-2 rounded p-2 flex flex-col items-center justify-center min-w-[60px] min-h-[50px] transition-all duration-500
                    ${isVisible(1) ? 'bg-rose-100 border-rose-200 opacity-100 transform scale-100' : 'bg-gray-50 border-gray-100 opacity-50 scale-95'}
                    ${isCurrent(1) ? 'ring-2 ring-offset-2 ring-rose-400' : ''}
                `}>
                    <span className={`text-xs ${isVisible(1) ? 'text-rose-400' : 'text-transparent'}`}>{decompA.ones}×{decompB.ones}</span>
                    <span className={`font-bold ${isVisible(1) ? 'text-rose-700' : 'text-transparent'}`}>{p4}</span>
                </div>
            </div>

            <div className="mt-4 text-xs text-gray-400">
                Total Area = {isVisible(5) ? total : '?'}
            </div>
        </div>
    );

    const renderColumnMethod = () => (
        <div className="flex flex-col items-center text-xl font-mono animate-in fade-in">
            <div className="mb-2 text-gray-500 font-sans font-bold text-xs tracking-widest uppercase">Column Method</div>

            <div className="flex flex-col items-end min-w-[100px]">
                <div className="text-gray-500 tracking-widest">{a}</div>
                <div className="border-b-2 border-gray-800 w-full text-right pr-1 mb-1 relative">
                    <span className="absolute left-0 text-gray-400 text-sm">×</span>
                    {b}
                </div>

                {/* Partial Products mapped to colors */}
                {/* Step 1: Ones x Ones */}
                <div className={`transition-all duration-500 ${isVisible(1) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} text-rose-600 font-bold`}>
                    {p4}
                </div>

                {/* Step 2: Tens x Ones */}
                <div className={`transition-all duration-500 ${isVisible(2) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} text-yellow-600 font-bold`}>
                    {p3}
                </div>

                {/* Step 3: Ones x Tens */}
                <div className={`transition-all duration-500 ${isVisible(3) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} text-green-600 font-bold`}>
                    {p2}
                </div>

                {/* Step 4: Tens x Tens */}
                <div className={`transition-all duration-500 ${isVisible(4) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} text-blue-600 font-bold`}>
                    {p1}
                </div>

                <div className="border-t-2 border-gray-800 w-full my-1"></div>
                <div className={`font-bold text-purple-600 transition-all ${isVisible(5) ? 'opacity-100' : 'opacity-0'}`}>
                    {total}
                </div>
                {!isVisible(5) && <div className="font-bold text-purple-600 animate-pulse">?</div>}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center w-full">
            {/* Controls */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setViewMode('both')}
                    className={`px-3 py-1 text-xs rounded-full border ${viewMode === 'both' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                    Show Both
                </button>
                <button
                    onClick={() => setViewMode('area')}
                    className={`px-3 py-1 text-xs rounded-full border ${viewMode === 'area' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                    Area Only
                </button>
                <button
                    onClick={() => setViewMode('column')}
                    className={`px-3 py-1 text-xs rounded-full border ${viewMode === 'column' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                    Column Only
                </button>
            </div>

            <div className="flex flex-wrap justify-center items-start gap-8 sm:gap-16 p-4 min-h-[300px]">
                {(viewMode === 'both' || viewMode === 'area') && renderAreaModel()}

                {viewMode === 'both' && <div className="hidden sm:block w-px h-48 bg-gray-200 self-center" />}

                {(viewMode === 'both' || viewMode === 'column') && renderColumnMethod()}
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center gap-4 mt-2">
                <button
                    onClick={reset}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Restart"
                >
                    ↺
                </button>

                {step < 5 ? (
                    <button
                        onClick={nextStep}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md font-bold transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        {step === 0 ? 'Start Calculation' : 'Next Step'} ➔
                    </button>
                ) : (
                    <div className="px-6 py-2 bg-green-100 text-green-700 rounded-lg font-bold border border-green-200">
                        Complete! ✓
                    </div>
                )}
            </div>
            <div className="text-xs text-gray-400 mt-2">
                Step {step} of 5
            </div>
        </div>
    );
};

import { useState } from 'react';

export const LongDivisionVisual = ({ data }: { data: { dividend: number; divisor: number } }) => {
    const { dividend, divisor } = data;
    // Expanded Steps for Full Detail:
    // 0: Start
    // 1: Show Tens Quotient (e.g. 3) + Area Box 1 Highlight
    // 2: Show Multiply Step (3*4=12) below Tens
    // 3: Show Subtraction Step (13-12=1)
    // 4: Show Bring Down Step (Bring down 6 -> 16)
    // 5: Show Ones Quotient (e.g. 4) + Area Box 2 Highlight
    // 6: Show Multiply Step (4*4=16)
    // 7: Show Final Subtraction (16-16=0)
    // 8: Complete
    const [step, setStep] = useState(0);
    const [viewMode, setViewMode] = useState<'both' | 'area' | 'bracket'>('both');

    const quotient = dividend / divisor;

    // Decompose logic
    const qTens = Math.floor(quotient / 10);
    const qOnes = quotient % 10;

    const dividendStr = dividend.toString();
    const digits = dividendStr.split('');

    // Working values
    let leadLen = 1;
    let leadVal = parseInt(dividendStr.substring(0, leadLen));

    // If first digit < divisor, take 2.
    if (leadVal < divisor) {
        leadLen = 2;
        leadVal = parseInt(dividendStr.substring(0, leadLen));
    }

    const step1_multiply = qTens * divisor;
    const step1_remainder = leadVal - step1_multiply;

    const part1Area = qTens * 10 * divisor;
    const part2Area = qOnes * divisor;

    const maxSteps = 8;
    const nextStep = () => setStep(s => Math.min(s + 1, maxSteps));
    const reset = () => setStep(0);

    const isVisible = (targetStep: number) => step >= targetStep;
    const isCurrent = (targetStep: number) => step === targetStep;

    const renderAreaModel = () => (
        <div className="flex flex-col items-center animate-in fade-in transition-all">
            <div className="mb-2 text-gray-500 font-bold text-xs tracking-widest uppercase">Area Model</div>

            <div className="flex items-end">
                {/* Height Label */}
                <div className="mr-2 mb-10 font-bold text-gray-400 text-xl">{divisor}</div>

                <div className="flex gap-1">
                    {/* Tens Box (Blue) */}
                    <div className="flex flex-col items-center gap-1">
                        <div className={`font-bold transition-all ${isVisible(1) ? 'text-blue-600 translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>{qTens}0</div>
                        <div className={`
                             w-32 h-24 rounded border-2 flex flex-col items-center justify-center transition-all duration-500
                             ${isVisible(1) ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'}
                             ${isCurrent(1) ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                        `}>
                            <div className="text-xl font-bold text-blue-800">{part1Area}</div>
                            {isVisible(2) && <div className="text-xs text-blue-400 mt-1">{divisor} × {qTens}0</div>}
                        </div>
                    </div>

                    {/* Ones Box (Red) */}
                    <div className="flex flex-col items-center gap-1">
                        <div className={`font-bold transition-all ${isVisible(5) ? 'text-rose-600 translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>{qOnes}</div>
                        <div className={`
                             w-16 h-24 rounded border-2 flex flex-col items-center justify-center transition-all duration-500
                             ${isVisible(5) ? 'bg-rose-100 border-rose-300' : 'bg-gray-50 border-gray-200'}
                             ${isCurrent(5) ? 'ring-2 ring-rose-400 ring-offset-2' : ''}
                        `}>
                            <div className="text-xl font-bold text-rose-800">{part2Area}</div>
                            {isVisible(6) && <div className="text-xs text-rose-400 mt-1">{divisor} × {qOnes}</div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-xs text-gray-400 mt-4 h-4">
                {isVisible(1) && `Split ${dividend} into ${part1Area} and ${part2Area}`}
            </div>
        </div>
    );

    const renderBracket = () => {
        const digitWidth = 'w-8';

        // Rows
        const ROW_QUOTIENT = 'row-start-1';
        const ROW_DIVIDEND = 'row-start-2';
        const ROW_MULT_1 = 'row-start-3';
        const ROW_REM_1 = 'row-start-4';
        const ROW_MULT_2 = 'row-start-5';
        const ROW_REM_2 = 'row-start-6';

        // CSS Grid Col Helper: 3 (Offset) + Index
        const getColStyle = (idx: number) => ({ gridColumnStart: 3 + idx });

        return (
            <div className="flex flex-col items-center text-xl sm:text-2xl font-mono animate-in fade-in">
                <div className="mb-4 text-gray-500 font-sans font-bold text-xs tracking-widest uppercase">Long Division</div>

                <div className="inline-grid grid-cols-[auto_auto_repeat(4,min-content)] gap-x-0 gap-y-1 text-center">

                    {/* Row 1: Quotient Digits */}
                    <div className={`col-start-1 col-end-3 ${ROW_QUOTIENT}`}></div>

                    {/* Tens Quotient */}
                    <div className={`${digitWidth} ${ROW_QUOTIENT} font-bold`} style={getColStyle(leadLen - 1)}>
                        {isVisible(1) && <span className="text-blue-600 animate-in zoom-in">{qTens > 0 ? qTens : ''}</span>}
                    </div>

                    {/* Ones Quotient */}
                    <div className={`${digitWidth} ${ROW_QUOTIENT} font-bold`} style={getColStyle(digits.length - 1)}>
                        {isVisible(5) && <span className="text-rose-600 animate-in zoom-in">{qOnes}</span>}
                    </div>


                    {/* Row 2: Divisor and Bracket and Dividend */}
                    <div className={`col-start-1 ${ROW_DIVIDEND} font-bold text-gray-400 pr-2`}>{divisor}</div>
                    <div className={`col-start-2 ${ROW_DIVIDEND} border-l-2 border-t-2 border-gray-800 rounded-tl-lg h-full w-2 translate-y-2`}></div>

                    {digits.map((d, i) => (
                        <div key={`d-${i}`} className={`${ROW_DIVIDEND} ${digitWidth} font-bold pt-1 border-gray-800 border-t-2`} style={getColStyle(i)}>
                            {d}
                        </div>
                    ))}


                    {/* Row 3: Multiply Step 1 */}
                    {isVisible(2) && (
                        <>
                            <div className={`col-start-2 ${ROW_MULT_1} text-gray-400 text-sm flex items-center justify-end pr-1`}>-</div>
                            {step1_multiply.toString().split('').map((d, i, arr) => {
                                // Right align to leadLen - 1
                                const targetIdx = (leadLen - 1) - (arr.length - 1) + i;
                                return (
                                    <div key={`s1-${i}`} className={`${ROW_MULT_1} ${digitWidth} text-blue-800 border-b-2 border-gray-300`} style={getColStyle(targetIdx)}>
                                        {d}
                                    </div>
                                );
                            })}
                        </>
                    )}


                    {/* Row 4: Remainder & Bring Down */}
                    {isVisible(3) && (
                        <>
                            {step1_remainder.toString().split('').map((d, i, arr) => {
                                // Right align to leadLen - 1
                                const targetIdx = (leadLen - 1) - (arr.length - 1) + i;
                                return (
                                    <div key={`r1-${i}`} className={`${ROW_REM_1} ${digitWidth} font-bold`} style={getColStyle(targetIdx)}>
                                        {d}
                                    </div>
                                );
                            })}

                            {isVisible(4) && (
                                <div className={`${ROW_REM_1} ${digitWidth} font-bold text-gray-600 animate-in slide-in-from-top-2`} style={getColStyle(leadLen)}>
                                    {digits[leadLen]}
                                </div>
                            )}
                        </>
                    )}


                    {/* Row 5: Multiply Step 2 */}
                    {isVisible(6) && (
                        <>
                            <div className={`col-start-2 ${ROW_MULT_2} text-gray-400 text-sm flex items-center justify-end pr-1`}>-</div>
                            {(qOnes * divisor).toString().split('').map((d, i, arr) => {
                                // Right align to last digit
                                const targetIdx = (digits.length - 1) - (arr.length - 1) + i;
                                return (
                                    <div key={`s2-${i}`} className={`${ROW_MULT_2} ${digitWidth} text-rose-800 border-b-2 border-gray-300`} style={getColStyle(targetIdx)}>
                                        {d}
                                    </div>
                                );
                            })}
                        </>
                    )}


                    {/* Row 6: Final Remainder */}
                    {isVisible(7) && (
                        <div className={`${ROW_REM_2} ${digitWidth} font-bold text-green-500`} style={getColStyle(digits.length - 1)}>
                            0
                        </div>
                    )}

                </div>

                <div className={`mt-8 font-bold text-purple-600 transition-all ${isVisible(8) ? 'opacity-100 scale-110' : 'opacity-0'}`}>
                    = {quotient}
                </div>
            </div>
        );
    }

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
                    onClick={() => setViewMode('bracket')}
                    className={`px-3 py-1 text-xs rounded-full border ${viewMode === 'bracket' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                    Bracket Only
                </button>
            </div>

            <div className="flex flex-wrap justify-center items-start gap-8 sm:gap-20 p-4 min-h-[350px]">
                {(viewMode === 'both' || viewMode === 'area') && renderAreaModel()}

                {viewMode === 'both' && <div className="hidden sm:block w-px h-64 bg-gray-200 self-center" />}

                {(viewMode === 'both' || viewMode === 'bracket') && renderBracket()}
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

                {step < maxSteps ? (
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
                Step {step} of {maxSteps}
            </div>
            {step > 0 && step < maxSteps && (
                <div className="text-sm text-indigo-600 mt-2 font-medium animate-pulse">
                    {step === 1 && `How many ${divisor}s in ${leadVal}? (${qTens})`}
                    {step === 2 && `${qTens} × ${divisor} = ${step1_multiply}`}
                    {step === 3 && `${leadVal} - ${step1_multiply} = ${step1_remainder}`}
                    {step === 4 && `Bring down the ${dividendStr[dividendStr.length - 1]} → ${step1_remainder === 0 ? '' : step1_remainder}${dividendStr[dividendStr.length - 1]}`}
                    {step === 5 && `How many ${divisor}s in ${step1_remainder === 0 ? '' : step1_remainder}${dividendStr[dividendStr.length - 1]}? (${qOnes})`}
                    {step === 6 && `${qOnes} × ${divisor} = ${step1_multiply === 0 && qOnes * divisor === 0 ? 0 : qOnes * divisor}`}
                    {step === 7 && `No remainder!`}
                </div>
            )}
        </div>
    );
};

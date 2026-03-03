import { useState, useEffect } from 'react';

interface SubtractionVisualProps {
    question: any;
}

export const SubtractionVisual = ({ question }: SubtractionVisualProps) => {
    const [removedIndices, setRemovedIndices] = useState<Set<number>>(new Set());

    useEffect(() => {
        setRemovedIndices(new Set());
    }, [question]);

    const onToggle = (index: number) => {
        const newSet = new Set(removedIndices);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setRemovedIndices(newSet);
    };

    // 1. Age 10+ Vertical "Long Math" Mode
    if (question.visual.kind === 'verticalMath' || question.visual.isVertical) {
        // Handle both older 'isVertical' flag and new 'verticalMath' kind
        const valA = question.visual.a || question.visual.valA;
        const valB = question.visual.b || question.visual.valB;
        return (
            <div className="flex flex-col items-center mb-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="text-gray-500 mb-4 font-bold uppercase tracking-wider text-sm">Solve using column subtraction</div>
                <div className="flex flex-col items-end">
                    <div className="font-mono text-6xl font-bold text-gray-800 tracking-widest leading-none text-right px-4">
                        <div>{valA}</div>
                        <div className="relative">
                            <span className="absolute -left-12 text-gray-400">-</span>
                            {valB}
                        </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 my-2 rounded-full" />
                    <div className="text-6xl font-bold text-blue-600 animate-pulse text-center w-full">?</div>
                </div>
            </div>
        );
    }

    if (!question.visual.start) return null;

    const { start, takeAway } = question.visual;
    const countRemoved = removedIndices.size;
    const currentRemaining = start.length - countRemoved;

    return (
        <div className="flex flex-col items-center mb-8">
            <div className="mb-4 text-xl font-bold text-orange-600 animate-pulse">
                Tap {takeAway} items to take them away!
            </div>
            <div className="flex flex-wrap justify-center gap-4 max-w-lg cursor-pointer">
                {start.map((item: string, i: number) => {
                    const isTakenAway = removedIndices.has(i);
                    return (
                        <div
                            key={i}
                            onClick={() => onToggle(i)}
                            className={`
                                text-5xl transition-all duration-300 select-none
                                ${isTakenAway ? 'opacity-30 scale-90 grayscale relative' : 'scale-100 hover:scale-110 active:scale-95 animate-bounce'}
                            `}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {item}
                            {isTakenAway && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-full h-1 bg-red-500 transform rotate-45 rounded-full" />
                                    <div className="w-full h-1 bg-red-500 transform -rotate-45 rounded-full absolute" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 text-gray-500 font-medium text-xl transition-all">
                {currentRemaining} left
                {countRemoved === takeAway && <span className="ml-2 text-green-500 font-bold">✓ Great Job!</span>}
            </div>
        </div>
    );
};

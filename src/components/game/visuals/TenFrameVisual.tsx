import { useState, useEffect } from 'react';

export const TenFrameVisual = ({ question }: { question: any }) => {
    const { mode = 'count', value = 0, secondary = 0, filled = 0 } = question.visual;

    // Interactive State for Subtraction
    const [tappedIndices, setTappedIndices] = useState<Set<number>>(new Set());

    // Reset when question changes
    useEffect(() => {
        setTappedIndices(new Set());
    }, [question]);

    const handleTap = (index: number) => {
        if (mode !== 'subtraction') return;

        const newSet = new Set(tappedIndices);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            // Only allow tapping up to the start value (can't tap non-existent dots)
            if (index < value) {
                newSet.add(index);
            }
        }
        setTappedIndices(newSet);
    };

    // Determine content logic
    let items: { type: string; id: number }[] = [];

    if (mode === 'addition') {
        // Group A (value) + Group B (secondary)
        items = [
            ...Array(value).fill('a').map((t, i) => ({ type: t, id: i })),
            ...Array(secondary).fill('b').map((t, i) => ({ type: t, id: value + i }))
        ];
    } else if (mode === 'subtraction') {
        // Interactive Mode: Start with ALL filled (value). Taps toggle 'removed'.
        // Determine state based on tappedIndices
        items = Array(value).fill(0).map((_, i) => ({
            type: tappedIndices.has(i) ? 'removed' : 'filled',
            id: i
        }));
    } else {
        // Default Counting
        const count = filled || value || 0;
        items = Array(count).fill('filled').map((t, i) => ({ type: t, id: i }));
    }

    // Calculate frames needed
    const totalCount = items.length;
    // For subtraction, totalCount is just 'value'. Logic ensures we render enough frames for the start number.
    const framesNeeded = Math.max(1, Math.ceil(totalCount / 10));

    const renderCell = (item: { type: string; id: number } | undefined) => {
        if (!item) return null;

        const isInteractive = mode === 'subtraction';
        const clickableClass = isInteractive ? 'cursor-pointer transform active:scale-95 transition-all hover:brightness-110' : '';

        const handleClick = () => {
            if (isInteractive) handleTap(item.id);
        };

        switch (item.type) {
            case 'a':
                return <div className="w-8 h-8 bg-blue-500 rounded-full shadow-sm" />;
            case 'b':
                return <div className="w-8 h-8 bg-red-500 rounded-full shadow-sm" />;
            case 'filled':
                return <div onClick={handleClick} className={`w-8 h-8 bg-blue-500 rounded-full shadow-sm ${clickableClass}`} />;
            case 'removed':
                return (
                    // Ghosting effect: Faded blue + Red X
                    <div onClick={handleClick} className={`w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center relative ${clickableClass}`}>
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-300"></div>
                        <span className="text-red-500 font-bold text-2xl leading-none" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>✕</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 mb-8">
            {/* Instruction for Interactive Mode */}
            {mode === 'subtraction' && (
                <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200 animate-pulse">
                    <span className="text-blue-800 font-bold">👇 Tap dots to take away {secondary}!</span>
                </div>
            )}

            <div className="flex flex-wrap justify-center gap-4">
                {Array.from({ length: framesNeeded }).map((_, frameIdx) => {
                    const frameStart = frameIdx * 10;
                    const frameItems = items.slice(frameStart, frameStart + 10);

                    // Pad frame to 10 for grid
                    const cells = Array(10).fill(null).map((_, i) => frameItems[i]);
                    const topRow = cells.slice(0, 5);
                    const bottomRow = cells.slice(5, 10);

                    return (
                        <div key={frameIdx} className="bg-blue-50 border-4 border-blue-900 rounded-lg p-1 w-[320px] select-none">
                            {/* Top Row */}
                            <div className="grid grid-cols-5 gap-1 border-b-2 border-blue-900 mb-1 pb-1">
                                {topRow.map((item, i) => (
                                    <div key={`top-${i}`} className="w-12 h-12 border-2 border-blue-200 bg-white flex items-center justify-center rounded-sm">
                                        {renderCell(item)}
                                    </div>
                                ))}
                            </div>
                            {/* Bottom Row */}
                            <div className="grid grid-cols-5 gap-1">
                                {bottomRow.map((item, i) => (
                                    <div key={`bot-${i}`} className="w-12 h-12 border-2 border-blue-200 bg-white flex items-center justify-center rounded-sm">
                                        {renderCell(item)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Caption / Interactive Counter */}
            <div className="text-xl text-gray-600 font-bold flex flex-col items-center gap-1">
                <div className="flex gap-4">
                    {mode === 'addition' && (
                        <>
                            <span className="text-blue-600">{value}</span>
                            <span>+</span>
                            <span className="text-red-600">{secondary}</span>
                        </>
                    )}
                    {mode === 'subtraction' && (
                        <>
                            <span className={`transition-colors ${tappedIndices.size === secondary ? 'text-green-600 scale-110' : 'text-gray-800'}`}>
                                {tappedIndices.size}
                            </span>
                            <span className="text-gray-400">/</span>
                            <span className="text-red-500">{secondary}</span>
                            <span className="text-sm font-normal text-gray-400 ml-2 uppercase tracking-wider">Removed</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

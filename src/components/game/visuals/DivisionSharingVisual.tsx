import { useState, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface DivisionSharingVisualProps {
    data: {
        total: number;
        groupCount: number;
        item: string;
    }
}

export const DivisionSharingVisual = ({ data }: DivisionSharingVisualProps) => {
    const { total, groupCount, item } = data;
    const [distributedCount, setDistributedCount] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Reset when data changes
        setDistributedCount(0);
        setIsAnimating(false);
        setIsComplete(false);
    }, [total, groupCount, item]);

    useEffect(() => {
        if (!isAnimating) return;

        const timer = setInterval(() => {
            setDistributedCount(prev => {
                if (prev >= total) {
                    clearInterval(timer);
                    setIsAnimating(false);
                    setIsComplete(true);
                    return prev;
                }
                return prev + 1;
            });
        }, 400); // Slowed down from 150ms to 400ms

        return () => clearInterval(timer);
    }, [isAnimating, total]);

    const handleStart = () => {
        setDistributedCount(0);
        setIsComplete(false);
        setIsAnimating(true);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
            {/* Controls */}
            <div className="flex gap-4">
                {!isAnimating && !isComplete && (
                    <button
                        onClick={handleStart}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all animate-bounce-subtle"
                    >
                        <Play className="w-5 h-5 fill-current" />
                        Start Dividing
                    </button>
                )}

                {(isComplete || isAnimating) && (
                    <button
                        onClick={handleStart}
                        disabled={isAnimating}
                        className={`flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <RotateCcw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
                        {isAnimating ? 'Sharing...' : 'Share Again'}
                    </button>
                )}
            </div>

            {/* Source Pile */}
            <div className="bg-gray-100 p-4 rounded-xl w-full text-center min-h-[80px] relative">
                <div className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Total: {total}</div>
                <div className="flex flex-wrap justify-center gap-2">
                    {Array.from({ length: total }).map((_, i) => (
                        <div
                            key={i}
                            className={`text-3xl transition-all duration-300 ${i < distributedCount ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Arrow */}
            <div className={`text-gray-300 text-4xl font-bold transition-opacity ${isAnimating ? 'opacity-100 animate-bounce' : 'opacity-30'}`}>
                ↓
            </div>

            {/* Destination Jars */}
            <div className="flex flex-wrap justify-center gap-4 w-full">
                {Array.from({ length: groupCount }).map((_, jarIndex) => {
                    // Calculate items in this jar based on round-robin distribution
                    const itemsInJar = Array.from({ length: distributedCount })
                        .map((_, i) => i)
                        .filter(i => i % groupCount === jarIndex);

                    return (
                        <div key={jarIndex} className="flex-1 min-w-[100px] max-w-[150px] bg-white border-4 border-indigo-200 rounded-3xl p-4 flex flex-col items-center relative min-h-[140px]">
                            {/* Jar Lid/Rim */}
                            <div className="absolute -top-4 w-20 h-3 bg-indigo-300 rounded-full" />

                            <div className="mt-2 flex flex-wrap content-start justify-center gap-1">
                                {itemsInJar.map((originalIndex) => (
                                    <span key={originalIndex} className="text-2xl animate-pop-in">
                                        {item}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-auto pt-2 text-gray-400 font-bold text-sm">
                                {itemsInJar.length}
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="text-gray-500 text-center font-medium h-6">
                {isAnimating ? `Sharing ${total} items...` : isComplete ? `Done! Each group has ${Math.floor(total / groupCount)}.` : `Ready to share ${total} items into ${groupCount} groups.`}
            </p>
        </div>
    );
};

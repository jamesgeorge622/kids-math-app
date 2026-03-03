
import { useState } from 'react';

const FlipCard = ({ a, b }: { a: number, b: number }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const answer = a * b;

    return (
        <div
            className="relative w-full h-32 cursor-pointer perspective-1000 group"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>

                {/* Front (Question) */}
                <div className="absolute inset-0 backface-hidden bg-white border-2 border-indigo-100 rounded-xl shadow-sm flex items-center justify-center"
                    style={{ backfaceVisibility: 'hidden' }}>
                    <div className="text-4xl font-mono font-bold text-indigo-600">
                        {a} × {b}
                    </div>
                    <div className="absolute bottom-2 text-xs text-gray-400 font-bold uppercase tracking-widest">Tap to Flip</div>
                </div>

                {/* Back (Answer + Visual) */}
                <div className="absolute inset-0 backface-hidden bg-indigo-600 border-2 border-indigo-500 rounded-xl shadow-md flex items-center justify-between px-6 text-white rotate-y-180"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>

                    {/* Number */}
                    <div className="text-5xl font-bold">{answer}</div>

                    {/* Mini Visual (Groups) */}
                    <div className="flex flex-col gap-1">
                        {Array.from({ length: a }).map((_, row) => (
                            <div key={row} className="flex gap-1 justify-end">
                                {Array.from({ length: b }).map((_, col) => (
                                    <div key={col} className="w-2 h-2 bg-yellow-400 rounded-full" />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TimesTableExplorerVisual = ({ question: _ }: { question: any }) => {
    const [selectedTable, setSelectedTable] = useState<number | null>(null);

    // Selection View
    if (selectedTable === null) {
        return (
            <div className="flex flex-col items-center w-full max-w-lg mx-auto">
                <div className="text-xl font-bold text-gray-700 mb-6 text-center">
                    Which Times Table<br />do you want to learn?
                </div>

                <div className="grid grid-cols-3 gap-4 w-full px-4">
                    {Array.from({ length: 11 }, (_, i) => i + 2).map((num) => (
                        <button
                            key={num}
                            onClick={() => setSelectedTable(num)}
                            className="aspect-square bg-white rounded-2xl shadow-sm border-b-4 border-indigo-100 active:border-b-0 active:translate-y-1 hover:bg-indigo-50 transition-all flex items-center justify-center"
                        >
                            <span className="text-3xl font-bold text-indigo-600">{num}x</span>
                        </button>
                    ))}
                </div>

                <div className="mt-8 text-sm text-gray-400 font-medium">
                    Pick a number to see patterns!
                </div>
            </div>
        );
    }

    // Learning View (Interactive Scroll)
    return (
        <div className="flex flex-col items-center w-full h-[60vh]">
            {/* Header */}
            <div className="flex items-center justify-between w-full px-4 mb-4">
                <button
                    onClick={() => setSelectedTable(null)}
                    className="text-sm font-bold text-gray-400 hover:text-indigo-600 flex items-center gap-1"
                >
                    ← Back
                </button>
                <div className="text-xl font-bold text-indigo-900">
                    The {selectedTable}'s
                </div>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            {/* Scrollable Card List */}
            <div className="flex-1 w-full overflow-y-auto px-4 pb-20 space-y-3 mask-image-b">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((multiplier) => (
                    <FlipCard key={multiplier} a={selectedTable} b={multiplier} />
                ))}

                <div className="h-8" />
                <div className="text-center text-sm text-gray-400 mb-4">
                    Great job! Do you know them all?
                </div>
                {/* Note: The 'Start Quiz' action is effectively determined by the main game loop 'options' 
                    displayed below this visual area. The user can interact here as long as they want. */}
            </div>
        </div>
    );
};

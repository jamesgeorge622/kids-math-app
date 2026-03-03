import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

interface GraphTypeInfo {
    title: string;
    description: string;
    example: React.ReactNode;
    usage: string;
}

export const GraphLearningModal = ({ onClose }: { onClose: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Static SVG Examples
    const BarExample = () => (
        <svg viewBox="0 0 200 150" className="w-full h-48">
            <line x1="20" y1="130" x2="180" y2="130" stroke="#9CA3AF" strokeWidth="2" />
            <line x1="20" y1="10" x2="20" y2="130" stroke="#9CA3AF" strokeWidth="2" />
            <rect x="40" y="80" width="30" height="50" fill="#F87171" />
            <rect x="90" y="40" width="30" height="90" fill="#60A5FA" />
            <rect x="140" y="60" width="30" height="70" fill="#34D399" />
        </svg>
    );

    const PieExample = () => (
        <svg viewBox="0 0 200 150" className="w-full h-48">
            <circle cx="100" cy="75" r="50" fill="#F87171" />
            <path d="M100,75 L100,25 A50,50 0 0,1 143,100 Z" fill="#60A5FA" />
            <path d="M100,75 L143,100 A50,50 0 0,1 57,100 Z" fill="#34D399" />
        </svg>
    );

    const LineExample = () => (
        <svg viewBox="0 0 200 150" className="w-full h-48">
            <line x1="20" y1="130" x2="180" y2="130" stroke="#9CA3AF" strokeWidth="2" />
            <line x1="20" y1="10" x2="20" y2="130" stroke="#9CA3AF" strokeWidth="2" />
            <polyline points="30,110 70,80 110,90 150,40" fill="none" stroke="#8B5CF6" strokeWidth="3" />
            <circle cx="30" cy="110" r="3" fill="#8B5CF6" />
            <circle cx="70" cy="80" r="3" fill="#8B5CF6" />
            <circle cx="110" cy="90" r="3" fill="#8B5CF6" />
            <circle cx="150" cy="40" r="3" fill="#8B5CF6" />
        </svg>
    );

    const PictographExample = () => (
        <div className="flex flex-col gap-2 p-4 h-48 justify-center">
            <div className="flex items-center gap-2">
                <span className="w-16 font-bold text-xs text-right">Apples</span>
                <div className="flex text-xl">🍎🍎🍎</div>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-16 font-bold text-xs text-right">Bananas</span>
                <div className="flex text-xl">🍌🍌</div>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-16 font-bold text-xs text-right">Oranges</span>
                <div className="flex text-xl">🍊🍊🍊🍊</div>
            </div>
        </div>
    );

    const graphs: GraphTypeInfo[] = [
        {
            title: "Bar Graphs",
            description: "Bars show us how much of something we have. Taller bars mean more!",
            usage: "Best for: Comparing groups.",
            example: <BarExample />
        },
        {
            title: "Pie Charts",
            description: "A pie chart is a circle cut into slices. Bigger slices mean bigger parts of the whole.",
            usage: "Best for: Seeing parts of a whole.",
            example: <PieExample />
        },
        {
            title: "Line Graphs",
            description: "Lines connect dots to show how things change usually over time.",
            usage: "Best for: Seeing changes over time.",
            example: <LineExample />
        },
        {
            title: "Pictographs",
            description: "Pictures are used instead of bars. Each picture counts as 1 (or more) item!",
            usage: "Best for: Fun counting!",
            example: <PictographExample />
        }
    ];

    const current = graphs[currentIndex];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col h-[600px] max-h-[90vh]">
                {/* Header */}
                <div className="bg-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
                    <span className="font-bold text-xl flex items-center gap-2">
                        📊 Learn About Graphs
                    </span>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
                    <h2 className="text-3xl font-black text-indigo-800 mb-2">{current.title}</h2>
                    <div className="w-full bg-slate-50 rounded-2xl border-2 border-slate-100 mb-6 flex items-center justify-center overflow-hidden">
                        {current.example}
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-xl w-full mb-4">
                        <p className="text-indigo-900 font-medium text-lg text-center leading-relaxed">
                            {current.description}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 font-bold uppercase tracking-wider">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Usage</span>
                        {current.usage}
                    </div>
                </div>

                {/* Footer / Nav */}
                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                    <button
                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-md active:scale-95 text-gray-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Prev
                    </button>

                    <div className="flex gap-2">
                        {graphs.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-indigo-600 scale-125' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentIndex(prev => Math.min(graphs.length - 1, prev + 1))}
                        disabled={currentIndex === graphs.length - 1}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-md active:scale-95 text-indigo-600"
                    >
                        Next
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};


export const BalanceScaleVisual = ({ question }: { question: any }) => {
    const { left, right } = question.visual;
    const isBalanced = left.weight === right.weight;
    const isLeftHeavy = left.weight > right.weight;

    // Rotation logic
    const rotation = isBalanced ? 0 : isLeftHeavy ? -15 : 15;

    return (
        <div className="flex flex-col items-center mb-12 mt-8">
            <div className="relative w-64 h-40">
                {/* Base Stand */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-32 bg-gray-700 rounded-t-lg"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gray-800 rounded-full"></div>

                {/* The Beam (Rotates) */}
                <div
                    className="absolute top-4 left-0 w-full h-2 bg-gray-600 rounded-full origin-center transition-transform duration-1000 ease-in-out"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    {/* Left Pan */}
                    <div className="absolute left-0 top-1 w-20 h-20 flex flex-col items-center">
                        {/* String */}
                        <div className="w-0.5 h-12 bg-gray-400"></div>
                        {/* Pan */}
                        <div className="w-20 h-8 border-b-4 border-l-2 border-r-2 border-gray-400 rounded-b-3xl bg-gray-100/50 flex items-center justify-center transform hover:scale-110 transition-transform">
                            <span className="text-4xl filter drop-shadow-lg -mt-8">{left.emoji}</span>
                        </div>
                        <div className="mt-1 text-xs font-bold bg-white/80 px-2 rounded-full">{left.name}</div>
                    </div>

                    {/* Right Pan */}
                    <div className="absolute right-0 top-1 w-20 h-20 flex flex-col items-center">
                        {/* String */}
                        <div className="w-0.5 h-12 bg-gray-400"></div>
                        {/* Pan */}
                        <div className="w-20 h-8 border-b-4 border-l-2 border-r-2 border-gray-400 rounded-b-3xl bg-gray-100/50 flex items-center justify-center transform hover:scale-110 transition-transform">
                            <span className="text-4xl filter drop-shadow-lg -mt-8">{right.emoji}</span>
                        </div>
                        <div className="mt-1 text-xs font-bold bg-white/80 px-2 rounded-full">{right.name}</div>
                    </div>

                    {/* Pivot */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                </div>
            </div>

            <div className="mt-8 text-center bg-blue-50 px-4 py-2 rounded-xl text-blue-800 font-medium">
                {isBalanced ? "It's balanced!" : (isLeftHeavy ? "Left is heavier!" : "Right is heavier!")}
            </div>
        </div>
    );
};

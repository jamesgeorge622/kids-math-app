

export const ShapeIcon = ({ shape, size = "w-16 h-16" }: { shape: string, size?: string }) => {
    const s = shape.toLowerCase();

    // Generic Question Mark for the prompt
    if (s === 'question' || s === 'search') {
        return <div className={`${size} bg-gray-100 rounded-full flex items-center justify-center text-4xl border-2 border-dashed border-gray-300`}>❓</div>;
    }

    return (
        <div className={`
            transition-all duration-300
            ${s.includes('circle') ? `${size} rounded-full bg-red-400` : ''}
            ${s.includes('square') ? `${size} bg-blue-400 rounded-lg` : ''}
            ${s.includes('rectangle') ? 'w-24 h-16 bg-green-400 rounded-lg' : ''} 
            ${s.includes('triangle') ? 'w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[52px] border-b-yellow-400' : ''}
            ${/* Fallback */ !['circle', 'square', 'rectangle', 'triangle'].some(k => s.includes(k)) ? `${size} bg-purple-200 rounded-xl flex items-center justify-center` : ''}
        `}>
            {/* Custom sizing adjustment for Triangle since it uses borders */}
            {/* If generic fallback, show text */}
            {!['circle', 'square', 'rectangle', 'triangle', 'question', 'search'].some(k => s.includes(k)) && (
                <span className="text-xs font-bold text-purple-700 capitalize p-1">{s}</span>
            )}
        </div>
    );
};

export const ShapeVisual = ({ question }: { question: any }) => {
    // P0 FIX: Derive target for pre-readers (check visual, then explanation)
    let targetShape: string | null = null;
    if (typeof question.visual === 'string') {
        targetShape = question.visual;
    } else if (question.visual && question.visual.value) {
        targetShape = question.visual.value;
    }

    if (!targetShape) return null; // Safe fallback

    // If it's a "question" visual (generic prompt), use that.
    // Otherwise render the specific shape (e.g. if we went back to "What shape is this?")

    return (
        <div className="flex justify-center mb-8">
            {/* For main visual, use larger size */}
            <ShapeIcon shape={targetShape} size="w-48 h-48" />
        </div>
    )
};

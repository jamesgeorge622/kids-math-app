

export const CountingVisual = ({ question }: { question: any }) => {
    // Contract: visual.kind === 'emojiRow'
    const items = question.visual.items || (Array.isArray(question.visual) ? question.visual : []);
    const totalItems = items.length;

    // Group items into chunks of 10 (Ten Frames concept)
    const groups = [];
    for (let i = 0; i < totalItems; i += 10) {
        groups.push(items.slice(i, i + 10));
    }

    // Dynamic sizing based on total count to ensure everything fits well
    const getItemSize = () => {
        if (totalItems > 50) return 'text-2xl';
        if (totalItems > 20) return 'text-3xl';
        return 'text-5xl';
    };

    const itemSize = getItemSize();

    return (
        <div className="flex flex-col items-center gap-4 mb-8 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6">
                {groups.map((group, groupIndex) => (
                    <div
                        key={groupIndex}
                        className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-2 flex flex-wrap gap-1 justify-center w-fit max-w-[300px]"
                    >
                        {group.map((obj: string, i: number) => (
                            <div key={i} className={`${itemSize} transition-all hover:scale-110`}>
                                {obj}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};



interface DivisionGroupingVisualProps {
    data: {
        total: number;
        groupSize: number;
        item: string;
    }
}

export const DivisionGroupingVisual = ({ data }: DivisionGroupingVisualProps) => {
    const { total, groupSize, item } = data;
    const groupCount = Math.ceil(total / groupSize);

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
            <div className="flex flex-wrap justify-center gap-8 p-8">
                {Array.from({ length: groupCount }).map((_, groupIndex) => (
                    <div
                        key={groupIndex}
                        className="relative p-6 border-4 border-dashed border-indigo-400 rounded-3xl bg-indigo-50/50"
                    >
                        {/* Group Label */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                            Group {groupIndex + 1}
                        </div>

                        {/* Items */}
                        <div className="flex gap-2">
                            {Array.from({ length: groupSize }).map((_, i) => (
                                <span key={i} className="text-4xl filter drop-shadow-sm">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-200 text-center">
                <p className="text-lg text-gray-600">
                    We found <strong className="text-indigo-600">{groupCount}</strong> groups of <strong className="text-indigo-600">{groupSize}</strong>
                </p>
                <div className="text-sm text-gray-400 mt-1">
                    Total: {total} items
                </div>
            </div>
        </div>
    );
};

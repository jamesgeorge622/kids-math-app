

export const MultiplicationVisual = ({ question }: { question: any }) => {
    if (!question.visual.groups) return null;

    return (
        <div className="mb-8">
            <div className="space-y-3">
                {Array(question.visual.groups).fill(null).map((_, groupIndex) => (
                    <div key={groupIndex} className="flex justify-center gap-2">
                        {Array(question.visual.perGroup).fill('🔷').map((obj, i) => (
                            <div key={i} className="text-3xl">{obj}</div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

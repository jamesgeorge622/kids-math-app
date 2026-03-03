export const DecimalGridVisual = ({ data }: { data: { whole: number; decimal: number } }) => {
    const { whole, decimal } = data;

    // Convert decimal part (e.g. 0.75) to hundredths (75)
    // Careful with float precision: 0.75 * 100 might be 75.000000001
    const hundredths = Math.round(decimal * 100);

    const renderGrid = (filledCount: number, isLabelled: boolean) => (
        <div className="flex flex-col items-center gap-2">
            <div className="grid grid-cols-10 gap-px bg-gray-200 p-1 rounded-lg border-2 border-gray-300">
                {Array.from({ length: 100 }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded-[1px] ${i < filledCount ? 'bg-indigo-500' : 'bg-white'
                            }`}
                    />
                ))}
            </div>
            {isLabelled && filledCount < 100 && filledCount > 0 && (
                <div className="text-sm font-bold text-indigo-600">
                    .{filledCount}
                </div>
            )}
            {filledCount === 100 && (
                <div className="text-xl font-bold text-gray-700">1</div>
            )}
        </div>
    );

    return (
        <div className="flex flex-wrap justify-center items-end gap-4 p-4">
            {/* Render full grids for whole number */}
            {Array.from({ length: whole }).map((_, i) => (
                <div key={`whole-${i}`} className="animate-fade-in">
                    {renderGrid(100, false)}
                </div>
            ))}

            {/* Render partial grid for decimal part if exists */}
            {hundredths > 0 && (
                <div className="animate-fade-in delay-100">
                    {renderGrid(hundredths, true)}
                </div>
            )}

            {whole === 0 && hundredths === 0 && (
                <div className="text-4xl text-gray-300 font-bold">0</div>
            )}
        </div>
    );
};



export const MoneyVisual = ({ question }: { question: any }) => {
    // P0 FIX: Defensive guard against missing/invalid visual data
    if (!question.visual) return null;

    let coinType = 'coin';
    let numCoins = 0;

    if (Array.isArray(question.visual)) {
        // Handle legacy array format
        numCoins = question.visual.length;
        if (numCoins > 0 && typeof question.visual[0] === 'string') {
            // Try to guess coin type from first element if it's a string like "penny"
            // This is a best-effort fallback for array data
            coinType = question.visual[0].replace(/[0-9]/g, '').trim() || 'coin';
        }
    } else if (typeof question.visual === 'object') {
        // Handle structured object format { coin, count }
        coinType = question.visual.coin || 'coin';
        numCoins = question.visual.count || 1;
    } else {
        // unexpected format
        return null;
    }


    const getCoinStyle = (c: string) => {
        const type = c.toLowerCase();

        // USD
        if (type.includes('quarter')) return {
            bg: 'bg-gradient-to-br from-gray-200 to-gray-400',
            size: 'w-24 h-24',
            text: '25¢',
            border: 'border-gray-300',
            inner: 'border-dashed border-gray-400'
        };
        if (type.includes('dime')) return {
            bg: 'bg-gradient-to-br from-gray-200 to-gray-300',
            size: 'w-16 h-16',
            text: '10¢',
            border: 'border-gray-300',
            inner: 'border-gray-400'
        };
        if (type.includes('nickel')) return {
            bg: 'bg-gradient-to-br from-gray-300 to-gray-400',
            size: 'w-20 h-20',
            text: '5¢',
            border: 'border-gray-400',
            inner: 'border-gray-500'
        };
        if (type.includes('penny')) return {
            bg: 'bg-gradient-to-br from-amber-600 to-amber-700',
            size: 'w-16 h-16',
            text: '1¢',
            textColor: 'text-amber-100',
            border: 'border-amber-800',
            inner: 'border-amber-900'
        };

        // EURO
        // Copper coins (1c, 2c, 5c)
        if (['1 cent', '2 cent', '5 cent'].some(v => type.startsWith(v))) {
            const value = type.split(' ')[0];
            return {
                bg: 'bg-gradient-to-br from-orange-400 to-red-400',
                size: value === '5' ? 'w-20 h-20' : value === '2' ? 'w-18 h-18' : 'w-16 h-16',
                text: `${value}c`,
                textColor: 'text-white',
                border: 'border-red-500',
                inner: 'border-red-300'
            };
        }
        // Nordic Gold coins (10c, 20c, 50c)
        if (['10 cent', '20 cent', '50 cent'].some(v => type.startsWith(v))) {
            const value = type.split(' ')[0];
            const is20 = value === '20';
            return {
                bg: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600',
                size: value === '50' ? 'w-24 h-24' : value === '20' ? 'w-22 h-22' : 'w-20 h-20',
                text: `${value}c`,
                textColor: 'text-yellow-900',
                border: 'border-yellow-600',
                inner: 'border-yellow-200',
                customClass: is20 ? 'rounded-[30px]' : 'rounded-full' // Slight attempt at flower shape for 20c
            };
        }

        return { bg: 'bg-gray-100', size: 'w-20 h-20', text: '?', border: 'border-gray-300' };
    };

    const style = getCoinStyle(coinType);

    return (
        <div className="flex flex-col items-center mb-8">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
                {Array(numCoins).fill(null).map((_, i) => (
                    <div
                        key={i}
                        className={`
                            ${style.size} ${style.bg} ${style.customClass || 'rounded-full'} border-4 ${style.border} 
                            flex items-center justify-center shadow-lg transform hover:-translate-y-1 transition-transform relative
                        `}
                    >
                        <div className={`absolute inset-1 ${style.customClass || 'rounded-full'} border-2 ${style.inner} opacity-50`}></div>
                        <span className={`font-bold text-xl md:text-2xl ${style.textColor || 'text-gray-700'} z-10`}>
                            {style.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

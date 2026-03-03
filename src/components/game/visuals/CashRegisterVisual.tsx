

export const CashRegisterVisual = ({ data }: { data: { price: number; paid: number; item: string; currency: 'USD' | 'EUR' } }) => {
    const { price, paid, item, currency } = data;

    const formatMoney = (amount: number) => {
        if (currency === 'USD') return `$${(amount / 100).toFixed(2)}`;
        return `€${(amount / 100).toFixed(2)}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 w-full max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4">

            {/* Main Visual Row */}
            <div className="flex items-center justify-between w-full gap-4 relative">

                {/* 1. Price / Item */}
                <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg border-2 border-slate-200 transform -rotate-2 relative z-10 w-32 sm:w-40">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">PRICE</div>
                    <div className="text-4xl sm:text-5xl mb-2 filter drop-shadow-sm">{item}</div>
                    <div className="text-xl sm:text-2xl font-black text-slate-800 font-mono tracking-tight">{formatMoney(price)}</div>
                </div>

                {/* Arrow / Gap Visual (The Core Concept) */}
                <div className="flex-1 flex flex-col items-center justify-center relative -mt-4">
                    <div className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">ADD CHANGE</div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mb-2 relative">
                        {/* Animated Arrow Head */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 border-l-8 border-l-gray-300 border-y-8 border-y-transparent transform translate-x-1"></div>
                    </div>
                    <div className="bg-indigo-600 text-white font-bold text-lg sm:text-xl rounded-lg px-4 py-1.5 shadow-md flex items-center gap-2 animate-pulse">
                        <span>+</span>
                        <span>?</span>
                    </div>
                </div>

                {/* 2. Paid / Wallet */}
                <div className="flex flex-col items-center bg-green-50 p-4 rounded-xl shadow-lg border-2 border-green-200 transform rotate-2 relative z-10 w-32 sm:w-40">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">PAID</div>
                    <div className="text-4xl sm:text-5xl mb-2 opacity-90">💵</div>
                    <div className="text-xl sm:text-2xl font-black text-green-800 font-mono tracking-tight">{formatMoney(paid)}</div>
                </div>

            </div>

            {/* Logical Helper (Number Sentence) */}
            <div className="mt-8 bg-slate-100/80 rounded-2xl px-6 py-3 border border-slate-200 shadow-sm flex items-center gap-3 text-lg sm:text-xl font-mono text-slate-600">
                <span className="font-bold">{formatMoney(price)}</span>
                <span className="text-gray-400">+</span>
                <span className="bg-white px-2 py-1 rounded border border-gray-300 text-indigo-600 font-bold min-w-[3ch] text-center">?</span>
                <span className="text-gray-400">=</span>
                <span className="font-bold text-green-700">{formatMoney(paid)}</span>
            </div>

        </div>
    );
};

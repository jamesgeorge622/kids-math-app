import React from 'react';
import { X, DollarSign } from 'lucide-react';

interface CoinGuideModalProps {
    onClose: () => void;
    currency: 'USD' | 'EUR';
}

export const CoinGuideModal: React.FC<CoinGuideModalProps> = ({ onClose, currency }) => {

    // Reusing the style logic for consistency
    const getCoinStyle = (type: string) => {
        // USD
        if (type === 'quarter') return {
            bg: 'bg-gradient-to-br from-gray-200 to-gray-400',
            size: 'w-16 h-16',
            text: '25¢',
            border: 'border-gray-300',
            inner: 'border-dashed border-gray-400'
        };
        if (type === 'dime') return {
            bg: 'bg-gradient-to-br from-gray-200 to-gray-300',
            size: 'w-12 h-12',
            text: '10¢',
            border: 'border-gray-300',
            inner: 'border-gray-400'
        };
        if (type === 'nickel') return {
            bg: 'bg-gradient-to-br from-gray-300 to-gray-400',
            size: 'w-14 h-14',
            text: '5¢',
            border: 'border-gray-400',
            inner: 'border-gray-500'
        };
        if (type === 'penny') return {
            bg: 'bg-gradient-to-br from-amber-600 to-amber-700',
            size: 'w-12 h-12',
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
                size: value === '5' ? 'w-14 h-14' : value === '2' ? 'w-13 h-13' : 'w-12 h-12',
                text: `${value}c`,
                textColor: 'text-white',
                border: 'border-red-500',
                inner: 'border-red-300'
            };
        }
        // Nordic Gold coins (10c, 20c, 50c)
        if (['10 cent', '20 cent', '50 cent'].some(v => type.startsWith(v))) {
            const value = type.split(' ')[0];
            return {
                bg: 'bg-gradient-to-br from-yellow-300 to-yellow-500',
                size: value === '50' ? 'w-16 h-16' : value === '20' ? 'w-15 h-15' : 'w-14 h-14',
                text: `${value}c`,
                textColor: 'text-yellow-900',
                border: 'border-yellow-600',
                inner: 'border-yellow-200'
            };
        }

        return { bg: 'bg-gray-100', size: 'w-12 h-12', text: '?', border: 'border-gray-300' };
    };

    const CoinDisplay = ({ type, name, facts }: { type: string, name: string, facts: string[] }) => {
        const style = getCoinStyle(type);
        return (
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className={`
                    ${style.size} ${style.bg} rounded-full border-4 ${style.border} 
                    flex items-center justify-center shadow-md transform hover:scale-110 transition-transform relative flex-shrink-0
                `}>
                    <div className={`absolute inset-1 rounded-full border-2 ${style.inner} opacity-50`}></div>
                    <span className={`font-bold text-lg ${style.textColor || 'text-gray-700'} z-10`}>
                        {style.text}
                    </span>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-800 capitalize">{name}</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        {facts.map((fact, i) => (
                            <li key={i}>• {fact}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl flex flex-col">

                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6 rounded-t-3xl relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-all text-white"
                        aria-label="Close Guide"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                            <DollarSign className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-wide">Money Guide</h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto">

                    {/* Definitions */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-2">What is Money?</h3>
                        <p className="text-blue-700 mb-2">
                            Money (or <strong>Currency</strong>) is what we use to buy things like toys, food, and clothes!
                        </p>
                        {currency === 'USD' ? (
                            <>
                                <p className="text-blue-700">
                                    In the USA 🇺🇸, we use <strong>Dollars ($)</strong> and smaller parts called <strong>Cents (¢)</strong>.
                                </p>
                                <div className="mt-3 bg-white p-3 rounded-lg text-center font-bold text-blue-600 border border-blue-200">
                                    100 Cents = 1 Dollar ($1.00)
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-blue-700">
                                    In Europe 🇪🇺, many countries use the <strong>Euro (€)</strong>. Just like dollars, 100 <strong>cents</strong> make 1 Euro!
                                </p>
                                <div className="mt-3 bg-white p-3 rounded-lg text-center font-bold text-blue-600 border border-blue-200">
                                    100 Cents = 1 Euro (€1.00)
                                </div>
                            </>
                        )}
                    </div>

                    {/* USD Section */}
                    {currency === 'USD' && (
                        <div className="border-b pb-6">
                            <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
                                🇺🇸 US Dollars
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <CoinDisplay
                                    type="penny"
                                    name="Penny (1¢)"
                                    facts={['Copper color', 'Smallest value', '100 pennies = $1']}
                                />
                                <CoinDisplay
                                    type="nickel"
                                    name="Nickel (5¢)"
                                    facts={['Silver color', 'Smooth edge', '20 nickels = $1']}
                                />
                                <CoinDisplay
                                    type="dime"
                                    name="Dime (10¢)"
                                    facts={['Smallest silver coin', 'Thin and light', '10 dimes = $1']}
                                />
                                <CoinDisplay
                                    type="quarter"
                                    name="Quarter (25¢)"
                                    facts={['Biggest coin here', 'Silver color', '4 quarters = $1']}
                                />
                            </div>
                        </div>
                    )}

                    {/* EURO Section */}
                    {currency === 'EUR' && (
                        <div>
                            <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                                🇪🇺 Euro
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CoinDisplay
                                    type="1 cent"
                                    name="1 Cent"
                                    facts={['Copper color', 'Smallest coin', '100 cents = €1']}
                                />
                                <CoinDisplay
                                    type="2 cent"
                                    name="2 Cents"
                                    facts={['Copper color', 'Thinking line', '50 of these = €1']}
                                />
                                <CoinDisplay
                                    type="5 cent"
                                    name="5 Cents"
                                    facts={['Copper color', 'Biggest copper coin', '20 of these = €1']}
                                />
                                <CoinDisplay
                                    type="10 cent"
                                    name="10 Cents"
                                    facts={['Gold color', 'Scalloped edge', '10 of these = €1']}
                                />
                                <CoinDisplay
                                    type="20 cent"
                                    name="20 Cents"
                                    facts={['Gold color', 'Flower shape indent', '5 of these = €1']}
                                />
                                <CoinDisplay
                                    type="50 cent"
                                    name="50 Cents"
                                    facts={['Gold color', 'Biggest gold coin', '2 of these = €1']}
                                />
                            </div>
                        </div>
                    )}

                    {/* Fun Facts / Conversions */}
                    <div className="bg-green-50 p-6 rounded-xl border-dashed border-2 border-green-200 text-center">
                        {currency === 'USD' ? (
                            <>
                                <h3 className="font-bold text-green-800 mb-4 text-xl">How to make a Dollar? 💵</h3>
                                <div className="flex flex-wrap justify-center gap-4 text-green-700 font-medium">
                                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">100 Pennies</div>
                                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">20 Nickels</div>
                                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">10 Dimes</div>
                                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">4 Quarters</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="font-bold text-green-800 mb-4 text-xl">How to make a Euro? 💶</h3>
                                <div className="flex flex-wrap justify-center gap-4 text-green-700 font-medium">
                                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">100 Cent Coins</div>
                                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">20 "5 Cent" Coins</div>
                                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">10 "10 Cent" Coins</div>
                                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">2 "50 Cent" Coins</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform"
                    >
                        I'm Ready to Play!
                    </button>
                </div>

            </div>
        </div>
    );
};

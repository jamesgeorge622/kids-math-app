
import React, { useState } from 'react';
import { db } from '../../services/db';
import { Kid } from '../../types';
import {
    getPetEmoji, getPetStageName, getLevelProgress,
    FOOD_ITEMS, canBuyFood
} from '../../utils/gamification';
import { Zap, Heart, Star, Lock } from 'lucide-react';

interface PetInteractionViewProps {
    kid: Kid;
    onUpdate: () => void; // Trigger refresh
}

export const PetInteractionView: React.FC<PetInteractionViewProps> = ({ kid, onUpdate }) => {
    const [eating, setEating] = useState(false);
    const [lastFedItem, setLastFedItem] = useState<string>('');

    const pet = kid.pet || { type: 'dragon', stage: 1, xp: 0, level: 1, accessories: [], lastInteraction: 0 };
    const progress = getLevelProgress(kid.total_xp);
    const { timeLeft } = db.canPlayToday(kid);

    const handleFeed = (item: typeof FOOD_ITEMS[number]) => {
        if (!canBuyFood(kid.coins, pet.level, item)) return;

        const success = db.purchaseItem(kid.id, item.cost, item.xp);
        if (success) {
            setLastFedItem(item.emoji);
            setEating(true);
            setTimeout(() => setEating(false), 2000); // Animation duration
            onUpdate();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">

            {/* Pet Animation/Display */}
            <div className="relative mb-8">
                <div className={`text-9xl transition-transform duration-500 ${eating ? 'scale-125' : 'animate-bounce-slow'}`}>
                    {getPetEmoji(pet.type, pet.stage)}
                </div>
                {eating && (
                    <div className="absolute top-0 right-0 animate-ping text-6xl">
                        {lastFedItem}
                    </div>
                )}
                {eating && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-pink-500 animate-bounce">
                        <Heart className="w-12 h-12 fill-current" />
                    </div>
                )}
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2 capitalize">
                {pet.type} {getPetStageName(pet.stage)}
            </h2>
            <p className="text-gray-500 mb-8">Level {pet.level}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-12">
                {/* XP Progress Bar */}
                <div className="bg-purple-100 p-4 rounded-xl flex flex-col justify-center relative overflow-hidden shadow-sm">
                    <div className="flex justify-between items-center mb-1 z-10 relative">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-purple-600 fill-current" />
                            <span className="font-bold text-purple-800 text-sm">Level {progress.level}</span>
                        </div>
                        <span className="text-xs font-bold text-purple-600">
                            {progress.currentLevelXp} / {progress.requiredXp} XP
                        </span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-4 z-10 relative">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${progress.percent}%` }}
                        />
                    </div>
                </div>

                {/* Coins & Streak (Compact) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-yellow-100 p-4 rounded-xl flex flex-col items-center justify-center shadow-sm">
                        <span className="text-2xl mb-1">🪙</span>
                        <span className="font-bold text-yellow-800">{kid.coins}</span>
                        <span className="text-xs text-yellow-600">Coins</span>
                    </div>
                    <div className="bg-pink-100 p-4 rounded-xl flex flex-col items-center justify-center shadow-sm">
                        <Zap className="w-6 h-6 text-pink-500 mb-1 fill-current" />
                        <span className="font-bold text-pink-800">{kid.streak}</span>
                        <span className="text-xs text-pink-600">Streak</span>
                    </div>
                </div>

                {/* Energy Bar (Full Width on Mobile or separate logic) 
                    Actually let's keep it in the grid.
                */}
                <div className={`col-span-1 md:col-span-2 p-4 rounded-xl flex flex-col justify-center relative overflow-hidden shadow-sm border-2 ${timeLeft > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200'
                    }`}>
                    <div className="flex justify-between items-center mb-1 z-10 relative">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{timeLeft > 0 ? '🔋' : '💤'}</span>
                            <span className={`font-bold text-sm ${timeLeft > 0 ? 'text-green-800' : 'text-gray-500'}`}>
                                Energy
                            </span>
                        </div>
                        <span className={`text-xs font-bold ${timeLeft > 0 ? 'text-green-700' : 'text-gray-500'}`}>
                            {Math.ceil(timeLeft / 60)}m left
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 z-10 relative">
                        <div
                            className={`h-4 rounded-full transition-all duration-500 ${timeLeft > 180 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-red-500 to-orange-500 animate-pulse'
                                }`}
                            style={{ width: `${Math.min(100, (timeLeft / 900) * 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Food Store */}
            <div className="w-full max-w-3xl bg-white rounded-3xl p-6 shadow-xl border-4 border-orange-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-3xl">🏪</span> Pet Store
                    </h3>
                    <div className="bg-yellow-100 px-4 py-2 rounded-full font-bold text-yellow-700">
                        Balance: {kid.coins} 🪙
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {FOOD_ITEMS.map((item) => {
                        const locked = pet.level < item.minLevel;
                        const affordable = kid.coins >= item.cost;
                        const [shake, setShake] = useState(false);

                        const handleClick = () => {
                            if (locked || !affordable) {
                                setShake(true);
                                setTimeout(() => setShake(false), 500);
                                return;
                            }
                            handleFeed(item);
                        };

                        return (
                            <button
                                key={item.id}
                                onClick={handleClick}
                                className={`relative p-4 rounded-2xl border-2 transition-all ${shake ? 'animate-shake' : ''
                                    } ${locked
                                        ? 'bg-gray-50 border-gray-200 opacity-75'
                                        : affordable
                                            ? 'bg-orange-50 border-orange-200 hover:bg-orange-100 hover:scale-105 hover:shadow-md'
                                            : 'bg-white border-gray-200 opacity-50'
                                    }`}
                            >
                                {locked && (
                                    <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center text-gray-500 z-10">
                                        <Lock className="w-6 h-6 mb-1" />
                                        <span className="text-xs font-bold">Lvl {item.minLevel}</span>
                                    </div>
                                )}

                                <div className="text-5xl mb-2">{item.emoji}</div>
                                <div className="font-bold text-gray-800">{item.name}</div>
                                <div className="text-orange-600 font-bold text-sm">+{item.xp} XP</div>
                                <div className={`text-sm font-bold mt-2 px-3 py-1 rounded-full inline-block ${affordable ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {item.cost} 🪙
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


import React, { useState } from 'react';
import { db } from '../../services/db';
import { Kid } from '../../types';
import { ArrowRight, Check } from 'lucide-react';

interface PetSelectionScreenProps {
    kid: Kid;
    onComplete: (updatedKid: Kid) => void;
}

export const PetSelectionScreen: React.FC<PetSelectionScreenProps> = ({ kid, onComplete }) => {
    const [selectedType, setSelectedType] = useState<'dragon' | 'robot' | 'cat' | 'lion' | 'tiger' | 'panda' | 'fox' | 'koala' | 'frog' | 'unicorn' | 'octopus' | null>(null);

    const pets = [
        {
            type: 'lion', emoji: '🦁', name: 'Leono', desc: 'The King of the Jungle!', color: 'bg-yellow-100 border-yellow-300 text-yellow-600',
            evolution: '🥚 ➡️ 🦁 ➡️ 👑'
        },
        {
            type: 'tiger', emoji: '🐯', name: 'Stripes', desc: 'Fast, strong, and brave.', color: 'bg-orange-100 border-orange-300 text-orange-600',
            evolution: '🥚 ➡️ 🐯 ➡️ 🐅'
        },
        {
            type: 'panda', emoji: '🐼', name: 'Bamboo', desc: 'Chill, cuddly, and wise.', color: 'bg-gray-100 border-gray-300 text-gray-800',
            evolution: '🥚 ➡️ 🐼 ➡️ 🥋'
        },
        {
            type: 'fox', emoji: '🦊', name: 'Swift', desc: 'Clever and quick-witted.', color: 'bg-orange-50 border-orange-200 text-orange-500',
            evolution: '🥚 ➡️ 🦊 ➡️ 🌟'
        },
        {
            type: 'koala', emoji: '🐨', name: 'Koko', desc: 'Sleepy but super smart.', color: 'bg-gray-200 border-gray-400 text-gray-700',
            evolution: '🥚 ➡️ 🐨 ➡️ 👑'
        },
        {
            type: 'dragon', emoji: '🐲', name: 'Drago', desc: 'A fiery friend for adventures!', color: 'bg-red-100 border-red-300 text-red-600',
            evolution: '🥚 ➡️ 🐲 ➡️ 👑'
        },
        {
            type: 'robot', emoji: '🤖', name: 'Beep', desc: 'Powered by pure math logic.', color: 'bg-blue-100 border-blue-300 text-blue-600',
            evolution: '🔩 ➡️ 🤖 ➡️ 🚀'
        },
        {
            type: 'cat', emoji: '😺', name: 'Luna', desc: 'Magical and mysterious.', color: 'bg-purple-100 border-purple-300 text-purple-600',
            evolution: '🧶 ➡️ 😺 ➡️ 🦁'
        },
        {
            type: 'frog', emoji: '🐸', name: 'Hops', desc: 'Leaping towards learning!', color: 'bg-green-100 border-green-300 text-green-600',
            evolution: '🥚 ➡️ 🐸 ➡️ 👑'
        },
        {
            type: 'unicorn', emoji: '🦄', name: 'Sparkle', desc: 'Believes in magic numbers.', color: 'bg-pink-100 border-pink-300 text-pink-500',
            evolution: '🥚 ➡️ 🦄 ➡️ ✨'
        },
        {
            type: 'octopus', emoji: '🐙', name: 'Inky', desc: 'Multitasking math master.', color: 'bg-indigo-100 border-indigo-300 text-indigo-600',
            evolution: '🥚 ➡️ 🐙 ➡️ 👑'
        }
    ] as const;

    const handleConfirm = () => {
        if (!selectedType) return;

        // Create the pet object
        const newPet = {
            type: selectedType,
            stage: 1, // Egg logic handled by gamification util, but raw data is stage 1? 
            // Wait, util says getPetStage(level). We store Level.
            // Let's initialize consistent with util.
            xp: 0,
            level: 1,
            accessories: [],
            lastInteraction: Date.now()
        };

        // Update DB
        const updatedKid = { ...kid, pet: newPet };
        // We need a DB method to update a kid property properly.
        // Assuming db.updateKid exists or we treat objects as mutable in memory (db.getKid returns ref).
        // db.getKid returns direct ref from local cache.
        const ref = db.getKid(kid.id);
        if (ref) {
            ref.pet = newPet;
            db.save(); // Persist
        }

        onComplete(ref || updatedKid);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-6">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-4xl font-bold text-indigo-900 mb-2">Choose Your Companion</h1>
                <p className="text-xl text-indigo-600 mb-12">Who will join you on your math journey?</p>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {pets.map((pet) => (
                        <button
                            key={pet.type}
                            onClick={() => setSelectedType(pet.type)}
                            className={`relative rounded-3xl p-8 transition-all duration-300 transform hover:scale-105 ${selectedType === pet.type
                                ? 'bg-white ring-4 ring-indigo-400 shadow-2xl scale-105'
                                : 'bg-white/80 hover:bg-white shadow-lg border-2 border-transparent'
                                }`}
                        >
                            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-7xl mb-6 ${pet.color}`}>
                                {pet.emoji}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{pet.name}</h3>
                            <p className="text-gray-500 mb-4 h-12">{pet.desc}</p>

                            <div className="bg-gray-50 rounded-lg p-2 text-sm font-bold text-gray-400">
                                Evolves: {pet.evolution}
                            </div>

                            {selectedType === pet.type && (
                                <div className="absolute top-4 right-4 bg-indigo-500 text-white rounded-full p-1">
                                    <Check className="w-6 h-6" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="h-20">
                    {selectedType && (
                        <button
                            onClick={handleConfirm}
                            className="bg-indigo-600 text-white text-xl font-bold py-4 px-12 rounded-full shadow-xl hover:bg-indigo-700 transition-all animate-in fade-in slide-in-from-bottom-4 flex items-center gap-3 mx-auto"
                        >
                            Adopt Companion
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { Kid, MathTrack } from '../../types';

interface LevelConfigScreenProps {
    kid: Kid;
    track: MathTrack;
    onStart: (count: number) => void;
    onBack: () => void;
}

export const LevelConfigScreen: React.FC<LevelConfigScreenProps> = ({ kid, track, onStart, onBack }) => {
    const [questionCount, setQuestionCount] = useState(5);
    const mode = kid.age <= 7 ? 'A' : 'B';

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full">
                <div className="text-center mb-8">
                    <div className={`text-6xl w-20 h-20 bg-gradient-to-br ${track.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        {track.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{track.title}</h2>
                    <p className="text-gray-600">{track.description}</p>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                        {mode === 'A' ? 'How many questions?' : 'Choose your challenge!'}
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[5, 10, 15].map(count => (
                            <button
                                key={count}
                                onClick={() => setQuestionCount(count)}
                                className={`py-8 rounded-2xl text-center transition-all transform hover:scale-105 ${questionCount === count
                                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                            >
                                <div className="text-5xl font-bold mb-2">{count}</div>
                                <div className="text-sm font-semibold">
                                    {count === 5 ? 'Quick' : count === 10 ? 'Standard' : 'Challenge'}
                                </div>
                                <div className="text-xs opacity-75 mt-1">
                                    ~{Math.ceil(count * 1.5)} min
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onBack}
                        className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => onStart(questionCount)}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        Start Playing
                        <Play className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

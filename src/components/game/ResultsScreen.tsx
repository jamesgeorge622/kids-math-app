import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Kid, MathTrack } from '../../types';

interface ResultsScreenProps {
    kid: Kid;
    track: MathTrack;
    results: { correct: number; total: number; timeSpent: number };
    onContinue: () => void;
    onBack: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, onContinue, onBack }) => {
    const { correct, total, timeSpent } = results;
    const percentage = Math.round((correct / total) * 100);

    const getMessage = () => {
        if (percentage >= 90) return { emoji: '🌟', title: 'Amazing!', message: 'You\'re a superstar!' };
        if (percentage >= 70) return { emoji: '🎉', title: 'Great Job!', message: 'You\'re doing awesome!' };
        if (percentage >= 50) return { emoji: '👍', title: 'Good Work!', message: 'Keep practicing!' };
        return { emoji: '💪', title: 'Keep Going!', message: 'Practice makes perfect!' };
    };

    const msg = getMessage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full">
                <div className="text-center mb-8">
                    <div className="text-8xl mb-4">{msg.emoji}</div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">{msg.title}</h2>
                    <p className="text-xl text-gray-600">{msg.message}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-8">
                    <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">{correct}</div>
                            <div className="text-sm text-gray-600">Correct</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-red-600 mb-2">{total - correct}</div>
                            <div className="text-sm text-gray-600">Wrong</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-purple-600 mb-2">{percentage}%</div>
                            <div className="text-sm text-gray-600">Score</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{correct} of {total} correct</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>

                    <div className="text-center mt-6 text-sm text-gray-600">
                        <span>Time: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onBack}
                        className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                    >
                        Done
                    </button>
                    <button
                        onClick={onContinue}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        Play Again
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

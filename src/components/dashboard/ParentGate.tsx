import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

interface ParentGateProps {
    onPass: () => void;
    onCancel: () => void;
}

export const ParentGate: React.FC<ParentGateProps> = ({ onPass, onCancel }) => {
    const [answer, setAnswer] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [cooldown, setCooldown] = useState(0);

    const questions = [
        { q: '5 + 3 = ?', a: '8' },
        { q: '10 - 4 = ?', a: '6' },
        { q: '7 + 2 = ?', a: '9' },
        { q: '12 - 5 = ?', a: '7' }
    ];

    const [question] = useState(questions[Math.floor(Math.random() * questions.length)]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleSubmitClick = () => {
        if (answer === question.a) {
            onPass();
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            setAnswer('');

            if (newAttempts >= 3) {
                setCooldown(30);
                setAttempts(0);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full">
                <div className="text-center mb-6">
                    <Lock className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Parent Verification</h2>
                    <p className="text-gray-600">Please solve this to continue</p>
                </div>

                {cooldown > 0 ? (
                    <div className="text-center py-8">
                        <p className="text-red-600 font-semibold mb-2">Too many attempts</p>
                        <p className="text-gray-600">Please wait {cooldown} seconds</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-gray-800 mb-4">{question.q}</p>
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                className="w-32 px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                autoFocus
                            />
                        </div>

                        {attempts > 0 && (
                            <p className="text-sm text-red-600 text-center">
                                Incorrect. {3 - attempts} attempts remaining.
                            </p>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitClick}
                                className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

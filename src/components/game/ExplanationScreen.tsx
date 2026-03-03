import React from 'react';
import { Lightbulb, X, Star, Volume2, RotateCcw, ChevronRight, ArrowRight } from 'lucide-react';
import { Question } from '../../types';
import { MATH_CONCEPTS } from '../../data/concepts';

interface ExplanationScreenProps {
    question: Question;
    concept: string;
    mode: string;
    onTryAgain?: () => void;
    onContinue: () => void;
    isHelpMode?: boolean;
}

export const ExplanationScreen: React.FC<ExplanationScreenProps> = ({ question, concept, mode, onTryAgain, onContinue, isHelpMode = false }) => {
    const conceptData = MATH_CONCEPTS[concept];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
                {isHelpMode && (
                    <button
                        onClick={onContinue}
                        className="absolute top-4 right-4 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-all"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                )}

                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lightbulb className="w-10 h-10 text-yellow-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {isHelpMode ? 'Here to Help!' : 'Let\'s Learn!'}
                    </h2>
                    <p className="text-xl text-gray-600">{conceptData.title}</p>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                    <p className="text-lg text-gray-800 mb-4">{conceptData.explanation.intro}</p>
                    <p className="text-md text-gray-700 italic">{conceptData.explanation.visual}</p>
                </div>

                {/* Visual Explanation */}
                <div className="bg-purple-50 rounded-2xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Example: {question.question}</h3>

                    <div className="space-y-4">
                        {question.explanation?.steps?.map((step, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                    {i + 1}
                                </div>
                                <p className="text-lg text-gray-800 pt-1">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <Star className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-bold text-green-800 mb-1">Pro Tip!</p>
                            <p className="text-green-700">{conceptData.explanation.tip}</p>
                        </div>
                    </div>
                </div>

                {mode === 'A' && (
                    <div className="bg-yellow-50 rounded-2xl p-4 mb-6 flex items-center gap-3">
                        <Volume2 className="w-6 h-6 text-yellow-600" />
                        <p className="text-sm text-yellow-800">💡 In the full app, this explanation will be read aloud!</p>
                    </div>
                )}

                <div className="flex gap-4">
                    {isHelpMode ? (
                        <button
                            onClick={onContinue}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                        >
                            Back to Question
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    ) : (
                        <>
                            {onTryAgain && (
                                <button
                                    onClick={onTryAgain}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                                >
                                    <RotateCcw className="w-6 h-6" />
                                    Try Again
                                </button>
                            )}
                            <button
                                onClick={onContinue}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                            >
                                I Understand
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

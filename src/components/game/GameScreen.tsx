import React, { useState, useEffect } from 'react';
import { ArrowRight, Lightbulb, ChevronDown } from 'lucide-react';
import { Kid, MathTrack } from '../../types';
import { generateQuestion } from '../../utils/questionGenerator';
import { db } from '../../services/db';
import { toRenderableQuestion, RenderableQuestion } from '../../domain/renderBoundary';
import { ExplanationScreen } from './ExplanationScreen';
import { CoinGuideModal } from './CoinGuideModal';
import { MeasurementGuideModal } from './MeasurementGuideModal';
import { QuestionVisual } from './QuestionVisual';
import { ShapeIcon } from './visuals/ShapeVisual';
import { TimesTableExplorerVisual } from './visuals/TimesTableExplorerVisual';
import { GraphLearningModal } from './GraphLearningModal';

interface GameScreenProps {
    kid: Kid;
    track: MathTrack;
    questionCount: number;
    onComplete: () => void;
    onResults: (results: { correct: number; total: number; timeSpent: number }) => void;
    onBack: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ kid, track, questionCount, onComplete, onResults, onBack }) => {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [question, setQuestion] = useState<RenderableQuestion | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); // Strict string answers
    const [gameState, setGameState] = useState<'loading' | 'playing' | 'correct' | 'incorrect'>('loading');
    const [startTime, setStartTime] = useState(Date.now());
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [gameStartTime] = useState(Date.now());
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showCoinGuide, setShowCoinGuide] = useState(false);
    const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
    const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
    const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

    // Times Table UX State
    const isTimesTableTrack = track.id.startsWith('times_tables') || track.id === 'multiplication_advanced';
    const [practiceTable, setPracticeTable] = useState<number | null>(null);
    const [showTableSelector, setShowTableSelector] = useState(isTimesTableTrack); // Start here if TT track
    const [showLearningOverlay, setShowLearningOverlay] = useState(false);
    const [showGraphGuide, setShowGraphGuide] = useState(false);

    const [loadError, setLoadError] = useState<string | null>(null);

    const mode = kid.age <= 7 ? 'A' : 'B';



    useEffect(() => {
        // Daily Limit Check
        const { canPlay } = db.canPlayToday(kid);
        if (!canPlay) {
            alert("Buddy is sleepy! Come back tomorrow! 💤");
            onBack();
            return;
        }

        // Always start/restart a question when currency changes
        startNewQuestion();
    }, [currency]);

    const startNewQuestion = (levelOverride?: number, contextOverride?: { practiceTable?: number }) => {
        const levelToUse = levelOverride ?? currentLevel;
        let attempts = 0;
        let validRenderable: RenderableQuestion | null = null;

        while (attempts < 3 && !validRenderable) {
            attempts++;
            try {
                // Pass practiceTable context if active (prefer override)
                const ctx = contextOverride ?? { practiceTable: practiceTable ?? undefined };
                const raw = generateQuestion(track.id, levelToUse, kid.difficulty_index, kid.age, currency, ctx);

                // Rely on generator ID but ensure it exists
                if (!raw.id) {
                    raw.id = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                }

                const result = toRenderableQuestion(raw, {
                    age: kid.age,
                    trackId: track.id,
                    level: levelToUse,
                    difficulty: kid.difficulty_index
                });

                if (result.ok) {
                    validRenderable = result.value;
                } else {
                    console.warn(`[RenderBoundary] Rejected question (Attempt ${attempts}): ${result.error}`);
                }
            } catch (e) {
                console.error(`[RenderBoundary] Generation crash:`, e);
            }
        }

        if (validRenderable) {
            setQuestion(validRenderable);
            setGameState('playing');
            setSelectedAnswer(null);
            setLoadError(null);

            // Log Start Event
            db.appendEvent({
                type: 'question_started',
                kidId: kid.id,
                trackId: track.id,
                questionId: validRenderable.id,
                level: levelToUse,
                concept: validRenderable.concept,
                difficultyIndex: kid.difficulty_index,
                ts: Date.now()
            });

            // Legacy log
            db.logLevelStart(kid.id, track.id, levelToUse);
            setStartTime(Date.now());
        } else {
            console.error('[RenderBoundary] Failed to generate valid question after 3 attempts.');
            setLoadError("Oops! We couldn't load the next question. Please try going back.");
            setGameState('loading'); // Stay in loading
        }
    };

    const handleAnswer = (answer: string) => {
        // STRICT GAME LOOP GUARD: Prevent double-taps or interactions during transitions
        if (!question || gameState !== 'playing') return;

        setSelectedAnswer(answer);
        // Strict consistency check: Answer matches option at correctIndex
        const isCorrect = answer === question.options[question.correctIndex];
        const ts = Date.now();

        // Log Answer Event
        db.appendEvent({
            type: 'question_answered',
            kidId: kid.id,
            trackId: track.id,
            questionId: question.id,
            level: currentLevel,
            concept: question.concept,
            difficultyIndex: kid.difficulty_index,
            correct: isCorrect,
            // Fallback for error logging
            errorType: isCorrect ? undefined : `${question.concept}_error`,
            ts: ts
        });

        if (isCorrect) {
            setGameState('correct');
            const newTotalCorrect = totalCorrect + 1;
            setTotalCorrect(newTotalCorrect);

            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            db.logLevelComplete(kid.id, track.id, currentLevel, 100, timeSpent);

            // Coins logic is handled in logLevelComplete: 1 coin per 100 score (1 coin per question)

            setTimeout(() => {
                // Use functional check to ensure we are truly ready
                if (currentLevel < questionCount) {
                    setCurrentLevel(prev => {
                        const next = prev + 1;
                        startNewQuestion(next); // Start next question with VALIDATED next level
                        return next;
                    });
                } else {
                    // Game Over
                    const totalTimeSpent = Math.floor((Date.now() - gameStartTime) / 1000);

                    // Log Session Complete
                    db.appendEvent({
                        type: 'session_completed',
                        kidId: kid.id,
                        trackId: track.id,
                        total: questionCount,
                        correct: newTotalCorrect,
                        timeSpentSec: totalTimeSpent,
                        ts: Date.now()
                    });

                    onResults({
                        correct: newTotalCorrect,
                        total: questionCount,
                        timeSpent: totalTimeSpent
                    });
                    onComplete();
                }
            }, 2000);
        } else {
            setGameState('incorrect');
            db.logError(kid.id, track.id, currentLevel, `${question.concept}_error`, kid.difficulty_index, mode);

            // Show explanation after wrong answer
            setTimeout(() => {
                setShowExplanation(true);
            }, 1500);
        }
    };

    const handleTryAgain = () => {
        setShowExplanation(false);
        setGameState('playing');
        setSelectedAnswer(null);
    };

    const handleContinue = () => {
        setShowExplanation(false);
        if (currentLevel < questionCount) {
            const nextLevel = currentLevel + 1;
            setCurrentLevel(nextLevel);
            startNewQuestion(nextLevel);
        } else {
            const totalTimeSpent = Math.floor((Date.now() - gameStartTime) / 1000);

            // Log Session Complete
            db.appendEvent({
                type: 'session_completed',
                kidId: kid.id,
                trackId: track.id,
                total: questionCount,
                correct: totalCorrect,
                timeSpentSec: totalTimeSpent,
                ts: Date.now()
            });

            onResults({
                correct: totalCorrect,
                total: questionCount,
                timeSpent: totalTimeSpent
            });
            onComplete();
        }
    };

    if (loadError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{loadError}</p>
                    <button
                        onClick={onBack}
                        className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <div className="text-white text-2xl font-bold">Loading...</div>
            </div>
        );
    }

    // Table Selection Phase
    if (showTableSelector) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
                <button
                    onClick={onBack}
                    className="absolute top-4 left-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition"
                >
                    <ArrowRight className="w-6 h-6 transform rotate-180" />
                </button>

                <h1 className="text-4xl font-bold text-white mb-2">Choose Your Challenge!</h1>
                <p className="text-white/80 mb-8 text-xl">Which number do you want to practice?</p>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-2xl w-full">
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                        <button
                            key={num}
                            onClick={() => {
                                setPracticeTable(num);
                                setShowTableSelector(false);
                                // Pass 'num' directly to avoid stale state closure
                                setTimeout(() => startNewQuestion(1, { practiceTable: num }), 0);
                            }}
                            className="aspect-square bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl font-black text-indigo-600 hover:scale-105 hover:bg-indigo-50 transition-all border-b-8 border-indigo-200 active:border-b-0 active:translate-y-2"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={() => {
                            setPracticeTable(null); // Mix
                            setShowTableSelector(false);
                            setTimeout(() => startNewQuestion(1, { practiceTable: undefined }), 0);
                        }}
                        className="aspect-square bg-yellow-400 rounded-2xl shadow-xl flex flex-col items-center justify-center hover:scale-105 hover:bg-yellow-300 transition-all border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 col-span-1"
                    >
                        <span className="text-2xl font-bold text-yellow-900">Mix</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex flex-col p-4 relative">
            {/* Learning Overlay */}
            {showLearningOverlay && (
                <div className="absolute inset-0 z-50 bg-white flex flex-col animate-fade-in">
                    <div className="flex justify-between items-center p-4 bg-indigo-600 text-white shadow-md z-10">
                        <span className="font-bold text-xl ml-2">Times Table Explorer</span>
                        <button
                            onClick={() => setShowLearningOverlay(false)}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full font-bold transition"
                        >
                            Close ✕
                        </button>
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                        {/* We pass a dummy 'question' prop as the visual component expects it currently, 
                             but the visual is mostly self-contained. */}
                        <TimesTableExplorerVisual question={{
                            visual: { kind: 'timesTableExplorer' },
                            // Minimal dummy usage for the visual component
                            concept: 'multiplication',
                            question: '',
                            correctAnswer: 0,
                            options: []
                        }} />
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={onBack}
                    className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                    aria-label="Exit Game"
                >
                    <ArrowRight className="w-6 h-6 text-gray-600 transform rotate-180" />
                </button>

                <div className="bg-white rounded-full px-6 py-2 shadow-lg">
                    <span className="font-bold text-gray-800">Question {currentLevel}/{questionCount}</span>
                </div>

                <div className="flex gap-2 relative">
                    {/* Currency Selector */}
                    {question?.concept === 'money' && (
                        <div className="relative">
                            <button
                                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                                className="bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors px-4 py-2 gap-2 border-2 border-indigo-100"
                                aria-label="Select Currency"
                            >
                                <span className="text-2xl">{currency === 'USD' ? '🇺🇸' : '🇪🇺'}</span>
                                <span className="font-bold text-gray-700 hidden sm:inline">{currency}</span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>

                            {showCurrencyDropdown && (
                                <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 min-w-[120px] animate-fade-in">
                                    <button
                                        onClick={() => {
                                            if (currency !== 'USD') setCurrency('USD');
                                            setShowCurrencyDropdown(false);
                                        }}
                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left"
                                    >
                                        <span className="text-xl">🇺🇸</span>
                                        <span className="font-bold text-gray-700">USD</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (currency !== 'EUR') setCurrency('EUR');
                                            setShowCurrencyDropdown(false);
                                        }}
                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left"
                                    >
                                        <span className="text-xl">🇪🇺</span>
                                        <span className="font-bold text-gray-700">EUR</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {question.concept === 'money' && (
                        <button
                            onClick={() => setShowCoinGuide(true)}
                            className="h-10 w-10 flex items-center justify-center bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors shadow-sm"
                        >
                            <Lightbulb className="w-5 h-5" />
                        </button>
                    )}

                    {question?.concept === 'measurement' && (
                        <button
                            onClick={() => setShowMeasurementGuide(true)}
                            className="h-10 w-10 flex items-center justify-center bg-amber-100 text-amber-600 rounded-full hover:bg-amber-200 transition-colors shadow-sm"
                        >
                            <Lightbulb className="w-5 h-5" />
                        </button>
                    )}

                    {question?.concept === 'data' && (
                        <button
                            onClick={() => setShowGraphGuide(true)}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full font-bold hover:bg-indigo-200 transition-colors shadow-sm"
                        >
                            📊 Learn
                        </button>
                    )}

                    {/* Times Table Learn Button */}
                    {isTimesTableTrack && (
                        <button
                            onClick={() => setShowLearningOverlay(true)}
                            className="bg-cyan-500 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform px-4 py-2 gap-2 animate-bounce-subtle"
                            aria-label="Learn Tables"
                        >
                            <span className="text-2xl">📖</span>
                            <span className="text-white font-bold hidden sm:inline">Learn</span>
                        </button>
                    )}

                    <button
                        onClick={() => setShowHelp(true)}
                        className="bg-yellow-400 rounded-full shadow-lg flex items-center justify-center hover:bg-yellow-500 transition-colors px-4 py-2 gap-2"
                        aria-label="Help"
                    >
                        <Lightbulb className="w-6 h-6 text-white" />
                        <span className="text-white font-bold hidden sm:inline">Help</span>
                    </button>
                </div>
            </div>

            {/* Modals */}
            {showCoinGuide && (
                <CoinGuideModal
                    currency={currency}
                    onClose={() => setShowCoinGuide(false)}
                />
            )}

            {showMeasurementGuide && (
                <MeasurementGuideModal onClose={() => setShowMeasurementGuide(false)} />
            )}

            {showGraphGuide && (
                <GraphLearningModal onClose={() => setShowGraphGuide(false)} />
            )}

            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        {question.prompt}
                    </h2>

                    <QuestionVisual question={question} />

                    {/* Answer Options */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {question.options.map((option: string, i: number) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(option)}
                                disabled={gameState !== 'playing'}
                                className={`h-24 rounded-2xl text-4xl font-bold transition-all transform hover:scale-105 active:scale-95 ${selectedAnswer === option
                                    ? gameState === 'correct'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    } disabled:opacity-50`}
                            >
                                {question.concept === 'shapes' ? (
                                    <div className="flex justify-center items-center pointer-events-none">
                                        <ShapeIcon shape={String(option)} size="w-16 h-16" />
                                    </div>
                                ) : (
                                    option
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Feedback */}
                    {gameState === 'correct' && (
                        <div className="mt-6 text-center">
                            <div className="text-6xl mb-2">🎉</div>
                            <p className="text-2xl font-bold text-green-600">Perfect!</p>
                        </div>
                    )}

                    {gameState === 'incorrect' && !showExplanation && (
                        <div className="mt-6 text-center">
                            <div className="text-6xl mb-2">🤔</div>
                            <p className="text-2xl font-bold text-orange-600">Not quite! Let me explain...</p>
                        </div>
                    )}
                </div>
            </div>



            {/* Explanation Modal */}
            {showExplanation && (
                <ExplanationScreen
                    question={question}
                    concept={question.concept}
                    mode={mode}
                    onTryAgain={handleTryAgain}
                    onContinue={handleContinue}
                />
            )}

            {/* Help Modal */}
            {showHelp && (
                <ExplanationScreen
                    question={question}
                    concept={question.concept}
                    mode={mode}
                    onTryAgain={() => setShowHelp(false)}
                    onContinue={() => setShowHelp(false)}
                    isHelpMode={true}
                />
            )}
            {/* Dev Debug Overlay */}
            {(import.meta as any).env.DEV && (
                <div className="fixed top-20 left-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 pointer-events-none font-mono shadow-xl border border-white/20">
                    <div className="font-bold underline mb-2 text-yellow-300">RENDER BOUNDARY DEBUG</div>
                    <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1">
                        <div className="text-gray-400">Concept:</div>
                        <div className="font-bold">{question.concept}</div>

                        <div className="text-gray-400">Visual:</div>
                        <div className={`font-bold ${!question.visual ? 'text-red-400' : 'text-green-400'}`}>
                            {question.visual?.kind || 'NONE'}
                        </div>

                        <div className="text-gray-400">Fallback:</div>
                        <div className={`${question.debug?.usedFallback ? 'text-red-400 font-bold' : 'text-gray-300'}`}>
                            {question.debug?.usedFallback ? 'YES' : 'No'}
                        </div>

                        {question.debug?.reason && (
                            <>
                                <div className="text-gray-400">Reason:</div>
                                <div className="text-red-300">{question.debug.reason}</div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};



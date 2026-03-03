import { db } from '../services/db';
import { QuestionAnsweredEvent, SessionCompletedEvent } from '../domain/events';

export const getKidStats = (kidId: string) => {
    const events = db.getEvents(kidId);

    // Filter relevant events
    const answerEvents = events.filter(e => e.type === 'question_answered') as QuestionAnsweredEvent[];
    const sessionEvents = events.filter(e => e.type === 'session_completed') as SessionCompletedEvent[];

    // Calculate accuracy by track
    const trackStats: Record<string, { correct: number, total: number, timeSpent: number }> = {};

    // Populate from answers
    answerEvents.forEach(e => {
        if (!trackStats[e.trackId]) {
            trackStats[e.trackId] = { correct: 0, total: 0, timeSpent: 0 };
        }
        trackStats[e.trackId].total += 1;
        if (e.correct) {
            trackStats[e.trackId].correct += 1;
        }
    });

    // Populate time from sessions (better approximation than per-question which has gaps)
    sessionEvents.forEach(s => {
        if (!trackStats[s.trackId]) {
            trackStats[s.trackId] = { correct: 0, total: 0, timeSpent: 0 };
        }
        trackStats[s.trackId].timeSpent += s.timeSpentSec;
    });

    // Overall metrics
    const overallAttempts = answerEvents.length;
    const correctCount = answerEvents.filter(e => e.correct).length;
    const overallAccuracy = overallAttempts > 0 ? Math.round((correctCount / overallAttempts) * 100) : 0;
    const totalPlayTime = sessionEvents.reduce((sum, s) => sum + s.timeSpentSec, 0);

    // Calculate Error Hotspots (Needs Focus)
    const errorCounts: Record<string, number> = {};
    answerEvents.forEach(e => {
        if (!e.correct && e.errorType) {
            errorCounts[e.errorType] = (errorCounts[e.errorType] || 0) + 1;
        }
    });

    // We only have error counts, but the UI might expect "Total Errors" count
    const totalErrors = answerEvents.filter(e => !e.correct).length;

    return {
        levelsCompleted: sessionEvents.length, // Mapping sessions to "levels completed" concept for dashboard
        totalErrors,
        avgScore: overallAccuracy, // Using accuracy as score
        totalPlayTime,
        trackStats, // { trackId: { correct, total, timeSpent } }
        overallAccuracy,
        totalQuestions: overallAttempts,
        correctAnswers: correctCount
    };
};

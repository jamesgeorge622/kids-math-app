export interface QuestionStartedEvent {
    type: 'question_started';
    kidId: string;
    trackId: string;
    questionId: string;
    level: number;
    concept: string;
    difficultyIndex: number;
    ts: number;
}

export interface QuestionAnsweredEvent {
    type: 'question_answered';
    kidId: string;
    trackId: string;
    questionId: string;
    level: number;
    concept: string;
    difficultyIndex: number;
    correct: boolean;
    errorType?: string;
    ts: number;
}

export interface SessionCompletedEvent {
    type: 'session_completed';
    kidId: string;
    trackId: string;
    total: number;
    correct: number;
    timeSpentSec: number;
    ts: number;
}

export type AppEvent = QuestionStartedEvent | QuestionAnsweredEvent | SessionCompletedEvent;

import { Visual } from '../types/question';

export interface WorksheetItem {
    id: string;
    title?: string;
    prompt: string;
    visual?: Visual;
    answerKey?: string;
    sourceErrorType: string;
    options?: string[]; // Optional multiple choice options
}

export interface WorksheetPreview {
    id: string;
    kidId: string;
    trackId?: string;
    periodStart: number;
    periodEnd: number;
    title: string;
    objective: string;
    items: WorksheetItem[];
    parentNote: string;
    createdAt: number;
}

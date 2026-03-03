export * from './question';

export interface User {
    id: string;
    email: string;
    password?: string; // In a real app, this wouldn't be on the client
    firstName: string;
    surname: string;
    parentAge: string;
    role: 'parent' | 'admin';
    created_at: string;
}

export interface Kid {
    id: string;
    user_id: string;
    name: string;
    age: number;
    avatar: string;
    created_at: string;
    difficulty_index: number;
    streak: number;
    last_play_date: string | null;
    coins: number;
    total_coins_earned: number;
    unlocked_avatars: string[];
    daily_questions_today: number;
    last_question_date: string | null;
    session_time_today: number;
    achievements: string[];

    // Gamification
    total_xp: number;
    pet?: Pet;
    status?: 'active' | 'deleted';
}

export interface Pet {
    type: 'dragon' | 'robot' | 'cat' | 'lion' | 'tiger' | 'panda' | 'fox' | 'koala' | 'frog' | 'unicorn' | 'octopus';
    stage: number; // 1=Egg, 2=Baby, 3=Child, 4=Teen, 5=Adult
    xp: number; // Current XP towards next level
    level: number; // The "Pet Level" (1-100+)
    accessories: string[];
    lastInteraction: number;
}

export interface ProgressLog {
    kid_id: string;
    track_id: string;
    level_id: number;
    status: 'started' | 'completed';
    started_at: string;
    completed_at?: string;
    attempts: number;
    score: number;
    time_spent_seconds: number;
}

export interface ErrorLog {
    kid_id: string;
    track_id: string;
    level_id: number;
    error_type: string;
    difficulty_index: number;
    mode: string;
    created_at: string;
    offline_flag: boolean;
}

export interface Worksheet {
    id: string;
    kid_id: string;
    period_start: string;
    period_end: string;
    status: 'generated' | 'completed';
    focus_areas: [string, number][]; // [ErrorType, Count]
    created_at: string;
    pdf_url: string;
}

export interface MathTrack {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    ageRange: [number, number];
    levels: number;
    concepts: string[];
}



export interface StorageAdapter {
    get(key: string): any;
    set(key: string, value: any): void;
    remove(key: string): void;
    clear(): void;
}

import { AppEvent } from '../domain/events';
import { WorksheetPreview } from '../domain/worksheets';
export * from '../domain/events'; // Re-export for convenience

export interface DBState {
    users: User[];
    kids: Kid[];
    progress: ProgressLog[];
    errors: ErrorLog[];
    worksheets: Worksheet[];
    worksheetPreviews: WorksheetPreview[];
    events: AppEvent[];
    offlineQueue: any[];
    session: { userId: string; email: string } | null;
}

import { DBState, User, Kid, ProgressLog, ErrorLog, Worksheet } from '../types';
import { AppEvent } from '../domain/events';
import { WorksheetPreview } from '../domain/worksheets';
import { StorageAdapter } from '../types';
import { LocalStorageAdapter } from './storage';
import { calculateXpReward } from '../utils/gamification';

class DatabaseService {
    private db: DBState;
    private storage: StorageAdapter;
    private STORAGE_KEY = 'kidsAppDB';

    constructor(storage: StorageAdapter) {
        this.storage = storage;
        this.db = {
            users: [],
            kids: [],
            progress: [],
            errors: [],
            worksheets: [],
            worksheetPreviews: [],
            events: [],
            offlineQueue: [],
            session: null
        };
    }

    init() {
        const stored = this.storage.get(this.STORAGE_KEY);
        if (stored) {
            // Merge stored data ensuring all keys exist
            this.db = { ...this.db, ...stored };

            // Migration: Backfill total_xp for existing users
            if (this.db.kids) {
                this.db.kids.forEach(kid => {
                    if (typeof kid.total_xp === 'undefined') {
                        kid.total_xp = 0;
                    }
                });
            }
        }
    }

    save() {
        this.storage.set(this.STORAGE_KEY, this.db);
    }

    // Auth
    createUser(email: string, password: string, firstName: string, surname: string, parentAge: string): User {
        const user: User = {
            id: `user_${Date.now()}`,
            email,
            password,
            firstName,
            surname,
            parentAge,
            role: 'parent',
            created_at: new Date().toISOString()
        };
        this.db.users.push(user);
        this.save();
        return user;
    }

    login(email: string, password: string): User | null {
        const user = this.db.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.db.session = { userId: user.id, email: user.email };
            this.save();
            return user;
        }
        return null;
    }

    logout() {
        this.db.session = null;
        this.save();
    }

    getSession() {
        return this.db.session;
    }

    getUser(userId: string) {
        return this.db.users.find(u => u.id === userId);
    }

    // Kid Profiles
    createKid(userId: string, name: string, age: number, avatar: string): Kid {
        const kid: Kid = {
            id: `kid_${Date.now()}`,
            user_id: userId,
            name,
            age,
            avatar,
            created_at: new Date().toISOString(),
            difficulty_index: 1,
            streak: 0,
            last_play_date: null,
            coins: 0,
            total_coins_earned: 0,
            unlocked_avatars: ['🦁'],
            daily_questions_today: 0,
            last_question_date: null,
            session_time_today: 0,
            achievements: [],
            total_xp: 0,
            status: 'active'
            // Pet is undefined until selected
        };
        this.db.kids.push(kid);
        this.save();
        return kid;
    }

    getKidsByUser(userId: string) {
        return this.db.kids.filter(k => k.user_id === userId && k.status !== 'deleted');
    }

    getKid(kidId: string) {
        return this.db.kids.find(k => k.id === kidId);
    }

    // Progress & Game Logic
    addCoins(kidId: string, amount: number) {
        const kid = this.getKid(kidId);
        if (kid) {
            kid.coins += amount;
            kid.total_coins_earned += amount;
            this.save();
        }
    }

    purchaseItem(kidId: string, cost: number, xpReward: number = 0) {
        const kid = this.getKid(kidId);
        if (kid && kid.coins >= cost) {
            kid.coins -= cost;
            // Grant XP for healthy food
            if (xpReward > 0) {
                kid.total_xp = (kid.total_xp || 0) + xpReward;
            }
            // Update interaction time
            if (kid.pet) {
                kid.pet.lastInteraction = Date.now();
            }
            this.save();
            return true;
        }
        return false;
    }

    canPlayToday(kid: Kid) {
        const today = new Date().toDateString();
        const lastPlayDate = kid.last_question_date ? new Date(kid.last_question_date).toDateString() : null;

        if (lastPlayDate !== today) {
            kid.daily_questions_today = 0;
            kid.session_time_today = 0;
            kid.last_question_date = new Date().toISOString();
            this.save();
            return { canPlay: true, questionsLeft: 100, timeLeft: 900 };
        }

        const questionsLeft = 100 - kid.daily_questions_today;
        const timeLeft = 900 - kid.session_time_today;

        return {
            canPlay: questionsLeft > 0 && timeLeft > 0,
            questionsLeft,
            timeLeft
        };
    }

    updateDailyUsage(kidId: string, questionsAnswered: number, timeSpent: number) {
        const kid = this.getKid(kidId);
        if (kid) {
            kid.daily_questions_today += questionsAnswered;
            kid.session_time_today += timeSpent;
            this.save();
        }
    }

    // Deletion
    deleteKid(kidId: string) {
        const kid = this.getKid(kidId);
        if (kid) {
            // 1. Mark as deleted (Archival)
            kid.status = 'deleted';

            // 2. Clear Heavy Data (Wipe) on the object itself
            kid.coins = 0;
            kid.streak = 0;
            kid.total_xp = 0;
            kid.pet = undefined;
            kid.achievements = [];
            kid.avatar = '👻'; // Ghost avatar for deleted

            // 3. Hard Delete Related Data
            this.db.progress = this.db.progress.filter(p => p.kid_id !== kidId);
            this.db.errors = this.db.errors.filter(e => e.kid_id !== kidId);
            this.db.worksheets = this.db.worksheets.filter(w => w.kid_id !== kidId);
            this.db.worksheetPreviews = (this.db.worksheetPreviews || []).filter(w => w.kidId !== kidId);
            this.db.events = (this.db.events || []).filter(e => e.kidId !== kidId);

            this.save();
        }
    }

    logLevelStart(kidId: string, trackId: string, levelId: number) {
        const entry: ProgressLog = {
            kid_id: kidId,
            track_id: trackId,
            level_id: levelId,
            status: 'started',
            started_at: new Date().toISOString(),
            attempts: 1,
            score: 0,
            time_spent_seconds: 0
        };
        this.db.progress.push(entry);
        this.save();
        return entry;
    }

    logLevelComplete(kidId: string, trackId: string, levelId: number, score: number, timeSpent: number) {
        const entry = this.db.progress.find(p => p.kid_id === kidId && p.track_id === trackId && p.level_id === levelId && p.status === 'started');
        if (entry) {
            entry.status = 'completed';
            entry.completed_at = new Date().toISOString();
            entry.score = score;
            entry.time_spent_seconds = timeSpent;

            const kid = this.getKid(kidId);
            if (kid) {
                const today = new Date().toDateString();
                const lastPlay = kid.last_play_date ? new Date(kid.last_play_date).toDateString() : null;

                if (lastPlay !== today) {
                    const yesterday = new Date(Date.now() - 86400000).toDateString();
                    kid.streak = lastPlay === yesterday ? kid.streak + 1 : 1;
                    kid.last_play_date = new Date().toISOString();
                }

                // Update Daily Usage
                kid.daily_questions_today += 1; // Called per question
                kid.session_time_today += timeSpent;

                // Rewards
                // Coins: 1 per correct answer (Score 100 passed for correct)
                const coinsEarned = Math.floor(score / 100);
                kid.coins += coinsEarned;
                kid.total_coins_earned += coinsEarned;

                // XP: Based on Difficulty (default 1) and Streak
                const xpEarned = calculateXpReward(kid.difficulty_index, kid.streak);
                kid.total_xp = (kid.total_xp || 0) + xpEarned;
            }
            this.save();
        }
    }

    logError(kidId: string, trackId: string, levelId: number, errorType: string, difficulty: number, mode: string) {
        const error: ErrorLog = {
            kid_id: kidId,
            track_id: trackId,
            level_id: levelId,
            error_type: errorType,
            difficulty_index: difficulty,
            mode,
            created_at: new Date().toISOString(),
            offline_flag: false
        };
        this.db.errors.push(error);
        this.save();
    }

    getCompletedProgress(kidId: string) {
        return this.db.progress.filter(p => p.kid_id === kidId && p.status === 'completed');
    }

    getErrors(kidId: string, daysBack = 7) {
        if (daysBack === -1) return this.db.errors.filter(e => e.kid_id === kidId);

        const cutoff = new Date(Date.now() - daysBack * 86400000);
        return this.db.errors.filter(e =>
            e.kid_id === kidId && new Date(e.created_at) > cutoff
        );
    }

    // Worksheets
    addWorksheet(worksheet: Worksheet) {
        this.db.worksheets.push(worksheet);
        this.save();
    }

    getWorksheets(kidId: string) {
        return this.db.worksheets.filter(w => w.kid_id === kidId);
    }

    // Worksheet Previews
    saveWorksheetPreview(preview: WorksheetPreview) {
        // Store only the latest per kid for now, or append to a list
        // Let's keep a history but filter by kidId
        this.db = {
            ...this.db,
            worksheetPreviews: [...(this.db.worksheetPreviews || []).filter(w => w.kidId !== preview.kidId), preview]
        };
        this.save();
    }

    getLatestWorksheetPreview(kidId: string): WorksheetPreview | undefined {
        return (this.db.worksheetPreviews || []).find(w => w.kidId === kidId);
    }

    // Event Analytics
    appendEvent(event: AppEvent) {
        // Immutable append
        this.db = {
            ...this.db,
            events: [...(this.db.events || []), event]
        };
        this.save();
    }

    getEvents(kidId?: string) {
        if (!kidId) return this.db.events || [];
        return (this.db.events || []).filter(e => e.kidId === kidId);
    }

    // Diagnostics
    exportData(): string {
        return JSON.stringify(this.db, null, 2);
    }
}


// Singleton export
export const db = new DatabaseService(new LocalStorageAdapter());

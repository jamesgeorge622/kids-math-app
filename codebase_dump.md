# Kids Math App Codebase Dump

### package.json

```json
{
  "name": "kids-math-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.292.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.0"
  }
}

```

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
})

```

### tsconfig.json

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "lib": [
            "ES2020",
            "DOM",
            "DOM.Iterable"
        ],
        "module": "ESNext",
        "skipLibCheck": true,
        /* Bundler mode */
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx",
        /* Linting */
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true
    },
    "include": [
        "src"
    ],
    "references": [
        {
            "path": "./tsconfig.node.json"
        }
    ]
}
```

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}

```

### postcss.config.js

```javascript
export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
}

```

### src/main.tsx

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

```

### src/App.tsx

```typescript
import React, { useState, useEffect } from 'react';
import { User, Kid, MathTrack } from './types';
import { db } from './services/db';
import { LoginScreen } from './components/auth/LoginScreen';
import { Dashboard } from './components/dashboard/Dashboard';
import { AddKidModal } from './components/dashboard/AddKidModal'; // Dashboard handles this internally but keeping import just in case
import { TrackSelection } from './components/game/TrackSelection';
import { LevelConfigScreen } from './components/game/LevelConfigScreen';
import { GameScreen } from './components/game/GameScreen';
import { ResultsScreen } from './components/game/ResultsScreen';
import { LearningSummaryScreen } from './components/reports/LearningSummaryScreen';
import { WorksheetScreen } from './components/reports/WorksheetScreen';
import { ParentGate } from './components/dashboard/ParentGate';
import { FileText, PieChart } from 'lucide-react';

const App = () => {
    const [screen, setScreen] = useState<'login' | 'dashboard' | 'tracks' | 'levelConfig' | 'game' | 'results' | 'summary' | 'worksheets' | 'gate'>('login');
    const [user, setUser] = useState<User | null>(null);
    const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
    const [selectedTrack, setSelectedTrack] = useState<MathTrack | null>(null);
    const [questionCount, setQuestionCount] = useState(10);
    const [gameResults, setGameResults] = useState<{ correct: number; total: number; timeSpent: number } | null>(null);
    const [targetScreenAfterGate, setTargetScreenAfterGate] = useState<string>('');

    useEffect(() => {
        // Check for existing session
        db.init();
        const session = db.getSession();
        if (session) {
            const existingUser = db.getUser(session.userId);
            if (existingUser) {
                setUser(existingUser);
                setScreen('dashboard');
            }
        }
    }, []);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        setScreen('dashboard');
    };

    const handleLogout = () => {
        db.logout();
        setUser(null);
        setSelectedKid(null);
        setScreen('login');
    };

    const handleSelectKid = (kid: Kid) => {
        setSelectedKid(kid);
        setScreen('tracks');
    };

    const handleSelectTrack = (track: MathTrack) => {
        setSelectedTrack(track);
        setScreen('levelConfig');
    };

    const handleStartGame = (count: number) => {
        setQuestionCount(count);
        setScreen('game');
    };

    const handleGameComplete = () => {
        setScreen('results');
    };

    const handleGameResults = (results: { correct: number; total: number; timeSpent: number }) => {
        setGameResults(results);
    };

    const handleGatePass = () => {
        if (targetScreenAfterGate === 'summary') setScreen('summary');
        if (targetScreenAfterGate === 'worksheets') setScreen('worksheets');
        setTargetScreenAfterGate('');
    };

    const handleGateRequest = (target: 'summary' | 'worksheets') => {
        setTargetScreenAfterGate(target);
        setScreen('gate');
    };

    return (
        <div className="app font-sans text-gray-900">
            {screen === 'login' && <LoginScreen onLogin={handleLogin} />}

            {screen === 'dashboard' && user && (
                <Dashboard
                    user={user}
                    onLogout={handleLogout}
                    onSelectKid={handleSelectKid}
                />
            )}

            {screen === 'tracks' && selectedKid && (
                <TrackSelection
                    kid={selectedKid}
                    onSelectTrack={handleSelectTrack}
                    onBack={() => setScreen('dashboard')}
                />
            )}

            {screen === 'levelConfig' && selectedKid && selectedTrack && (
                <LevelConfigScreen
                    kid={selectedKid}
                    track={selectedTrack}
                    onStart={handleStartGame}
                    onBack={() => setScreen('tracks')}
                />
            )}

            {screen === 'game' && selectedKid && selectedTrack && (
                <GameScreen
                    kid={selectedKid}
                    track={selectedTrack}
                    questionCount={questionCount}
                    onComplete={handleGameComplete}
                    onResults={handleGameResults}
                    onBack={() => setScreen('tracks')} // Or confirm exit?
                />
            )}

            {screen === 'results' && selectedKid && selectedTrack && gameResults && (
                <ResultsScreen
                    kid={selectedKid}
                    track={selectedTrack}
                    results={gameResults}
                    onContinue={() => setScreen('tracks')}
                    onBack={() => setScreen('dashboard')}
                />
            )}

            {screen === 'gate' && (
                <ParentGate
                    onPass={handleGatePass}
                    onCancel={() => {
                        setTargetScreenAfterGate('');
                        setScreen('tracks'); // Default back to tracks usually, or wherever we came from. 
                        // Ideally we should track previous screen but for now this is likely fro tracks screen FABs
                    }}
                />
            )}

            {screen === 'summary' && selectedKid && (
                <LearningSummaryScreen
                    kid={selectedKid}
                    onBack={() => setScreen('tracks')}
                />
            )}

            {screen === 'worksheets' && selectedKid && (
                <WorksheetScreen
                    kid={selectedKid}
                    onBack={() => setScreen('tracks')}
                />
            )}

            {/* Floating Action Buttons for Parents (visible on game-related screens) */}
            {(screen === 'tracks' || screen === 'levelConfig') && (
                <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40">
                    <button
                        onClick={() => handleGateRequest('worksheets')}
                        className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-purple-600 hover:scale-110 transition-transform"
                        title="Worksheets"
                    >
                        <FileText className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => handleGateRequest('summary')}
                        className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:scale-110 transition-transform"
                        title="Learning Summary"
                    >
                        <PieChart className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;

```

### src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

```

### src/types/index.ts

```typescript
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

export interface ExplanationStep {
    visual?: string | any;
    steps: string[];
    tip?: string;
    intro?: string;
}

export interface Question {
    concept: string;
    question: string;
    visual: any;
    correctAnswer: any;
    options: any[];
    explanation: ExplanationStep;
}

export interface StorageAdapter {
    get(key: string): any;
    set(key: string, value: any): void;
    remove(key: string): void;
    clear(): void;
}

export interface DBState {
    users: User[];
    kids: Kid[];
    progress: ProgressLog[];
    errors: ErrorLog[];
    worksheets: Worksheet[];
    offlineQueue: any[];
    session: { userId: string; email: string } | null;
}

```

### src/data/tracks.ts

```typescript
import { MathTrack } from '../types';

export const MATH_TRACKS: Record<string, MathTrack> = {
    // AGE 5 (Kindergarten)
    counting_1_10: {
        id: 'counting_1_10',
        title: 'Counting 1-10',
        description: 'Learn to count up to 10',
        icon: '1️⃣',
        color: 'from-blue-400 to-blue-600',
        ageRange: [5, 5],
        levels: 8,
        concepts: ['counting', 'number_recognition']
    },
    shapes_colors: {
        id: 'shapes_colors',
        title: 'Shapes & Colors',
        description: 'Learn basic shapes and colors',
        icon: '🔷',
        color: 'from-pink-400 to-pink-600',
        ageRange: [5, 5],
        levels: 6,
        concepts: ['shapes', 'colors']
    },
    more_less: {
        id: 'more_less',
        title: 'More or Less',
        description: 'Compare which group has more',
        icon: '⚖️',
        color: 'from-green-400 to-green-600',
        ageRange: [5, 6],
        levels: 6,
        concepts: ['comparison']
    },

    // AGE 6 (Grade 1)
    counting_1_20: {
        id: 'counting_1_20',
        title: 'Counting 1-20',
        description: 'Count higher numbers',
        icon: '🔢',
        color: 'from-blue-400 to-blue-600',
        ageRange: [6, 6],
        levels: 10,
        concepts: ['counting']
    },
    addition_basic: {
        id: 'addition_basic',
        title: 'Addition to 10',
        description: 'Add numbers up to 10',
        icon: '➕',
        color: 'from-green-400 to-green-600',
        ageRange: [6, 7],
        levels: 10,
        concepts: ['addition']
    },
    subtraction_basic: {
        id: 'subtraction_basic',
        title: 'Subtraction to 10',
        description: 'Take away numbers up to 10',
        icon: '➖',
        color: 'from-orange-400 to-orange-600',
        ageRange: [6, 7],
        levels: 10,
        concepts: ['subtraction']
    },
    number_bonds: {
        id: 'number_bonds',
        title: 'Number Bonds',
        description: 'Learn how numbers combine',
        icon: '🔗',
        color: 'from-purple-400 to-purple-600',
        ageRange: [6, 7],
        levels: 8,
        concepts: ['number_bonds']
    },

    // AGE 7 (Grade 2)
    counting_1_100: {
        id: 'counting_1_100',
        title: 'Counting to 100',
        description: 'Count by 1s, 5s, and 10s',
        icon: '💯',
        color: 'from-blue-400 to-blue-600',
        ageRange: [7, 7],
        levels: 10,
        concepts: ['counting', 'skip_counting']
    },
    addition_20: {
        id: 'addition_20',
        title: 'Addition to 20',
        description: 'Add bigger numbers',
        icon: '➕',
        color: 'from-green-400 to-green-600',
        ageRange: [7, 8],
        levels: 12,
        concepts: ['addition']
    },
    subtraction_20: {
        id: 'subtraction_20',
        title: 'Subtraction to 20',
        description: 'Subtract bigger numbers',
        icon: '➖',
        color: 'from-orange-400 to-orange-600',
        ageRange: [7, 8],
        levels: 12,
        concepts: ['subtraction']
    },
    place_value: {
        id: 'place_value',
        title: 'Tens and Ones',
        description: 'Understand place value',
        icon: '🔟',
        color: 'from-indigo-400 to-indigo-600',
        ageRange: [7, 8],
        levels: 10,
        concepts: ['place_value']
    },
    time_basics: {
        id: 'time_basics',
        title: 'Telling Time',
        description: 'Learn to read clocks',
        icon: '🕐',
        color: 'from-yellow-400 to-yellow-600',
        ageRange: [7, 8],
        levels: 8,
        concepts: ['time']
    },

    // AGE 8 (Grade 3)
    addition_100: {
        id: 'addition_100',
        title: 'Addition to 100',
        description: 'Add with two-digit numbers',
        icon: '➕',
        color: 'from-green-400 to-green-600',
        ageRange: [8, 9],
        levels: 12,
        concepts: ['addition', 'carrying']
    },
    subtraction_100: {
        id: 'subtraction_100',
        title: 'Subtraction to 100',
        description: 'Subtract with two-digit numbers',
        icon: '➖',
        color: 'from-orange-400 to-orange-600',
        ageRange: [8, 9],
        levels: 12,
        concepts: ['subtraction', 'borrowing']
    },
    multiplication_intro: {
        id: 'multiplication_intro',
        title: 'Multiplication Basics',
        description: 'Learn about equal groups',
        icon: '✖️',
        color: 'from-purple-400 to-purple-600',
        ageRange: [8, 9],
        levels: 10,
        concepts: ['multiplication']
    },
    times_tables_2_5_10: {
        id: 'times_tables_2_5_10',
        title: 'Times Tables 2, 5, 10',
        description: 'Master easy multiplication facts',
        icon: '✖️',
        color: 'from-purple-500 to-purple-700',
        ageRange: [8, 9],
        levels: 12,
        concepts: ['multiplication']
    },
    fractions_half_quarter: {
        id: 'fractions_half_quarter',
        title: 'Halves & Quarters',
        description: 'Learn about fractions',
        icon: '🍕',
        color: 'from-red-400 to-red-600',
        ageRange: [8, 9],
        levels: 10,
        concepts: ['fractions']
    },

    // AGE 9 (Grade 4)
    multiplication_advanced: {
        id: 'multiplication_advanced',
        title: 'All Times Tables',
        description: 'Master multiplication to 12×12',
        icon: '✖️',
        color: 'from-purple-400 to-purple-600',
        ageRange: [9, 10],
        levels: 15,
        concepts: ['multiplication']
    },
    division_intro: {
        id: 'division_intro',
        title: 'Division Basics',
        description: 'Learn to divide and share',
        icon: '➗',
        color: 'from-teal-400 to-teal-600',
        ageRange: [9, 10],
        levels: 12,
        concepts: ['division']
    },
    fractions_compare: {
        id: 'fractions_compare',
        title: 'Comparing Fractions',
        description: 'Which fraction is bigger?',
        icon: '🍕',
        color: 'from-red-400 to-red-600',
        ageRange: [9, 10],
        levels: 12,
        concepts: ['fractions']
    },
    decimals_intro: {
        id: 'decimals_intro',
        title: 'Decimals',
        description: 'Learn about decimal numbers',
        icon: '🔢',
        color: 'from-cyan-400 to-cyan-600',
        ageRange: [9, 10],
        levels: 10,
        concepts: ['decimals']
    },

    // AGE 10 (Grade 5)
    multiplication_multi_digit: {
        id: 'multiplication_multi_digit',
        title: 'Multi-Digit Multiplication',
        description: 'Multiply bigger numbers',
        icon: '✖️',
        color: 'from-purple-400 to-purple-600',
        ageRange: [10, 10],
        levels: 12,
        concepts: ['multiplication']
    },
    division_advanced: {
        id: 'division_advanced',
        title: 'Long Division',
        description: 'Divide bigger numbers',
        icon: '➗',
        color: 'from-teal-400 to-teal-600',
        ageRange: [10, 10],
        levels: 12,
        concepts: ['division']
    },
    fractions_operations: {
        id: 'fractions_operations',
        title: 'Adding Fractions',
        description: 'Add and subtract fractions',
        icon: '🍕',
        color: 'from-red-400 to-red-600',
        ageRange: [10, 10],
        levels: 12,
        concepts: ['fractions']
    },
    decimals_operations: {
        id: 'decimals_operations',
        title: 'Decimal Operations',
        description: 'Add and subtract decimals',
        icon: '🔢',
        color: 'from-cyan-400 to-cyan-600',
        ageRange: [10, 10],
        levels: 12,
        concepts: ['decimals']
    },
    percentages_intro: {
        id: 'percentages_intro',
        title: 'Percentages',
        description: 'Learn about percents',
        icon: '💯',
        color: 'from-yellow-400 to-yellow-600',
        ageRange: [10, 10],
        levels: 10,
        concepts: ['percentages']
    },

    // NEW TRACKS - Word Problems, Money, Measurement, Data
    word_problems_basic: {
        id: 'word_problems_basic',
        title: 'Word Problems',
        description: 'Solve real-world math stories',
        icon: '📖',
        color: 'from-indigo-400 to-indigo-600',
        ageRange: [7, 8],
        levels: 10,
        concepts: ['word_problems']
    },
    word_problems_advanced: {
        id: 'word_problems_advanced',
        title: 'Advanced Word Problems',
        description: 'Multi-step problem solving',
        icon: '📚',
        color: 'from-indigo-500 to-indigo-700',
        ageRange: [9, 10],
        levels: 12,
        concepts: ['word_problems']
    },
    money_counting: {
        id: 'money_counting',
        title: 'Counting Money',
        description: 'Learn coins and bills',
        icon: '💰',
        color: 'from-green-400 to-green-600',
        ageRange: [6, 7],
        levels: 10,
        concepts: ['money']
    },
    money_change: {
        id: 'money_change',
        title: 'Making Change',
        description: 'Calculate change and prices',
        icon: '💵',
        color: 'from-green-500 to-green-700',
        ageRange: [8, 10],
        levels: 12,
        concepts: ['money']
    },
    measurement_length: {
        id: 'measurement_length',
        title: 'Measuring Length',
        description: 'Inches, feet, centimeters',
        icon: '📏',
        color: 'from-amber-400 to-amber-600',
        ageRange: [7, 9],
        levels: 10,
        concepts: ['measurement']
    },
    measurement_weight: {
        id: 'measurement_weight',
        title: 'Weight & Volume',
        description: 'Pounds, ounces, cups, liters',
        icon: '⚖️',
        color: 'from-amber-500 to-amber-700',
        ageRange: [8, 10],
        levels: 10,
        concepts: ['measurement']
    },
    data_graphs: {
        id: 'data_graphs',
        title: 'Reading Graphs',
        description: 'Bar graphs and charts',
        icon: '📊',
        color: 'from-cyan-400 to-cyan-600',
        ageRange: [8, 10],
        levels: 10,
        concepts: ['data']
    },
    patterns_algebra: {
        id: 'patterns_algebra',
        title: 'Patterns & Algebra',
        description: 'Find patterns and rules',
        icon: '🔢',
        color: 'from-violet-400 to-violet-600',
        ageRange: [9, 10],
        levels: 10,
        concepts: ['algebra']
    }
};

```

### src/data/concepts.ts

```typescript

export const MATH_CONCEPTS: Record<string, { title: string; explanation: { intro: string; visual: string; example: string; tip: string } }> = {
    counting: {
        title: 'Counting',
        explanation: {
            intro: 'Counting means saying numbers in order, one by one.',
            visual: 'Count each object by pointing at it!',
            example: 'Let\'s count together: 1, 2, 3, 4, 5!',
            tip: 'Touch each object as you count so you don\'t miss any!'
        }
    },
    number_recognition: {
        title: 'Number Recognition',
        explanation: {
            intro: 'Each number has its own special symbol and name.',
            visual: 'The symbol "5" represents five things.',
            example: 'When you see "3", that means three objects!',
            tip: 'Practice writing numbers and saying their names!'
        }
    },
    shapes: {
        title: 'Shapes',
        explanation: {
            intro: 'Shapes are all around us! Each shape has its own name.',
            visual: 'Circles are round, squares have 4 equal sides.',
            example: 'A ball is a circle, a book is a rectangle!',
            tip: 'Look for shapes in your house - windows, plates, doors!'
        }
    },
    colors: {
        title: 'Colors',
        explanation: {
            intro: 'Colors help us describe and sort things.',
            visual: 'Red apples, blue sky, yellow sun!',
            example: 'Can you find all the red things in your room?',
            tip: 'Colors make the world beautiful and help us organize!'
        }
    },
    comparison: {
        title: 'More or Less',
        explanation: {
            intro: 'We can compare groups to see which has MORE or LESS.',
            visual: 'Count each group and compare the numbers!',
            example: '5 cookies is MORE than 3 cookies!',
            tip: 'Line up objects to see which group is bigger!'
        }
    },
    addition: {
        title: 'Addition',
        explanation: {
            intro: 'Addition means putting numbers together to make a bigger number.',
            visual: 'Start with one group, then add more!',
            example: 'If you have 3 apples and get 2 more, now you have 5 apples total!',
            tip: 'You can count on your fingers or use objects to help!'
        }
    },
    subtraction: {
        title: 'Subtraction',
        explanation: {
            intro: 'Subtraction means taking away. The number gets smaller!',
            visual: 'Start with a group, then take some away.',
            example: 'If you have 5 cookies and eat 2, you have 3 left!',
            tip: 'You can count backwards or cross out objects!'
        }
    },
    number_bonds: {
        title: 'Number Bonds',
        explanation: {
            intro: 'Number bonds show how numbers can be split or combined.',
            visual: '5 can be split into 2 and 3, or 1 and 4!',
            example: '8 = 5 + 3, or 8 = 6 + 2, or 8 = 4 + 4',
            tip: 'Learning number bonds helps you add and subtract faster!'
        }
    },
    skip_counting: {
        title: 'Skip Counting',
        explanation: {
            intro: 'Skip counting means jumping by the same number each time.',
            visual: 'Count by 2s: 2, 4, 6, 8, 10!',
            example: 'Count by 5s: 5, 10, 15, 20, 25!',
            tip: 'Skip counting helps with multiplication later!'
        }
    },
    place_value: {
        title: 'Place Value',
        explanation: {
            intro: 'Each digit in a number has a special place - ones, tens, hundreds.',
            visual: '23 means 2 tens and 3 ones = 20 + 3',
            example: '45 = 4 tens + 5 ones = 40 + 5',
            tip: 'The position of a digit changes its value!'
        }
    },
    time: {
        title: 'Telling Time',
        explanation: {
            intro: 'Clocks help us know what time it is!',
            visual: 'The short hand shows hours, the long hand shows minutes.',
            example: 'When the long hand points to 12 and short hand to 3, it\'s 3 o\'clock!',
            tip: 'Start by learning the hour, then add minutes!'
        }
    },
    carrying: {
        title: 'Carrying in Addition',
        explanation: {
            intro: 'When adding makes a number bigger than 9, we carry to the next place.',
            visual: '27 + 6: First add 7+6=13, write 3 and carry the 1 ten',
            example: '27 + 6 = 2 tens + 13 ones = 3 tens + 3 ones = 33',
            tip: 'Think: Does my answer in the ones place make a new ten?'
        }
    },
    borrowing: {
        title: 'Borrowing in Subtraction',
        explanation: {
            intro: 'When we can\'t subtract, we borrow from the next place.',
            visual: '32 - 5: Can\'t take 5 from 2, so borrow 1 ten',
            example: '32 - 5: Borrow 1 ten, now it\'s 2 tens and 12 ones, 12-5=7, answer is 27',
            tip: 'Remember: Borrowing changes a ten into 10 ones!'
        }
    },
    multiplication: {
        title: 'Multiplication',
        explanation: {
            intro: 'Multiplication means making equal groups.',
            visual: '3 × 4 means "3 groups of 4"',
            example: '3 × 4 is the same as 4 + 4 + 4 = 12',
            tip: 'The first number tells you HOW MANY groups. The second tells you HOW MUCH in each group!'
        }
    },
    division: {
        title: 'Division',
        explanation: {
            intro: 'Division means splitting into equal groups or sharing fairly.',
            visual: '12 ÷ 3 means "split 12 into 3 equal groups"',
            example: '12 cookies shared among 3 friends = 4 cookies each',
            tip: 'Division is the opposite of multiplication!'
        }
    },
    fractions: {
        title: 'Fractions',
        explanation: {
            intro: 'Fractions show parts of a whole.',
            visual: '1/2 means 1 piece out of 2 equal pieces.',
            example: 'If you cut a pizza into 4 pieces, each piece is 1/4',
            tip: 'The bottom number shows how many pieces total, the top shows how many you have!'
        }
    },
    decimals: {
        title: 'Decimals',
        explanation: {
            intro: 'Decimals are another way to show parts of a whole.',
            visual: '0.5 is the same as 1/2 or one half',
            example: '$2.50 means 2 dollars and 50 cents (50/100 of a dollar)',
            tip: 'The dot is called a decimal point. Numbers after it are less than 1!'
        }
    },
    percentages: {
        title: 'Percentages',
        explanation: {
            intro: 'Percent means "out of 100". The symbol is %.',
            visual: '50% means 50 out of 100, which is half!',
            example: '25% is 25 out of 100, which is the same as 1/4',
            tip: '100% means the whole thing, 0% means none!'
        }
    },
    word_problems: {
        title: 'Word Problems',
        explanation: {
            intro: 'Word problems tell math stories! Read carefully to find the numbers.',
            visual: 'Look for key words: "total" means add, "left" means subtract.',
            example: 'If Sarah has 5 apples and gets 3 more, how many total? 5 + 3 = 8!',
            tip: 'Underline the numbers and circle what the question asks!'
        }
    },
    money: {
        title: 'Money',
        explanation: {
            intro: 'Money helps us buy things! We count coins and bills.',
            visual: 'Penny = 1¢, Nickel = 5¢, Dime = 10¢, Quarter = 25¢',
            example: '2 quarters + 1 dime = 25¢ + 25¢ + 10¢ = 60¢',
            tip: 'Start with the biggest coins first when counting!'
        }
    },
    measurement: {
        title: 'Measurement',
        explanation: {
            intro: 'Measurement tells us how long, heavy, or big something is.',
            visual: 'Inch, foot, yard for length. Ounce, pound for weight.',
            example: 'A pencil is about 7 inches long. Your height might be 4 feet!',
            tip: 'Use the right tool: ruler for length, scale for weight!'
        }
    },
    data: {
        title: 'Reading Graphs',
        explanation: {
            intro: 'Graphs show information in a picture! They help us compare things.',
            visual: 'Bar graphs use bars - taller bars mean more!',
            example: 'If the "apples" bar is at 5 and "oranges" is at 3, there are 2 more apples.',
            tip: 'Always read the labels on the bottom and side of the graph!'
        }
    },
    algebra: {
        title: 'Patterns & Algebra',
        explanation: {
            intro: 'Patterns repeat! Algebra helps us find what comes next.',
            visual: 'If the pattern is 2, 4, 6, 8... each number grows by 2!',
            example: 'Pattern: 5, 10, 15, 20... Rule: Add 5 each time. Next: 25!',
            tip: 'Look for what changes between numbers to find the rule!'
        }
    }
};

```

### src/services/db.ts

```typescript
import { DBState, User, Kid, ProgressLog, ErrorLog, Worksheet } from '../types';
import { StorageAdapter } from '../types';
import { LocalStorageAdapter } from './storage';

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
            offlineQueue: [],
            session: null
        };
    }

    init() {
        const stored = this.storage.get(this.STORAGE_KEY);
        if (stored) {
            // Merge stored data ensuring all keys exist
            this.db = { ...this.db, ...stored };
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
            achievements: []
        };
        this.db.kids.push(kid);
        this.save();
        return kid;
    }

    getKidsByUser(userId: string) {
        return this.db.kids.filter(k => k.user_id === userId);
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
}

// Singleton export
export const db = new DatabaseService(new LocalStorageAdapter());

```

### src/services/storage.ts

```typescript
import { StorageAdapter } from '../types';

export class LocalStorageAdapter implements StorageAdapter {
    get(key: string): any {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from storage', error);
            return null;
        }
    }

    set(key: string, value: any): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to storage', error);
        }
    }

    remove(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}

```

### src/utils/questionGenerator.ts

```typescript
import { MATH_TRACKS } from '../data/tracks';
import { Question } from '../types';

export const generateQuestion = (trackId: string, level: number, difficulty: number, kidAge: number): Question => {
    const track = MATH_TRACKS[trackId];
    if (!track || !track.concepts || track.concepts.length === 0) {
        return generateCountingQuestion(level, difficulty, kidAge);
    }

    const concept = track.concepts[0]; // Use primary concept

    switch (concept) {
        case 'counting':
            return generateCountingQuestion(level, difficulty, kidAge);
        case 'number_recognition':
            return generateNumberRecognitionQuestion(level, difficulty, kidAge);
        case 'shapes':
            return generateShapesQuestion(level, difficulty, kidAge);
        case 'colors':
            return generateColorsQuestion(level, difficulty, kidAge);
        case 'comparison':
            return generateComparisonQuestion(level, difficulty, kidAge);
        case 'addition':
            return generateAdditionQuestion(level, difficulty, kidAge);
        case 'subtraction':
            return generateSubtractionQuestion(level, difficulty, kidAge);
        case 'number_bonds':
            return generateNumberBondsQuestion(level, difficulty, kidAge);
        case 'skip_counting':
            return generateSkipCountingQuestion(level, difficulty, kidAge);
        case 'place_value':
            return generatePlaceValueQuestion(level, difficulty, kidAge);
        case 'time':
            return generateTimeQuestion(level, difficulty, kidAge);
        case 'multiplication':
            return generateMultiplicationQuestion(level, difficulty, kidAge);
        case 'division':
            return generateDivisionQuestion(level, difficulty, kidAge);
        case 'fractions':
            return generateFractionsQuestion(level, difficulty, kidAge);
        case 'decimals':
            return generateDecimalsQuestion(level, difficulty, kidAge);
        case 'percentages':
            return generatePercentagesQuestion(level, difficulty, kidAge);
        case 'word_problems':
            return generateWordProblemQuestion(level, difficulty, kidAge);
        case 'money':
            return generateMoneyQuestion(level, difficulty, kidAge);
        case 'measurement':
            return generateMeasurementQuestion(level, difficulty, kidAge);
        case 'data':
            return generateDataQuestion(level, difficulty, kidAge);
        case 'algebra':
            return generateAlgebraQuestion(level, difficulty, kidAge);
        default:
            return generateCountingQuestion(level, difficulty, kidAge);
    }
};

const generateCountingQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const maxCount = kidAge === 5 ? Math.min(5 + level, 10) :
        kidAge === 6 ? Math.min(10 + level, 20) :
            Math.min(20 + level * 5, 100);
    const count = Math.floor(Math.random() * maxCount) + 1;
    const objects = ['🍎', '⭐', '🎈', '🐶', '🚗', '🏀', '🌸', '🦋', '🍪', '🎨'];
    const obj = objects[Math.floor(Math.random() * objects.length)];

    return {
        concept: 'counting',
        question: `How many ${obj} are there?`,
        visual: Array(count).fill(obj),
        correctAnswer: count,
        options: [count, count + 1, count - 1, count + 2].filter(n => n > 0).sort(() => Math.random() - 0.5),
        explanation: {
            visual: Array(count).fill(obj),
            steps: [
                'Let\'s count together!',
                'Point at each one as we count.',
                `Count: ${Array(count).fill(obj).map((_, i) => i + 1).join(', ')}`,
                `There are ${count} ${obj}!`
            ]
        }
    };
};

const generateNumberRecognitionQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const max = 10;
    const number = Math.floor(Math.random() * max) + 1;
    const objects = ['🔵', '⭐', '🎈'];
    const obj = objects[Math.floor(Math.random() * objects.length)];

    return {
        concept: 'number_recognition',
        question: `Which number matches these ${obj}?`,
        visual: Array(number).fill(obj),
        correctAnswer: number,
        options: [number, number + 1, number - 1, number + 2].filter(n => n > 0 && n <= 10).sort(() => Math.random() - 0.5),
        explanation: {
            visual: Array(number).fill(obj),
            steps: [
                `Let's count the ${obj}:`,
                `${Array(number).fill(obj).join(' ')}`,
                `We counted ${number} objects.`,
                `The number ${number} represents ${number} things!`
            ]
        }
    };
};

const generateShapesQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const shapes = [
        { name: 'circle', emoji: '⚪', description: 'round shape' },
        { name: 'square', emoji: '🟦', description: '4 equal sides' },
        { name: 'triangle', emoji: '🔺', description: '3 sides' },
        { name: 'rectangle', emoji: '🟩', description: '4 sides, 2 long 2 short' }
    ];

    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
    const options = shapes.map(s => s.emoji);

    return {
        concept: 'shapes',
        question: `Find the ${targetShape.name}!`,
        visual: options,
        correctAnswer: targetShape.emoji,
        options: options.sort(() => Math.random() - 0.5),
        explanation: {
            visual: [targetShape.emoji],
            steps: [
                `A ${targetShape.name} is a ${targetShape.description}.`,
                `This is a ${targetShape.name}: ${targetShape.emoji}`,
                `Look for shapes around you!`,
                `Can you find a ${targetShape.name} in your room?`
            ]
        }
    };
};

const generateColorsQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const colors = [
        { name: 'red', emoji: '🔴' },
        { name: 'blue', emoji: '🔵' },
        { name: 'yellow', emoji: '🟡' },
        { name: 'green', emoji: '🟢' }
    ];

    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    const options = colors.map(c => c.emoji);

    return {
        concept: 'colors',
        question: `Which one is ${targetColor.name}?`,
        visual: options,
        correctAnswer: targetColor.emoji,
        options: options.sort(() => Math.random() - 0.5),
        explanation: {
            visual: [targetColor.emoji],
            steps: [
                `This is the color ${targetColor.name}: ${targetColor.emoji}`,
                `Colors help us describe things!`,
                `Can you find something ${targetColor.name} near you?`,
                `Learning colors is fun and useful!`
            ]
        }
    };
};

const generateComparisonQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const countA = Math.floor(Math.random() * 8) + 2;
    const countB = countA + Math.floor(Math.random() * 3) + 1;
    const obj = ['🍎', '⭐', '🎈'][Math.floor(Math.random() * 3)];

    return {
        concept: 'comparison',
        question: `Which group has MORE ${obj}?`,
        visual: {
            groupA: Array(countA).fill(obj),
            groupB: Array(countB).fill(obj)
        },
        correctAnswer: 'Group B',
        options: ['Group A', 'Group B'].sort(() => Math.random() - 0.5),
        explanation: {
            visual: {
                groupA: Array(countA).fill(obj),
                groupB: Array(countB).fill(obj)
            },
            steps: [
                `Group A has ${countA} ${obj}`,
                `Group B has ${countB} ${obj}`,
                `${countB} is MORE than ${countA}`,
                `Group B has MORE!`
            ]
        }
    };
};

const generateAdditionQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const max = kidAge <= 6 ? 5 : kidAge <= 7 ? 10 : kidAge <= 8 ? 20 : 50;
    const a = Math.floor(Math.random() * Math.min(max, 5 + level)) + 1;
    const b = Math.floor(Math.random() * Math.min(max, 5 + level)) + 1;
    const answer = a + b;

    return {
        concept: 'addition',
        question: `What is ${a} + ${b}?`,
        visual: {
            groupA: Array(a).fill('🔵'),
            groupB: Array(b).fill('🔵')
        },
        correctAnswer: answer,
        options: [answer, answer + 1, answer - 1, answer + 2].filter(n => n > 0).sort(() => Math.random() - 0.5),
        explanation: {
            visual: {
                groupA: Array(a).fill('🔵'),
                groupB: Array(b).fill('🔵'),
                combined: Array(answer).fill('🔵')
            },
            steps: [
                `Start with ${a}: ${Array(a).fill('🔵').join('')}`,
                `Add ${b} more: ${Array(b).fill('🔵').join('')}`,
                'Count them all together:',
                `${Array(answer).fill('🔵').join('')}`,
                `${a} + ${b} = ${answer}!`
            ]
        }
    };
};

const generateSubtractionQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const max = kidAge <= 6 ? 10 : kidAge <= 7 ? 20 : kidAge <= 8 ? 20 : 50;
    const a = Math.floor(Math.random() * Math.min(max, 5 + level)) + 3;
    const b = Math.floor(Math.random() * (a - 1)) + 1;
    const answer = a - b;

    return {
        concept: 'subtraction',
        question: `What is ${a} - ${b}?`,
        visual: {
            start: Array(a).fill('⭐'),
            takeAway: b
        },
        correctAnswer: answer,
        options: [answer, answer + 1, answer - 1, answer + 2].filter(n => n >= 0).sort(() => Math.random() - 0.5),
        explanation: {
            visual: {
                start: Array(a).fill('⭐'),
                removed: Array(b).fill('❌'),
                remaining: Array(answer).fill('⭐')
            },
            steps: [
                `Start with ${a}: ${Array(a).fill('⭐').join('')}`,
                `Take away ${b}: ${Array(b).fill('❌').join('')}`,
                `Count what's left: ${Array(answer).fill('⭐').join('')}`,
                `${a} - ${b} = ${answer}!`
            ]
        }
    };
};

const generateNumberBondsQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const total = Math.floor(Math.random() * 5) + 5; // 5-10
    const part1 = Math.floor(Math.random() * (total - 1)) + 1;
    const part2 = total - part1;

    return {
        concept: 'number_bonds',
        question: `${total} = ${part1} + ?`,
        visual: {
            total: Array(total).fill('🔵'),
            part1: Array(part1).fill('🔵'),
            part2: part2
        },
        correctAnswer: part2,
        options: [part2, part2 + 1, part2 - 1, part2 + 2].filter(n => n > 0).sort(() => Math.random() - 0.5),
        explanation: {
            visual: {
                total: Array(total).fill('🔵'),
                split: [Array(part1).fill('🔵'), Array(part2).fill('🔵')]
            },
            steps: [
                `${total} can be split into ${part1} and ${part2}`,
                `${part1} + ${part2} = ${total}`,
                `So ${total} = ${part1} + ${part2}!`,
                `Number bonds help you see how numbers fit together!`
            ]
        }
    };
};

const generateSkipCountingQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const skipBy = [2, 5, 10][Math.floor(Math.random() * 3)];
    const start = skipBy;
    const length = 4;
    const sequence = Array(length).fill(0).map((_, i) => start + (i * skipBy));

    return {
        concept: 'skip_counting',
        question: `Count by ${skipBy}s. What comes next after ${sequence[length - 2]}?`,
        visual: sequence.slice(0, -1).map(n => `${n}`),
        correctAnswer: sequence[length - 1],
        options: [sequence[length - 1], sequence[length - 1] + 1, sequence[length - 1] + skipBy, sequence[length - 1] - skipBy].sort(() => Math.random() - 0.5),
        explanation: {
            visual: sequence.map(n => `${n}`),
            steps: [
                `When we count by ${skipBy}s, we add ${skipBy} each time.`,
                `${sequence.join(', ')}`,
                `${sequence[length - 2]} + ${skipBy} = ${sequence[length - 1]}`,
                `The next number is ${sequence[length - 1]}!`
            ]
        }
    };
};

const generatePlaceValueQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const tens = Math.floor(Math.random() * 9) + 1;
    const ones = Math.floor(Math.random() * 10);
    const number = tens * 10 + ones;

    // Generate unique options
    const optionsSet = new Set<number>();
    optionsSet.add(tens);
    optionsSet.add(tens + 1);
    optionsSet.add(tens - 1);
    if (ones !== tens) optionsSet.add(ones);

    // Fill with randoms if needed
    while (optionsSet.size < 4) {
        optionsSet.add(Math.floor(Math.random() * 10) + 1);
    }

    const options = Array.from(optionsSet).slice(0, 4).sort(() => Math.random() - 0.5);

    return {
        concept: 'place_value',
        question: `How many tens are in ${number}?`,
        visual: { number, tens, ones },
        correctAnswer: tens,
        options: options,
        explanation: {
            visual: { number, tens, ones },
            steps: [
                `${number} has two digits.`,
                `The ${tens} is in the tens place = ${tens * 10}`,
                `The ${ones} is in the ones place = ${ones}`,
                `${number} = ${tens} tens + ${ones} ones = ${tens * 10} + ${ones}`
            ]
        }
    };
};

const generateTimeQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const hour = Math.floor(Math.random() * 12) + 1;
    const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const timeStr = minute === 0 ? `${hour}:00` : `${hour}:${minute}`;

    return {
        concept: 'time',
        question: `What time is shown?`,
        visual: { hour, minute, display: `🕐 ${timeStr}` },
        correctAnswer: timeStr,
        options: [timeStr, `${hour + 1}:00`, `${hour}:${minute + 15}`, `${hour - 1}:30`].sort(() => Math.random() - 0.5),
        explanation: {
            visual: { display: `🕐 ${timeStr}` },
            steps: [
                `The short hand points to the hour: ${hour}`,
                minute === 0 ? 'The long hand points to 12: that means :00' : `The long hand shows minutes: ${minute}`,
                `The time is ${timeStr}`,
                `Practice reading clocks at home!`
            ]
        }
    };
};

const generateMultiplicationQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const maxFactor = kidAge <= 8 ? 5 : kidAge <= 9 ? 10 : 12;
    const a = Math.floor(Math.random() * Math.min(maxFactor, 2 + level)) + 2;
    const b = Math.floor(Math.random() * Math.min(maxFactor, 2 + level)) + 2;
    const answer = a * b;

    return {
        concept: 'multiplication',
        question: `What is ${a} × ${b}?`,
        visual: {
            groups: a,
            perGroup: b
        },
        correctAnswer: answer,
        options: [answer, answer + a, answer - a, answer + b].sort(() => Math.random() - 0.5),
        explanation: {
            visual: {
                groups: Array(a).fill(null).map(() => Array(b).fill('🔷'))
            },
            steps: [
                `${a} × ${b} means "${a} groups of ${b}"`,
                `Let's count each group:`,
                ...Array(a).fill(null).map((_, i) => `Group ${i + 1}: ${Array(b).fill('🔷').join(' ')}`),
                `That's ${b} ` + `+ ${b} `.repeat(a - 2) + `+ ${b} = ${answer}`,
                `So ${a} × ${b} = ${answer}!`
            ]
        }
    };
};

const generateDivisionQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const divisor = Math.floor(Math.random() * 5) + 2;
    const quotient = Math.floor(Math.random() * 8) + 2;
    const dividend = divisor * quotient;

    return {
        concept: 'division',
        question: `What is ${dividend} ÷ ${divisor}?`,
        visual: {
            total: dividend,
            groups: divisor
        },
        correctAnswer: quotient,
        options: [quotient, quotient + 1, quotient - 1, divisor].filter(n => n > 0).sort(() => Math.random() - 0.5),
        explanation: {
            visual: {
                total: Array(dividend).fill('🔵'),
                groups: Array(divisor).fill(null).map(() => Array(quotient).fill('🔵'))
            },
            steps: [
                `${dividend} ÷ ${divisor} means "split ${dividend} into ${divisor} equal groups"`,
                `Let's share ${dividend} objects into ${divisor} groups:`,
                `Each group gets ${quotient} objects!`,
                `${dividend} ÷ ${divisor} = ${quotient}`
            ]
        }
    };
};

const generateFractionsQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const fractions = [
        { display: '1/2', value: 0.5, name: 'one half', visual: '🟦🟦', total: 2, filled: 1 },
        { display: '1/4', value: 0.25, name: 'one quarter', visual: '🟦🟦🟦🟦', total: 4, filled: 1 },
        { display: '3/4', value: 0.75, name: 'three quarters', visual: '🟦🟦🟦🟦', total: 4, filled: 3 },
        { display: '1/3', value: 0.33, name: 'one third', visual: '🟦🟦🟦', total: 3, filled: 1 },
        { display: '2/3', value: 0.67, name: 'two thirds', visual: '🟦🟦🟦', total: 3, filled: 2 },
        { display: '1/5', value: 0.2, name: 'one fifth', visual: '🟦🟦🟦🟦🟦', total: 5, filled: 1 },
        { display: '2/5', value: 0.4, name: 'two fifths', visual: '🟦🟦🟦🟦🟦', total: 5, filled: 2 },
        { display: '3/5', value: 0.6, name: 'three fifths', visual: '🟦🟦🟦🟦🟦', total: 5, filled: 3 }
    ];

    const index = (level * 17 + Math.floor(Math.random() * fractions.length)) % fractions.length;
    const fraction = fractions[index];

    const visualArray = [];
    for (let i = 0; i < fraction.total; i++) {
        visualArray.push(i < fraction.filled ? '🟦' : '⬜');
    }

    const wrongOptions = fractions
        .filter(f => f.display !== fraction.display)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(f => f.display);

    const allOptions = [fraction.display, ...wrongOptions].sort(() => Math.random() - 0.5);

    return {
        concept: 'fractions',
        question: `Which shows ${fraction.name}?`,
        visual: visualArray.join(''),
        correctAnswer: fraction.display,
        options: allOptions,
        explanation: {
            visual: visualArray.join(''),
            steps: [
                `${fraction.display} means ${fraction.name}`,
                `We have ${fraction.total} equal pieces total (bottom number)`,
                `${fraction.filled} piece${fraction.filled > 1 ? 's' : ''} ${fraction.filled > 1 ? 'are' : 'is'} filled (top number)`,
                `Visual: ${visualArray.map((v, i) => i < fraction.filled ? '🟦 (filled)' : '⬜ (empty)').join(' ')}`,
                `So the answer is ${fraction.display}!`
            ]
        }
    };
};

const generateDecimalsQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const whole = Math.floor(Math.random() * 5);
    const decimal = [0, 0.25, 0.5, 0.75][Math.floor(Math.random() * 4)];
    const number = whole + decimal;

    return {
        concept: 'decimals',
        question: `What is ${number} as a decimal?`,
        visual: { number: number.toString() },
        correctAnswer: number,
        options: [number, number + 0.5, number + 1, number - 0.5].filter(n => n >= 0).sort(() => Math.random() - 0.5),
        explanation: {
            visual: { number: number.toString() },
            steps: [
                `${number} is a decimal number`,
                `The number before the decimal point is ${whole}`,
                `The number after the decimal point is ${decimal}`,
                `Decimals help us show parts of a whole!`
            ]
        }
    };
};

const generatePercentagesQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const percentages = [25, 50, 75, 100];
    const percent = percentages[Math.floor(Math.random() * percentages.length)];
    const total = 100;
    const amount = (percent / 100) * total;

    return {
        concept: 'percentages',
        question: `What is ${percent}% of ${total}?`,
        visual: { percent, total },
        correctAnswer: amount,
        options: [amount, amount + 10, amount - 10, percent].sort(() => Math.random() - 0.5),
        explanation: {
            visual: { percent, total, amount },
            steps: [
                `${percent}% means ${percent} out of 100`,
                `To find ${percent}% of ${total}:`,
                `${percent} ÷ 100 × ${total} = ${amount}`,
                `${percent}% of ${total} = ${amount}!`
            ]
        }
    };
};

const generateWordProblemQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const problems = [
        {
            story: "Sarah has 8 apples. She gives 3 to her friend. How many apples does Sarah have left?",
            answer: 5,
            visual: { start: 8, action: "gave away", amount: 3 }
        },
        {
            story: "Tom has 6 toy cars. His mom buys him 4 more. How many toy cars does Tom have now?",
            answer: 10,
            visual: { start: 6, action: "got", amount: 4 }
        },
        {
            story: "There are 12 cookies. 4 children share them equally. How many cookies does each child get?",
            answer: 3,
            visual: { total: 12, groups: 4, action: "share equally" }
        },
        {
            story: "Emma reads 5 pages on Monday and 7 pages on Tuesday. How many pages did she read in total?",
            answer: 12,
            visual: { day1: 5, day2: 7, action: "total" }
        }
    ];

    const problem = problems[Math.floor(Math.random() * problems.length)];

    return {
        concept: 'word_problems',
        question: problem.story,
        visual: problem.visual,
        correctAnswer: problem.answer,
        options: [problem.answer, problem.answer + 1, problem.answer - 1, problem.answer + 2].filter(n => n > 0).sort(() => Math.random() - 0.5),
        explanation: {
            visual: problem.visual,
            steps: [
                "Let's break down the problem:",
                `Key numbers: ${JSON.stringify(problem.visual)}`,
                `The answer is ${problem.answer}!`,
                "Always read carefully and find the important numbers!"
            ]
        }
    };
};

const generateMoneyQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const coins = [
        { name: 'penny', value: 1, emoji: '🪙' },
        { name: 'nickel', value: 5, emoji: '🪙' },
        { name: 'dime', value: 10, emoji: '🪙' },
        { name: 'quarter', value: 25, emoji: '🪙' }
    ];

    const coin1 = coins[Math.floor(Math.random() * coins.length)];
    const count = Math.floor(Math.random() * 5) + 1;
    const total = coin1.value * count;

    return {
        concept: 'money',
        question: `How much is ${count} ${coin1.name}${count > 1 ? 's' : ''}?`,
        visual: { coin: coin1.name, count, value: coin1.value },
        correctAnswer: total,
        options: [total, total + 5, total - 5, total + 10].filter(n => n > 0).sort(() => Math.random() - 0.5),
        explanation: {
            visual: Array(count).fill(coin1.emoji),
            steps: [
                `Each ${coin1.name} = ${coin1.value}¢`,
                `${count} ${coin1.name}${count > 1 ? 's' : ''} = ${count} × ${coin1.value}¢`,
                `${count} × ${coin1.value} = ${total}¢`,
                `Answer: ${total}¢!`
            ]
        }
    };
};

const generateMeasurementQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const measurements = [
        { question: "How many inches in 1 foot?", answer: 12, unit: "inches" },
        { question: "How many feet in 1 yard?", answer: 3, unit: "feet" },
        { question: "How many ounces in 1 pound?", answer: 16, unit: "ounces" },
        { question: "A pencil is about how many inches long?", answer: 7, unit: "inches" }
    ];

    const m = measurements[Math.floor(Math.random() * measurements.length)];

    return {
        concept: 'measurement',
        question: m.question,
        visual: { unit: m.unit, answer: m.answer },
        correctAnswer: m.answer,
        options: [m.answer, m.answer + 1, m.answer - 1, m.answer + 2].filter(n => n > 0).sort(() => Math.random() - 0.5),
        explanation: {
            visual: { unit: m.unit },
            steps: [
                `The answer is ${m.answer} ${m.unit}`,
                "Measurement helps us compare sizes!",
                "Remember these common conversions.",
                "Practice measuring things at home!"
            ]
        }
    };
};

const generateDataQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const data: Record<string, number> = {
        apples: Math.floor(Math.random() * 10) + 1,
        oranges: Math.floor(Math.random() * 10) + 1,
        bananas: Math.floor(Math.random() * 10) + 1
    };

    const fruits = Object.keys(data);
    const targetFruit = fruits[Math.floor(Math.random() * fruits.length)];
    const answer = data[targetFruit];

    return {
        concept: 'data',
        question: `Look at the graph. How many ${targetFruit} are there?`,
        visual: data,
        correctAnswer: answer,
        options: [answer, answer + 1, answer - 1, data[fruits[0]]].filter((v, i, a) => a.indexOf(v) === i).sort(() => Math.random() - 0.5),
        explanation: {
            visual: data,
            steps: [
                `Look at the bar for ${targetFruit}`,
                `The bar reaches ${answer}`,
                `So there are ${answer} ${targetFruit}!`,
                "Always check the labels on graphs!"
            ]
        }
    };
};

const generateAlgebraQuestion = (level: number, difficulty: number, kidAge: number): Question => {
    const start = Math.floor(Math.random() * 10) + 1;
    const step = Math.floor(Math.random() * 5) + 1;
    const length = 4;
    const sequence = Array(length).fill(0).map((_, i) => start + (i * step));
    const next = start + (length * step);

    return {
        concept: 'algebra',
        question: `What number comes next? ${sequence.join(', ')}, __`,
        visual: sequence,
        correctAnswer: next,
        options: [next, next + 1, next - 1, next + step].sort(() => Math.random() - 0.5),
        explanation: {
            visual: sequence,
            steps: [
                `Look at the pattern: ${sequence.join(', ')}`,
                `Each number increases by ${step}`,
                `${sequence[length - 1]} + ${step} = ${next}`,
                `The next number is ${next}!`
            ]
        }
    };
};

```

### src/utils/worksheetGenerator.ts

```typescript
import { db } from '../services/db';
import { Worksheet } from '../types';

export const aggregateErrors = (kidId: string, daysBack = 7) => {
    const recentErrors = db.getErrors(kidId, daysBack);

    const grouped: Record<string, number> = {};
    recentErrors.forEach(e => {
        grouped[e.error_type] = (grouped[e.error_type] || 0) + 1;
    });

    return Object.entries(grouped)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
};

export const generateWorksheet = async (kidId: string): Promise<Worksheet | null> => {
    const kid = db.getKid(kidId);
    if (!kid) return null;

    const errors = aggregateErrors(kidId);

    if (errors.length === 0) {
        return null;
    }

    const worksheet: Worksheet = {
        id: `ws_${Date.now()}`,
        kid_id: kidId,
        period_start: new Date(Date.now() - 7 * 86400000).toISOString(),
        period_end: new Date().toISOString(),
        status: 'generated',
        focus_areas: errors,
        created_at: new Date().toISOString(),
        pdf_url: `worksheet_${kidId}_${Date.now()}.pdf`
    };

    db.addWorksheet(worksheet);
    return worksheet;
};

```

### src/utils/stats.ts

```typescript
import { db } from '../services/db';

export const getKidStats = (kidId: string) => {
    const completed = db.getCompletedProgress(kidId);
    const errors = db.getErrors(kidId, -1); // Get all errors

    // Calculate accuracy by track
    const trackStats: Record<string, { correct: number, total: number, timeSpent: number }> = {};

    completed.forEach(p => {
        if (!trackStats[p.track_id]) {
            trackStats[p.track_id] = { correct: 0, total: 0, timeSpent: 0 };
        }
        trackStats[p.track_id].total++;
        // Assuming score >= 80 is "correct" for the session level. 
        // Wait, original code said: if (p.score >= 80) trackStats[p.track_id].correct++;
        // But then totalQuestions was reduced from attempts...
        // Let's stick to original logic:

        // Original logic:
        // trackStats[p.track_id].total++;
        // if (p.score >= 80) trackStats[p.track_id].correct++;
        // trackStats[p.track_id].timeSpent += p.time_spent_seconds;

        if (p.score >= 80) {
            trackStats[p.track_id].correct++;
        }
        trackStats[p.track_id].timeSpent += p.time_spent_seconds;
    });

    const totalQuestions = completed.reduce((sum, p) => sum + (p.attempts || 1), 0);
    // Correct answers based on score? Original code: 
    // const correctAnswers = completed.reduce((sum, p) => sum + (p.score >= 100 ? 1 : 0), 0);
    // That seems weird if one session = 10 questions.
    // Actually the original code's "Progress" entry seems to map to a *Level* attempt, not a single question.
    // "logLevelComplete" sets score=100 if correct.
    // So yes, a "completed" entry with score 100 is 1 correct level?
    // But wait, `logLevelComplete` is called AFTER a question is answered correctly?
    // Original `handleAnswer`:
    // if correct: logLevelComplete(..., 100, timeSpent).
    // So yes, each entry in `progress` is actually a *Question* (or Level if 1 Q per Level?).
    // Original `GameScreen` increments `currentLevel` after correct answer.
    // So 1 Level = 1 Question in this app's logic.

    const correctAnswers = completed.length; // Since we only log 'completed' on 100 score?
    // completed = status === 'completed'.
    // In original code: setScore(score + 100); setGameState('correct'); logLevelComplete(..., 100, ...);
    // So yes, every completed log is a correct answer.

    // Wait, let's look at `getKidStats` original again.
    // const correctAnswers = completed.reduce((sum, p) => sum + (p.score >= 100 ? 1 : 0), 0);
    // If `logLevelComplete` is ALWAYS called with 100, then this is just `completed.length`.

    const overallAccuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return {
        levelsCompleted: completed.length,
        totalErrors: errors.length,
        avgScore: completed.length > 0 ? Math.round(completed.reduce((sum, p) => sum + p.score, 0) / completed.length) : 0,
        totalPlayTime: completed.reduce((sum, p) => sum + p.time_spent_seconds, 0),
        trackStats,
        overallAccuracy,
        totalQuestions,
        correctAnswers
    };
};

```

### src/components/auth/LoginScreen.tsx

```typescript
import React, { useState } from 'react';
import { Star, Check } from 'lucide-react';
import { db } from '../../services/db';
import { User } from '../../types';

interface LoginScreenProps {
    onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [parentAge, setParentAge] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showMathChallenge, setShowMathChallenge] = useState(false);
    const [mathAnswer, setMathAnswer] = useState('');
    const [mathQuestion, setMathQuestion] = useState({ q: '', a: '' });
    const [showConfirmation, setShowConfirmation] = useState(false);

    const generateMathChallenge = () => {
        const num1 = Math.floor(Math.random() * 9) + 2;
        const num2 = Math.floor(Math.random() * 9) + 2;
        setMathQuestion({
            q: `${num1} × ${num2} = ?`,
            a: String(num1 * num2)
        });
    };

    const validateSignupForm = () => {
        if (!firstName.trim()) { setError('Please enter your first name'); return false; }
        if (!surname.trim()) { setError('Please enter your surname'); return false; }
        if (!email.trim()) { setError('Please enter your email'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address'); return false; }
        if (!parentAge || parseInt(parentAge) < 18) { setError('You must be at least 18 years old'); return false; }
        if (!password || password.length < 6) { setError('Password must be at least 6 characters'); return false; }
        if (password !== confirmPassword) { setError('Passwords do not match'); return false; }

        // In a real app we would check DB here, but for now relying on subsequent call or we can add check
        // const existing = db.users.find.... accessed via service
        return true;
    };

    const handleButtonClick = () => {
        setError('');

        if (isSignup) {
            if (!validateSignupForm()) {
                return;
            }

            setLoading(true);
            setTimeout(() => {
                generateMathChallenge();
                setShowMathChallenge(true);
                setLoading(false);
            }, 300);
        } else {
            setLoading(true);
            setTimeout(() => {
                const user = db.login(email, password);
                if (user) {
                    onLogin(user);
                } else {
                    setError('Invalid email or password');
                }
                setLoading(false);
            }, 300);
        }
    };

    const handleMathButtonClick = () => {
        if (mathAnswer === mathQuestion.a) {
            const user = db.createUser(email, password, firstName, surname, parentAge);
            setShowMathChallenge(false);
            setShowConfirmation(true);
            console.log(`📧 Email sent to ${email}: Your Kids Learning account has been created!`);

            setTimeout(() => {
                db.login(email, password);
                onLogin(user);
            }, 3000);
        } else {
            setError('Incorrect answer. Please try again.');
            setMathAnswer('');
            generateMathChallenge();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
                        <Star className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Kids Math Learning</h1>
                    <p className="text-gray-600">Help your child master math through play</p>
                </div>

                {showConfirmation ? (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Account Created!</h2>
                        <p className="text-gray-600 mb-2">A confirmation email has been sent to:</p>
                        <p className="font-semibold text-gray-800 mb-4">{email}</p>
                        <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
                    </div>
                ) : showMathChallenge ? (
                    <div>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🧮</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Quick Math Check</h2>
                            <p className="text-gray-600 text-sm">Complete this to finish sign up</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-purple-50 rounded-2xl p-6 text-center">
                                <p className="text-3xl font-bold text-gray-800 mb-4">{mathQuestion.q}</p>
                                <input
                                    type="number"
                                    value={mathAnswer}
                                    onChange={(e) => setMathAnswer(e.target.value)}
                                    className="w-32 px-4 py-3 border-2 border-purple-300 rounded-lg text-center text-2xl font-bold focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="?"
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMathChallenge(false);
                                        setMathAnswer('');
                                        setError('');
                                    }}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleMathButtonClick}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                                >
                                    Complete Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {isSignup && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
                                This app stores learning progress for your child under your account.
                            </div>
                        )}

                        <div className="space-y-4">
                            {isSignup && (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Surname</label>
                                            <input
                                                type="text"
                                                value={surname}
                                                onChange={(e) => setSurname(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Age</label>
                                        <input
                                            type="number"
                                            value={parentAge}
                                            onChange={(e) => setParentAge(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="Must be 18+"
                                            min="18"
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="parent@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>

                            {isSignup && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="••••••••"
                                        minLength={6}
                                    />
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleButtonClick}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {loading ? 'Loading...' : (isSignup ? 'Continue to Math Challenge' : 'Log In')}
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setError('');
                                setFirstName('');
                                setSurname('');
                                setParentAge('');
                                setConfirmPassword('');
                            }}
                            className="w-full mt-4 text-purple-600 hover:text-purple-700 font-medium"
                        >
                            {isSignup ? 'Already have an account? Log in' : 'Need an account? Sign up'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

```

### src/components/dashboard/Dashboard.tsx

```typescript
import React, { useState, useEffect, useMemo } from 'react';
import { User, LogOut, Plus, Trophy, Zap, ArrowRight } from 'lucide-react';
import { User as UserType, Kid } from '../../types';
import { db } from '../../services/db';
import { getKidStats } from '../../utils/stats';
import { AddKidModal } from './AddKidModal';

interface DashboardProps {
    user: UserType;
    onLogout: () => void;
    onSelectKid: (kid: Kid) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onSelectKid }) => {
    const [kids, setKids] = useState<Kid[]>([]);
    const [showAddKid, setShowAddKid] = useState(false);

    useEffect(() => {
        const userKids = db.getKidsByUser(user.id);
        setKids(userKids);
    }, [user.id, showAddKid]); // Refresh when add modal closes

    const handleAddKid = (kid: Kid) => {
        setKids([...kids, kid]);
        setShowAddKid(false);
    };

    // Memoize stats calculation to prevent recalculation on every render
    // In a real app with Redux/Context, this would be computed in the selector
    const kidStatsMap = useMemo(() => {
        const stats: Record<string, ReturnType<typeof getKidStats>> = {};
        kids.forEach(kid => {
            stats[kid.id] = getKidStats(kid.id);
        });
        return stats;
    }, [kids]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-1">Parent Dashboard</h1>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>

                {kids.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mb-6">
                            <User className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome! Let's get started</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Create your first kid profile to begin their math learning journey
                        </p>
                        <button
                            onClick={() => setShowAddKid(true)}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
                        >
                            <Plus className="w-6 h-6" />
                            Add Kid Profile
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Kid Profiles</h2>
                            <button
                                onClick={() => setShowAddKid(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-300 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Add Kid
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {kids.map(kid => {
                                const stats = kidStatsMap[kid.id];
                                return (
                                    <div key={kid.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-5xl">{kid.avatar}</div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">{kid.name}</h3>
                                                    <p className="text-sm text-gray-500">Age {kid.age}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <div className="bg-purple-50 rounded-lg p-3 text-center">
                                                <Trophy className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                                                <p className="text-2xl font-bold text-purple-600">{stats.levelsCompleted}</p>
                                                <p className="text-xs text-gray-600">Levels</p>
                                            </div>
                                            <div className="bg-pink-50 rounded-lg p-3 text-center">
                                                <Zap className="w-5 h-5 text-pink-500 mx-auto mb-1" />
                                                <p className="text-2xl font-bold text-pink-600">{kid.streak}</p>
                                                <p className="text-xs text-gray-600">Streak</p>
                                            </div>
                                            <div className="bg-yellow-50 rounded-lg p-3 text-center">
                                                <span className="text-2xl mx-auto mb-1">🪙</span>
                                                <p className="text-2xl font-bold text-yellow-600">{kid.coins || 0}</p>
                                                <p className="text-xs text-gray-600">Coins</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => onSelectKid(kid)}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                        >
                                            Select
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {showAddKid && (
                    <AddKidModal
                        userId={user.id}
                        onClose={() => setShowAddKid(false)}
                        onAdd={handleAddKid}
                    />
                )}
            </div>
        </div>
    );
};

```

### src/components/dashboard/ParentGate.tsx

```typescript
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

```

### src/components/dashboard/AddKidModal.tsx

```typescript
import React, { useState } from 'react';
import { db } from '../../services/db';
import { Kid } from '../../types';

interface AddKidModalProps {
    onClose: () => void;
    onAdd: (kid: Kid) => void;
    userId: string;
}

export const AddKidModal: React.FC<AddKidModalProps> = ({ onClose, onAdd, userId }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [avatar, setAvatar] = useState('🦁');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const avatars = ['🦁', '🐯', '🐼', '🦊', '🐨', '🐸', '🦄', '🐙'];

    const handleCreateClick = () => {
        setError('');

        if (!name.trim()) {
            setError('Please enter a name');
            return;
        }

        const ageNum = parseInt(age);
        if (!ageNum || ageNum < 5 || ageNum > 10) {
            setError('Age must be between 5 and 10');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const kid = db.createKid(userId, name.trim(), ageNum, avatar);
            onAdd(kid);
            setLoading(false);
        }, 300);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Kid Profile</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter child's name"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            min="5"
                            max="10"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="5-10"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Choose Avatar</label>
                        <div className="grid grid-cols-4 gap-3">
                            {avatars.map(av => (
                                <button
                                    key={av}
                                    type="button"
                                    onClick={() => setAvatar(av)}
                                    className={`text-4xl p-4 rounded-xl border-2 hover:scale-110 transition-transform ${avatar === av ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                                        }`}
                                >
                                    {av}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCreateClick}
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

```

### src/components/game/TrackSelection.tsx

```typescript
import React from 'react';
import { ArrowRight, Zap, Trophy, ChevronRight } from 'lucide-react';
import { Kid, MathTrack } from '../../types';
import { MATH_TRACKS } from '../../data/tracks';
import { db } from '../../services/db';

interface TrackSelectionProps {
    kid: Kid;
    onSelectTrack: (track: MathTrack) => void;
    onBack: () => void;
}

export const TrackSelection: React.FC<TrackSelectionProps> = ({ kid, onSelectTrack, onBack }) => {
    const mode = kid.age <= 7 ? 'A' : 'B';

    const getTracksForAge = (age: number) => {
        return Object.values(MATH_TRACKS).filter(track =>
            age >= track.ageRange[0] && age <= track.ageRange[1]
        );
    };

    const availableTracks = getTracksForAge(kid.age);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={onBack}
                        className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition-all"
                        aria-label="Back"
                    >
                        <ArrowRight className="w-6 h-6 text-white transform rotate-180" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 flex items-center gap-2">
                            <span className="text-white font-bold">Age {kid.age}</span>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-300" />
                            <span className="text-white font-bold">{kid.streak} Day Streak</span>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-12">
                    <div className="text-6xl mb-4">{kid.avatar}</div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {mode === 'A' ? `Hi ${kid.name}!` : `Welcome back, ${kid.name}!`}
                    </h1>
                    <p className="text-white text-opacity-90 text-xl">
                        {mode === 'A' ? 'What do you want to learn?' : 'Choose your math adventure!'}
                    </p>
                    <p className="text-white text-opacity-75 text-sm mt-2">
                        {availableTracks.length} track{availableTracks.length !== 1 ? 's' : ''} for age {kid.age}
                    </p>
                </div>

                {availableTracks.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-white bg-opacity-20 rounded-3xl p-8 max-w-md mx-auto">
                            <p className="text-white text-xl mb-4">
                                No tracks available for age {kid.age}
                            </p>
                            <p className="text-white text-opacity-75">
                                Please update the age in the kid's profile.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {availableTracks.map(track => {
                            const sessionsCompleted = db.getCompletedProgress(kid.id).filter(p =>
                                p.track_id === track.id
                            ).length;

                            return (
                                <button
                                    key={track.id}
                                    onClick={() => onSelectTrack(track)}
                                    className="bg-white rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform text-left relative overflow-hidden"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className={`text-6xl w-20 h-20 bg-gradient-to-br ${track.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                                            {track.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{track.title}</h2>
                                            <p className="text-gray-600 mb-3">{track.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                                <span>Age {track.ageRange[0]}-{track.ageRange[1]}</span>
                                            </div>
                                            {sessionsCompleted > 0 && (
                                                <div className="flex items-center gap-2 mt-3">
                                                    <Trophy className="w-4 h-4 text-purple-500" />
                                                    <span className="text-sm font-semibold text-purple-600">
                                                        {sessionsCompleted} session{sessionsCompleted !== 1 ? 's' : ''} completed
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <ChevronRight className="w-8 h-8 text-gray-400 flex-shrink-0" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

```

### src/components/game/LevelConfigScreen.tsx

```typescript
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

```

### src/components/game/GameScreen.tsx

```typescript
import React, { useState, useEffect } from 'react';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { Kid, MathTrack } from '../../types';
import { generateQuestion } from '../../utils/questionGenerator';
import { db } from '../../services/db';
import { ExplanationScreen } from './ExplanationScreen';

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
    const [question, setQuestion] = useState<any>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
    const [gameState, setGameState] = useState<'loading' | 'playing' | 'correct' | 'incorrect'>('loading');
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [gameStartTime] = useState(Date.now());
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    const mode = kid.age <= 7 ? 'A' : 'B';

    useEffect(() => {
        startNewQuestion();
    }, []);

    const startNewQuestion = () => {
        const newQuestion = generateQuestion(track.id, currentLevel, kid.difficulty_index, kid.age);
        setQuestion(newQuestion);
        setGameState('playing');
        setSelectedAnswer(null);
        setAttempts(0);
        db.logLevelStart(kid.id, track.id, currentLevel);
        setStartTime(Date.now());
    };

    const handleAnswer = (answer: any) => {
        setSelectedAnswer(answer);
        setAttempts(attempts + 1);

        if (answer === question.correctAnswer) {
            setScore(score + 100);
            setGameState('correct');
            setTotalCorrect(prev => prev + 1);

            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            db.logLevelComplete(kid.id, track.id, currentLevel, 100, timeSpent);

            // Update coins
            db.addCoins(kid.id, 10);

            setTimeout(() => {
                if (currentLevel < questionCount) {
                    setCurrentLevel(currentLevel + 1);
                    startNewQuestion();
                } else {
                    // Game Over
                    const totalTimeSpent = Math.floor((Date.now() - gameStartTime) / 1000);
                    onResults({
                        correct: totalCorrect + 1, // +1 because state update is async/batched so we add current
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
            setCurrentLevel(currentLevel + 1);
            startNewQuestion();
        } else {
            const totalTimeSpent = Math.floor((Date.now() - gameStartTime) / 1000);
            onResults({
                correct: totalCorrect,
                total: questionCount,
                timeSpent: totalTimeSpent
            });
            onComplete();
        }
    };

    if (!question) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <div className="text-white text-2xl font-bold">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex flex-col p-4">
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

                <button
                    onClick={() => setShowHelp(true)}
                    className="bg-yellow-400 rounded-full shadow-lg flex items-center justify-center hover:bg-yellow-500 transition-colors px-4 py-2 gap-2"
                    aria-label="Help"
                >
                    <Lightbulb className="w-6 h-6 text-white" />
                    <span className="text-white font-bold">Help</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        {question.question}
                    </h2>

                    <QuestionVisual question={question} />

                    {/* Answer Options */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {question.options.map((option: any, i: number) => (
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
                                {option}
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
        </div>
    );
};

const QuestionVisual = ({ question }: { question: any }) => {
    if (question.concept === 'counting') {
        return (
            <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-2xl mx-auto">
                {question.visual.slice(0, 20).map((obj: string, i: number) => (
                    <div key={i} className="text-5xl">
                        {obj}
                    </div>
                ))}
                {question.visual.length > 20 && (
                    <div className="text-3xl text-gray-600 self-center font-bold">
                        +{question.visual.length - 20} more
                    </div>
                )}
            </div>
        );
    }

    if (question.concept === 'addition' && question.visual.groupA) {
        return (
            <div className="flex justify-center items-center gap-6 mb-8">
                <div className="text-center">
                    <div className="flex gap-2 flex-wrap justify-center max-w-xs">
                        {question.visual.groupA.slice(0, 10).map((obj: string, i: number) => (
                            <div key={i} className="text-4xl">{obj}</div>
                        ))}
                        {question.visual.groupA.length > 10 && (
                            <div className="text-2xl text-gray-600 self-center">+{question.visual.groupA.length - 10}</div>
                        )}
                    </div>
                </div>
                <div className="text-3xl font-bold text-gray-600">+</div>
                <div className="text-center">
                    <div className="flex gap-2 flex-wrap justify-center max-w-xs">
                        {question.visual.groupB.slice(0, 10).map((obj: string, i: number) => (
                            <div key={i} className="text-4xl">{obj}</div>
                        ))}
                        {question.visual.groupB.length > 10 && (
                            <div className="text-2xl text-gray-600 self-center">+{question.visual.groupB.length - 10}</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (question.concept === 'subtraction' && question.visual.start) {
        return (
            <div className="text-center mb-8">
                <div className="flex flex-wrap justify-center gap-2 mb-4 max-w-xl mx-auto">
                    {question.visual.start.slice(0, 15).map((obj: string, i: number) => (
                        <div key={i} className="text-4xl">{obj}</div>
                    ))}
                    {question.visual.start.length > 15 && (
                        <div className="text-2xl text-gray-600 self-center">+{question.visual.start.length - 15}</div>
                    )}
                </div>
                <p className="text-gray-600 mb-2 text-xl font-semibold">Take away {question.visual.takeAway}</p>
            </div>
        );
    }

    if (question.concept === 'multiplication' && question.visual.groups) {
        return (
            <div className="mb-8">
                <div className="space-y-3">
                    {Array(question.visual.groups).fill(null).map((_, groupIndex) => (
                        <div key={groupIndex} className="flex justify-center gap-2">
                            {Array(question.visual.perGroup).fill('🔷').map((obj, i) => (
                                <div key={i} className="text-3xl">{obj}</div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (question.concept === 'number_bonds' && question.visual.total) {
        return (
            <div className="flex flex-col items-center mb-12 relative">
                {/* Total Circle (Top) */}
                <div className="w-32 h-32 rounded-full border-4 border-purple-500 flex items-center justify-center bg-purple-50 relative z-10 mb-16">
                    <div className="flex flex-wrap justify-center gap-1 p-2">
                        {question.visual.total.map((obj: string, i: number) => (
                            <span key={i} className="text-xl">{obj}</span>
                        ))}
                    </div>
                    {/* Connection Lines */}
                    <div className="absolute -bottom-16 left-1/2 w-1 h-16 bg-purple-300 transform -translate-x-1/2 -rotate-45 origin-top"></div>
                    <div className="absolute -bottom-16 left-1/2 w-1 h-16 bg-purple-300 transform -translate-x-1/2 rotate-45 origin-top"></div>
                </div>

                {/* Parts Circles (Bottom) */}
                <div className="flex gap-16">
                    <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center bg-blue-50 relative z-10">
                        <div className="flex flex-wrap justify-center gap-1 p-2">
                            {question.visual.part1.map((obj: string, i: number) => (
                                <span key={i} className="text-lg">{obj}</span>
                            ))}
                        </div>
                    </div>

                    <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center bg-blue-50 relative z-10">
                        {typeof question.visual.part2 === 'number' ? (
                            <span className="text-4xl text-blue-300 font-bold">?</span>
                        ) : (
                            <div className="flex flex-wrap justify-center gap-1 p-2">
                                {/* If it was an array it would render here */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (question.concept === 'data') {
        const data = question.visual as Record<string, number>;
        const maxVal = Math.max(...Object.values(data));
        // Ensure scale is at least 5 or slightly larger than max for nice visual headroom
        const scaleMax = maxVal < 5 ? 5 : Math.ceil(maxVal / 2) * 2;

        return (
            <div className="flex items-start justify-center mb-8 w-full max-w-lg mx-auto gap-3">
                {/* Y-Axis */}
                <div className="flex flex-col-reverse justify-between h-64 py-0 text-gray-400 text-sm font-bold text-right w-6">
                    {Array.from({ length: scaleMax + 1 }).map((_, i) => (
                        <span key={i} className="leading-none transform translate-y-1/2">{i}</span>
                    ))}
                </div>

                {/* Chart Area */}
                <div className="flex-1 flex flex-col">
                    {/* Grid & Bars Container */}
                    <div className="relative h-64 border-l-2 border-b-2 border-gray-300 w-full bg-white bg-opacity-50 rounded-tr-lg">
                        {/* Grid Lines */}
                        <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col-reverse justify-between pointer-events-none z-0">
                            {Array.from({ length: scaleMax + 1 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-full border-t border-gray-100 ${i === 0 ? 'border-transparent' : 'border-dashed'}`}
                                    style={{ height: '0px' }}
                                />
                            ))}
                        </div>

                        {/* Bars */}
                        <div className="absolute inset-0 flex items-end justify-around px-2 z-10">
                            {Object.entries(data).map(([label, value]) => (
                                <div key={label} className="flex flex-col items-center w-full px-1 sm:px-3 h-full justify-end group">
                                    <div
                                        className="w-full bg-blue-500 rounded-t-sm sm:rounded-t-md transition-all relative group-hover:bg-blue-600 shadow-sm"
                                        style={{ height: `${(value / scaleMax) * 100}%` }}
                                    >
                                        <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 font-bold text-blue-600 bg-white px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            {value}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* X-Axis Labels */}
                    <div className="flex justify-around px-2 mt-2">
                        {Object.keys(data).map((label) => (
                            <div key={label} className="flex-1 text-center text-xs sm:text-sm font-bold text-gray-600 capitalize truncate px-1">
                                {label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (question.concept === 'time' && question.visual.hour !== undefined) {
        const { hour, minute } = question.visual;
        const minuteRotation = minute * 6; // 360 / 60 = 6 degrees per minute
        const hourRotation = (hour % 12) * 30 + (minute / 2); // 360 / 12 = 30 deg per hour + 0.5 deg per minute

        return (
            <div className="flex flex-col items-center mb-8">
                <div className="relative w-48 h-48 rounded-full border-8 border-gray-800 bg-white shadow-xl flex items-center justify-center">
                    {/* Clock Face Markers */}
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-3 bg-gray-400"
                            style={{
                                top: '10px',
                                left: '50%',
                                transformOrigin: '0 86px', // 96px radius - 10px offset
                                transform: `translateX(-50%) rotate(${(i + 1) * 30}deg)`
                            }}
                        />
                    ))}
                    {/* Numbers (simplified quadrant) */}
                    <span className="absolute top-2 text-xl font-bold text-gray-600">12</span>
                    <span className="absolute bottom-2 text-xl font-bold text-gray-600">6</span>
                    <span className="absolute right-4 text-xl font-bold text-gray-600">3</span>
                    <span className="absolute left-4 text-xl font-bold text-gray-600">9</span>

                    {/* Hour Hand */}
                    <div
                        className="absolute w-1.5 h-12 bg-black rounded-full origin-bottom"
                        style={{
                            bottom: '50%',
                            left: 'calc(50% - 0.75px)',
                            transform: `rotate(${hourRotation}deg)`
                        }}
                    />

                    {/* Minute Hand */}
                    <div
                        className="absolute w-1 h-16 bg-blue-500 rounded-full origin-bottom"
                        style={{
                            bottom: '50%',
                            left: 'calc(50% - 0.5px)',
                            transform: `rotate(${minuteRotation}deg)`
                        }}
                    />

                    {/* Center Dot */}
                    <div className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white z-10" />
                </div>
            </div>
        );
    }



    if (question.concept === 'place_value' && question.visual.tens !== undefined) {
        return (
            <div className="flex flex-col items-center mb-8">
                <div className="flex items-end gap-8 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    {/* Tens Group */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-2">
                            {Array.from({ length: question.visual.tens }).map((_, i) => (
                                <div key={`ten-${i}`} className="w-4 h-32 bg-indigo-500 rounded-sm border border-indigo-600 flex flex-col justify-between py-1">
                                    {/* Visual lines to look like a rod of 10 */}
                                    {Array.from({ length: 9 }).map((_, j) => (
                                        <div key={j} className="h-px w-full bg-indigo-400/50" />
                                    ))}
                                </div>
                            ))}
                        </div>
                        <span className="font-bold text-gray-500 text-sm uppercase tracking-wider">Tens ({question.visual.tens})</span>
                    </div>

                    {/* Ones Group */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="grid grid-cols-5 gap-1 content-end" style={{ height: '8rem' /* Match rod height broadly */ }}>
                            {Array.from({ length: question.visual.ones }).map((_, i) => (
                                <div key={`one-${i}`} className="w-4 h-4 bg-yellow-400 rounded-sm border border-yellow-500" />
                            ))}
                        </div>
                        <span className="font-bold text-gray-500 text-sm uppercase tracking-wider">Ones ({question.visual.ones})</span>
                    </div>
                </div>
                <div className="mt-4 text-xl font-bold text-gray-700">
                    {question.visual.tens} Tens + {question.visual.ones} Ones = ?
                </div>
            </div>
        );
    }

    if (question.concept === 'algebra' || question.concept === 'patterns' || question.concept === 'skip_counting') {
        const sequence = Array.isArray(question.visual) ? question.visual : [];
        return (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {sequence.map((item: string | number, i: number) => {
                    const isMissing = item === '?' || item === '__';
                    return (
                        <div
                            key={i}
                            className={`
                                w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-sm border-b-4 transition-all
                                ${isMissing
                                    ? 'bg-gray-100 border-gray-200 text-gray-400 animate-pulse'
                                    : 'bg-white border-blue-200 text-blue-600'
                                }
                            `}
                        >
                            {isMissing ? '?' : item}
                        </div>
                    )
                })}
            </div>
        );
    }

    if (question.concept === 'shapes') {
        if (typeof question.visual === 'string') {
            const shape = question.visual.toLowerCase();
            return (
                <div className="flex justify-center mb-8">
                    <div className={`
                        w-48 h-48 transition-all duration-500
                        ${shape.includes('circle') ? 'rounded-full bg-red-400' : ''}
                        ${shape.includes('square') ? 'bg-blue-400 rounded-lg' : ''}
                        ${shape.includes('rectangle') ? 'w-64 bg-green-400 rounded-lg' : ''}
                        ${shape.includes('triangle') ? 'w-0 h-0 border-l-[100px] border-l-transparent border-r-[100px] border-r-transparent border-b-[174px] border-b-yellow-400' : ''}
                        ${/* Fallback */ !['circle', 'square', 'rectangle', 'triangle'].some(s => shape.includes(s)) ? 'bg-purple-200 rounded-xl flex items-center justify-center' : ''}
                     `}>
                        {!['circle', 'square', 'rectangle', 'triangle'].some(s => shape.includes(s)) && (
                            <span className="text-2xl font-bold text-purple-700 capitalize">{shape}</span>
                        )}
                    </div>
                </div>
            )
        }
    }

    if (question.concept === 'money') {
        const coins = Array.isArray(question.visual) ? question.visual : [];

        const getCoinStyle = (coin: string) => {
            const c = coin.toLowerCase();
            if (c.includes('quarter')) return { bg: 'bg-gray-300', size: 'w-24 h-24', text: '25¢', border: 'border-gray-400' };
            if (c.includes('dime')) return { bg: 'bg-gray-300', size: 'w-16 h-16', text: '10¢', border: 'border-gray-400' };
            if (c.includes('nickel')) return { bg: 'bg-gray-300', size: 'w-20 h-20', text: '5¢', border: 'border-gray-400' };
            if (c.includes('penny')) return { bg: 'bg-orange-400', size: 'w-16 h-16', text: '1¢', border: 'border-orange-600' };
            return { bg: 'bg-yellow-100', size: 'w-20 h-20', text: '$', border: 'border-yellow-300' };
        };

        return (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {coins.map((coin: string, i: number) => {
                    const style = getCoinStyle(coin);
                    return (
                        <div
                            key={i}
                            className={`${style.size} ${style.bg} rounded-full border-4 ${style.border} flex items-center justify-center shadow-lg transform hover:-translate-y-1 transition-transform`}
                        >
                            <span className="font-bold text-gray-700 opacity-70">{style.text}</span>
                        </div>
                    );
                })}
            </div>
        );
    }

    if (question.concept === 'comparison') {
        if (question.visual?.left && question.visual?.right) {
            return (
                <div className="flex items-center justify-center gap-8 mb-8">
                    <div className="p-6 bg-white rounded-xl border-2 border-gray-100 shadow-sm text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{Array.isArray(question.visual.left) ? question.visual.left.length : question.visual.left}</div>
                        <div className="text-sm text-gray-400">Group A</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-400">vs</div>
                    <div className="p-6 bg-white rounded-xl border-2 border-gray-100 shadow-sm text-center">
                        <div className="text-4xl font-bold text-purple-600 mb-2">{Array.isArray(question.visual.right) ? question.visual.right.length : question.visual.right}</div>
                        <div className="text-sm text-gray-400">Group B</div>
                    </div>
                </div>
            )
        }
    }

    if (Array.isArray(question.visual)) {
        return <div className="text-center text-4xl mb-6">{question.visual.join(' ')}</div>;
    }

    if (typeof question.visual === 'object' && question.visual !== null) {
        return <div className="text-center text-xl mb-6"><pre>{JSON.stringify(question.visual, null, 2)}</pre></div>
    }

    return <div className="text-center text-6xl mb-6">{question.visual}</div>;
};

```

### src/components/game/ExplanationScreen.tsx

```typescript
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
                        {question.explanation.steps.map((step, i) => (
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

```

### src/components/game/ResultsScreen.tsx

```typescript
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

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ kid, track, results, onContinue, onBack }) => {
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

```

### src/components/reports/LearningSummaryScreen.tsx

```typescript
import React, { useMemo } from 'react';
import { ArrowLeft, Clock, Target, Trophy, Brain } from 'lucide-react';
import { Kid } from '../../types';
import { getKidStats } from '../../utils/stats';
import { MATH_TRACKS } from '../../data/tracks';

interface LearningSummaryProps {
    kid: Kid;
    onBack: () => void;
}

export const LearningSummaryScreen: React.FC<LearningSummaryProps> = ({ kid, onBack }) => {
    const stats = useMemo(() => getKidStats(kid.id), [kid.id]);

    return (
        <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
            <div className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 max-w-4xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Learning Progress: {kid.name}</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            <h3 className="text-gray-500 text-sm font-medium">Levels</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{stats.levelsCompleted}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            <h3 className="text-gray-500 text-sm font-medium">Time</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                            {Math.round(stats.totalPlayTime / 60)}m
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <Target className="w-5 h-5 text-green-500" />
                            <h3 className="text-gray-500 text-sm font-medium">Accuracy</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{stats.overallAccuracy}%</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <Brain className="w-5 h-5 text-purple-500" />
                            <h3 className="text-gray-500 text-sm font-medium">Concepts</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                            {Object.keys(stats.trackStats).length}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800">Concept Mastery</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {Object.entries(stats.trackStats).map(([trackId, trackStat]) => {
                            const track = MATH_TRACKS[trackId];
                            if (!track) return null;

                            const accuracy = trackStat.total > 0
                                ? Math.round((trackStat.correct / trackStat.total) * 100)
                                : 0;

                            return (
                                <div key={trackId} className="p-6">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-br ${track.color} text-white`}>
                                            {track.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="font-semibold text-gray-800">{track.title}</h3>
                                                <span className={`text-sm font-bold ${accuracy >= 80 ? 'text-green-600' :
                                                        accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                    {accuracy}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${accuracy >= 80 ? 'bg-green-500' :
                                                            accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${accuracy}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500 pl-14">
                                        <span>{trackStat.total} levels attempted</span>
                                        <span>{Math.round(trackStat.timeSpent / 60)} mins practiced</span>
                                    </div>
                                </div>
                            );
                        })}

                        {Object.keys(stats.trackStats).length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No learning data available yet. Start playing to see stats!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

```

### src/components/reports/WorksheetScreen.tsx

```typescript
import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Check, AlertCircle } from 'lucide-react';
import { Kid, Worksheet } from '../../types';
import { db } from '../../services/db';
import { generateWorksheet } from '../../utils/worksheetGenerator';

interface WorksheetScreenProps {
    kid: Kid;
    onBack: () => void;
}

export const WorksheetScreen: React.FC<WorksheetScreenProps> = ({ kid, onBack }) => {
    const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadWorksheets();
    }, [kid.id]);

    const loadWorksheets = () => {
        const list = db.getWorksheets(kid.id);
        setWorksheets(list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    };

    const handleGenerate = async () => {
        setGenerating(true);
        setError('');

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const count = db.getErrors(kid.id, 7).length;
        if (count < 3) {
            setError('Not enough recent practice data to generate a focused worksheet. Encourage your child to play more levels!');
            setGenerating(false);
            return;
        }

        const ws = await generateWorksheet(kid.id);
        if (ws) {
            loadWorksheets();
        } else {
            setError('Could not generate worksheet. Try again later.');
        }
        setGenerating(false);
    };

    return (
        <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
            <div className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 max-w-4xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Practice Worksheets: {kid.name}</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-white mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Personalized Practice</h2>
                            <p className="text-purple-100 mb-6 max-w-lg">
                                Generate custom PDF worksheets based on the mistakes {kid.name} has made recently.
                                Focus on weak spots to improve mastery.
                            </p>
                            <button
                                onClick={handleGenerate}
                                disabled={generating}
                                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-75"
                            >
                                {generating ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <FileText className="w-5 h-5" />
                                        Generate New Worksheet
                                    </>
                                )}
                            </button>
                        </div>
                        <FileText className="w-32 h-32 text-white opacity-20" />
                    </div>

                    {error && (
                        <div className="mt-6 bg-white bg-opacity-10 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Past Worksheets</h3>

                    {worksheets.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100">
                            No worksheets generated yet.
                        </div>
                    ) : (
                        worksheets.map(ws => (
                            <div key={ws.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-bold text-gray-800">Practice Set {new Date(ws.created_at).toLocaleDateString()}</h4>
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Ready</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">
                                        Focus: {ws.focus_areas.map(([area, count]) => `${area.replace('_error', '')} (${count})`).join(', ')}
                                    </p>
                                    <div className="text-xs text-gray-400">
                                        ID: {ws.id}
                                    </div>
                                </div>

                                <button
                                    className="p-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                    aria-label="Download PDF"
                                    onClick={() => alert('In a real app, this would download the PDF!')}
                                >
                                    <Download className="w-6 h-6" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

```


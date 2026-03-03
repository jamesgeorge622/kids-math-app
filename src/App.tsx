
import { useState, useEffect } from 'react';
import { User, Kid, MathTrack } from './types';
import { db } from './services/db';
import { LoginScreen } from './components/auth/LoginScreen';
import { Dashboard } from './components/dashboard/Dashboard';
import { KidDashboard } from './components/dashboard/KidDashboard';
import { PetSelectionScreen } from './components/dashboard/PetSelectionScreen';
import { LevelConfigScreen } from './components/game/LevelConfigScreen';
import { GameScreen } from './components/game/GameScreen';
import { ResultsScreen } from './components/game/ResultsScreen';
import { LearningSummaryScreen } from './components/reports/LearningSummaryScreen';
import { WorksheetScreen } from './components/reports/WorksheetScreen';
import { ParentGate } from './components/dashboard/ParentGate';
import { FileText, PieChart } from 'lucide-react';

const App = () => {
    const [screen, setScreen] = useState<'login'
        | 'dashboard'
        | 'petSelection'
        | 'kidDashboard'
        | 'levelConfig'
        | 'game'
        | 'results' | 'summary' | 'worksheets' | 'gate'>('login');
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
        if (!kid.pet) {
            setScreen('petSelection');
        } else {
            setScreen('kidDashboard');
        }
    };

    const handlePetSelected = (updatedKid: Kid) => {
        setSelectedKid(updatedKid);
        setScreen('kidDashboard');
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

            {screen === 'petSelection' && selectedKid && (
                <PetSelectionScreen
                    kid={selectedKid}
                    onComplete={handlePetSelected}
                />
            )}

            {screen === 'kidDashboard' && selectedKid && (
                <KidDashboard
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
                    onBack={() => setScreen('kidDashboard')}
                />
            )}

            {screen === 'game' && selectedKid && selectedTrack && (
                <GameScreen
                    kid={selectedKid}
                    track={selectedTrack}
                    questionCount={questionCount}
                    onComplete={handleGameComplete}
                    onResults={handleGameResults}
                    onBack={() => setScreen('kidDashboard')}
                />
            )}

            {screen === 'results' && selectedKid && selectedTrack && gameResults && (
                <ResultsScreen
                    kid={selectedKid}
                    track={selectedTrack}
                    results={gameResults}
                    onContinue={() => setScreen('kidDashboard')}
                    onBack={() => setScreen('dashboard')}
                />
            )}

            {screen === 'gate' && (
                <ParentGate
                    onPass={handleGatePass}
                    onCancel={() => {
                        setTargetScreenAfterGate('');
                        setScreen('kidDashboard');
                    }}
                />
            )}

            {screen === 'summary' && selectedKid && (
                <LearningSummaryScreen
                    kid={selectedKid}
                    onBack={() => setScreen('kidDashboard')}
                />
            )}

            {screen === 'worksheets' && selectedKid && (
                <WorksheetScreen
                    kid={selectedKid}
                    onBack={() => setScreen('kidDashboard')}
                />
            )}

            {/* Floating Action Buttons for Parents (visible on kid dashboard and game screens) */}
            {(screen === 'kidDashboard' || screen === 'levelConfig') && (
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

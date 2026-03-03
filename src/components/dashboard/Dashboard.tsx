import React, { useState, useEffect } from 'react';
import { User, LogOut, Plus, Zap, ArrowRight, Trash2, Download, MessageSquare } from 'lucide-react';
import { User as UserType, Kid } from '../../types';
import { db } from '../../services/db';
import { AddKidModal } from './AddKidModal';
import { DeleteKidModal } from './DeleteKidModal';
import { getLevelProgress, getPetStageName, getPetEmoji } from '../../utils/gamification';

interface DashboardProps {
    user: UserType;
    onLogout: () => void;
    onSelectKid: (kid: Kid) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onSelectKid }) => {
    const [kids, setKids] = useState<Kid[]>([]);
    const [showAddKid, setShowAddKid] = useState(false);
    const [kidToDelete, setKidToDelete] = useState<Kid | null>(null);

    useEffect(() => {
        const userKids = db.getKidsByUser(user.id);
        setKids(userKids);
    }, [user.id, showAddKid]); // Refresh when add modal closes

    const handleAddKid = (kid: Kid) => {
        setKids([...kids, kid]);
        setShowAddKid(false);
    };

    const handleDeleteKid = (kidId: string) => {
        db.deleteKid(kidId);
        setKids(kids.filter(k => k.id !== kidId)); // Optimistic update
        setKidToDelete(null);
    };

    const handleExportLogs = () => {
        const data = db.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `math-buddy-logs-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

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
                                const levelProgress = getLevelProgress(kid.total_xp || 0);
                                const { timeLeft } = db.canPlayToday(kid);
                                return (
                                    <div key={kid.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-5xl transition-transform hover:scale-110">
                                                    {kid.pet ? getPetEmoji(kid.pet.type, kid.pet.stage) : kid.avatar}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">{kid.name}</h3>
                                                    <p className="text-sm text-gray-500">Age {kid.age}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setKidToDelete(kid);
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete Profile"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex flex-col gap-3 mb-4">
                                            {/* Pet / XP Section */}
                                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100 relative overflow-hidden">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                                        {kid.pet ? `${getPetStageName(kid.pet.stage)} Companion` : 'No Companion'}
                                                    </span>
                                                    <span className="text-xs font-bold text-indigo-600">Lvl {levelProgress.level}</span>
                                                </div>

                                                {/* XP Bar */}
                                                <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-indigo-100 mb-1">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-1000"
                                                        style={{ width: `${levelProgress.percent}%` }}
                                                    />
                                                </div>
                                                <div className="text-right text-[10px] text-gray-400 font-mono">
                                                    {Math.floor(levelProgress.currentLevelXp)} / {levelProgress.requiredXp} XP
                                                </div>
                                            </div>

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="bg-pink-50 rounded-lg p-2 text-center">
                                                    <Zap className="w-4 h-4 text-pink-500 mx-auto mb-1" />
                                                    <p className="text-xl font-bold text-pink-600">{kid.streak}</p>
                                                    <p className="text-[10px] text-gray-600">Streak</p>
                                                </div>
                                                <div className="bg-yellow-50 rounded-lg p-2 text-center">
                                                    <span className="text-xl mx-auto mb-1 block">🪙</span>
                                                    <p className="text-xl font-bold text-yellow-600">{kid.coins || 0}</p>
                                                    <p className="text-[10px] text-gray-600">Coins</p>
                                                </div>
                                                <div className={`rounded-lg p-2 text-center ${timeLeft > 0 ? 'bg-green-50' : 'bg-gray-100'}`}>
                                                    <span className="text-xl mx-auto mb-1 block">{timeLeft > 0 ? '🔋' : '💤'}</span>
                                                    <p className={`text-xl font-bold ${timeLeft > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {Math.ceil(timeLeft / 60)}m
                                                    </p>
                                                    <p className="text-[10px] text-gray-600">Energy</p>
                                                </div>
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

                {kidToDelete && (
                    <DeleteKidModal
                        kid={kidToDelete}
                        onClose={() => setKidToDelete(null)}
                        onDelete={handleDeleteKid}
                    />
                )}

                {/* Parent Zone / Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Parent Zone</h3>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={handleExportLogs}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                            <Download className="w-4 h-4" />
                            Export Diagnostic Logs
                        </button>
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSckM-3oI7F-GA33-b3I5diU_58MnsyDO4qZNKOk05EHrSyR_A/viewform?usp=header"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Share Feedback
                        </a>
                    </div>
                    <p className="mt-4 text-xs text-gray-400">
                        Version 1.0 (Beta) • All data stored locally on this device.
                    </p>
                </div>
            </div>
        </div>
    );
};

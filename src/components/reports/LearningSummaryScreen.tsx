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

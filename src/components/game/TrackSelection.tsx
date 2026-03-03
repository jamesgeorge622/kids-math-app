import React from 'react';
import { ArrowRight, Zap, Trophy, ChevronRight } from 'lucide-react';
import { Kid, MathTrack } from '../../types';
import { MATH_TRACKS } from '../../data/tracks';
import { db } from '../../services/db';
import { getPetEmoji } from '../../utils/gamification';

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
                    <div className="text-6xl mb-4">
                        {kid.pet ? getPetEmoji(kid.pet.type, kid.pet.stage) : kid.avatar}
                    </div>
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

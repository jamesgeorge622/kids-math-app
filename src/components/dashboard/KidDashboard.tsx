
import React, { useState } from 'react';
import { Kid, MathTrack } from '../../types';
import { TrackSelection } from '../game/TrackSelection';
import { PetInteractionView } from '../game/PetInteractionView';
import { ArrowLeft, Gamepad2, Heart } from 'lucide-react';

interface KidDashboardProps {
    kid: Kid;
    onSelectTrack: (track: MathTrack) => void;
    onBack: () => void; // Logout to parent dashboard
}

export const KidDashboard: React.FC<KidDashboardProps> = ({ kid, onSelectTrack, onBack }) => {
    const [activeTab, setActiveTab] = useState<'adventure' | 'companion'>('adventure');
    const [, setTick] = useState(0); // Force re-render

    const handleUpdate = () => {
        setTick(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                        <span className="font-bold">Exit</span>
                    </button>

                    <div className="flex bg-black/20 rounded-full p-1">
                        <button
                            onClick={() => setActiveTab('adventure')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'adventure'
                                ? 'bg-white text-purple-600 shadow-lg'
                                : 'text-white/80 hover:text-white'
                                }`}
                        >
                            <Gamepad2 className="w-5 h-5" />
                            Adventure
                        </button>
                        <button
                            onClick={() => setActiveTab('companion')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'companion'
                                ? 'bg-white text-pink-600 shadow-lg'
                                : 'text-white/80 hover:text-white'
                                }`}
                        >
                            <Heart className="w-5 h-5" />
                            My Companion
                        </button>
                    </div>

                    <div className="w-20" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 container mx-auto p-4 overflow-y-auto">
                {activeTab === 'adventure' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Play Button Highlight - Integrated into Track Selection or above it? 
                            The TrackSelection is basically the "Big Menu". 
                            Let's wrap TrackSelection or just let it be the main view.
                            The user asked for a "Big Button to play math games". 
                            TrackSelection HAS big buttons for each track.
                            But maybe a specific "Quick Play" or "Continue Journey"?
                            For now, TrackSelection IS the game menu.
                        */}
                        <TrackSelection
                            kid={kid}
                            onSelectTrack={onSelectTrack}
                            onBack={() => { }} // Back button hidden inside, controlled by wrapper
                        />
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden min-h-[80vh] animate-in fade-in zoom-in duration-300">
                        <PetInteractionView
                            kid={kid}
                            onUpdate={handleUpdate}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

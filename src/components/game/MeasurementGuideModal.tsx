
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface MeasurementGuideModalProps {
    onClose: () => void;
}

export const MeasurementGuideModal: React.FC<MeasurementGuideModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'length' | 'weight'>('length');

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-indigo-600 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span>📏</span> Measurement Guide
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex bg-indigo-50 border-b border-indigo-100">
                    <button
                        onClick={() => setActiveTab('length')}
                        className={`flex-1 py-4 font-bold text-lg transition-colors ${activeTab === 'length'
                                ? 'bg-white text-indigo-600 border-t-4 border-t-indigo-500'
                                : 'text-gray-500 hover:bg-white/50'
                            }`}
                    >
                        Length 📏
                    </button>
                    <button
                        onClick={() => setActiveTab('weight')}
                        className={`flex-1 py-4 font-bold text-lg transition-colors ${activeTab === 'weight'
                                ? 'bg-white text-indigo-600 border-t-4 border-t-indigo-500'
                                : 'text-gray-500 hover:bg-white/50'
                            }`}
                    >
                        Weight ⚖️
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto">
                    {activeTab === 'length' && (
                        <div className="space-y-8">
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                <h3 className="text-xl font-bold text-blue-800 mb-4">Inches (in)</h3>
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">🖇️</div>
                                    <div>
                                        <p className="text-gray-700 font-medium">Small things like paperclips or pencils are measured in <span className="font-bold text-blue-600">Inches</span>.</p>
                                        <div className="mt-2 bg-white px-3 py-1 rounded-lg border border-blue-200 inline-block text-sm">
                                            Tip: Your thumb is about 1 inch wide! 👍
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                                <h3 className="text-xl font-bold text-green-800 mb-4">Feet (ft)</h3>
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">👟</div>
                                    <div>
                                        <p className="text-gray-700 font-medium">Medium things like height or tables are measured in <span className="font-bold text-green-600">Feet</span>.</p>
                                        <div className="mt-3 flex items-center gap-2 font-bold text-lg bg-white p-3 rounded-xl border border-green-200 shadow-sm justify-center">
                                            <span>1 Foot</span>
                                            <span>=</span>
                                            <span>12 Inches</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                                <h3 className="text-xl font-bold text-purple-800 mb-4">Yards (yd)</h3>
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">🥅</div>
                                    <div>
                                        <p className="text-gray-700 font-medium">Big things like soccer fields are measured in <span className="font-bold text-purple-600">Yards</span>.</p>
                                        <div className="mt-3 flex items-center gap-2 font-bold text-lg bg-white p-3 rounded-xl border border-purple-200 shadow-sm justify-center">
                                            <span>1 Yard</span>
                                            <span>=</span>
                                            <span>3 Feet</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'weight' && (
                        <div className="space-y-8">
                            <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                                <h3 className="text-xl font-bold text-yellow-800 mb-4">Ounces (oz)</h3>
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">🍓</div>
                                    <div>
                                        <p className="text-gray-700 font-medium">Very light things like strawberries or letters are measured in <span className="font-bold text-yellow-600">Ounces</span>.</p>
                                        <div className="mt-2 bg-white px-3 py-1 rounded-lg border border-yellow-200 inline-block text-sm">
                                            Tip: A slice of bread is about 1 ounce! 🍞
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                                <h3 className="text-xl font-bold text-orange-800 mb-4">Pounds (lb)</h3>
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">🐶</div>
                                    <div>
                                        <p className="text-gray-700 font-medium">Heavier things like dogs or people are measured in <span className="font-bold text-orange-600">Pounds</span>.</p>
                                        <div className="mt-3 flex items-center gap-2 font-bold text-lg bg-white p-3 rounded-xl border border-orange-200 shadow-sm justify-center">
                                            <span>1 Pound</span>
                                            <span>=</span>
                                            <span>16 Ounces</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Tons</h3>
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">🐘</div>
                                    <div>
                                        <p className="text-gray-700 font-medium">Super heavy things like elephants or cars are measured in <span className="font-bold text-gray-600">Tons</span>.</p>
                                        <div className="mt-3 flex items-center gap-2 font-bold text-lg bg-white p-3 rounded-xl border border-gray-200 shadow-sm justify-center">
                                            <span>1 Ton</span>
                                            <span>=</span>
                                            <span>2,000 Pounds</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <button
                        onClick={onClose}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

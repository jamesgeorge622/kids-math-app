import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Printer, AlertCircle, RefreshCw } from 'lucide-react';
import { Kid } from '../../types';
import { WorksheetPreview } from '../../domain/worksheets';
import { db } from '../../services/db';
import { generateWorksheetPreview } from '../../services/worksheetGenerator';
import { QuestionVisual } from '../game/QuestionVisual';

interface WorksheetScreenProps {
    kid: Kid;
    onBack: () => void;
}

export const WorksheetScreen: React.FC<WorksheetScreenProps> = ({ kid, onBack }) => {
    const [preview, setPreview] = useState<WorksheetPreview | undefined>(undefined);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadLatestPreview();
    }, [kid.id]);

    const loadLatestPreview = () => {
        const latest = db.getLatestWorksheetPreview(kid.id);
        if (latest) {
            setPreview(latest);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        setError('');

        try {
            // Simulate brief delay for UX
            await new Promise(resolve => setTimeout(resolve, 800));

            const newPreview = generateWorksheetPreview({ kidId: kid.id });
            db.saveWorksheetPreview(newPreview);
            setPreview(newPreview);
        } catch (e) {
            console.error(e);
            setError('Could not generate worksheet. Try playing a few more games first!');
        } finally {
            setGenerating(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto print:bg-white print:overflow-visible">
            {/* Header - Hidden when printing */}
            <div className="bg-white shadow print:hidden">
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

            <div className="container mx-auto px-4 py-8 max-w-4xl print:max-w-none print:p-0 print:m-0">
                {/* Generator Controls - Hidden when printing */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-white mb-8 print:hidden">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Weekly Practice Sheet</h2>
                            <p className="text-purple-100 mb-6 max-w-lg">
                                Create a personalized printable worksheet based on {kid.name}'s recent activity.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleGenerate}
                                    disabled={generating}
                                    className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-75"
                                >
                                    {generating ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <FileText className="w-5 h-5" />
                                    )}
                                    {preview ? 'Regenerate Worksheet' : 'Generate Worksheet'}
                                </button>

                                {preview && (
                                    <button
                                        onClick={handlePrint}
                                        className="bg-purple-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-800 transition-all flex items-center gap-2"
                                    >
                                        <Printer className="w-5 h-5" />
                                        Print Preview
                                    </button>
                                )}
                            </div>
                        </div>
                        <FileText className="w-32 h-32 text-white opacity-20 hidden sm:block" />
                    </div>

                    {error && (
                        <div className="mt-6 bg-white bg-opacity-10 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}
                </div>

                {/* Worksheet Preview Area */}
                {preview ? (
                    <div className="bg-white shadow-lg rounded-xl p-8 print:shadow-none print:p-8 min-h-[11in] print:w-full">
                        {/* Worksheet Header */}
                        <div className="border-b-2 border-gray-200 pb-6 mb-8 flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-serif text-gray-900 mb-2">{preview.title}</h2>
                                <p className="text-gray-500 italic">{new Date(preview.createdAt).toLocaleDateString()} • {preview.objective}</p>
                            </div>
                            <div className="text-right hidden print:block">
                                <div className="border border-gray-300 w-32 h-24 rounded flex items-center justify-center text-gray-400 text-sm">
                                    Score / Stamp
                                </div>
                            </div>
                        </div>

                        {/* Note to Parents */}
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-8 print:border-gray-200 print:bg-gray-50">
                            <h3 className="font-bold text-blue-800 mb-1 print:text-gray-800">Note for Parents:</h3>
                            <p className="text-blue-700 text-sm print:text-gray-700">{preview.parentNote}</p>
                        </div>

                        {/* Items */}
                        <div className="space-y-12">
                            {preview.items.map((item, i) => (
                                <div key={item.id} className="break-inside-avoid">
                                    <div className="flex gap-4 items-start">
                                        <div className="bg-gray-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xl font-medium text-gray-800 mb-6">{item.prompt}</p>

                                            {item.visual && (
                                                <div className="mb-6 p-4 border border-gray-100 rounded-lg inline-block">
                                                    {/* We use a mocked question object to satisfy QuestionVisual props */}
                                                    <QuestionVisual
                                                        question={{
                                                            concept: 'counting', // Dummy concept, visual drives rendering
                                                            question: '',
                                                            visual: item.visual,
                                                            correctAnswer: '',
                                                            options: []
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            <div className="mt-4 pt-4 border-t border-dashed border-gray-200 w-full">
                                                <div className="text-sm text-gray-400">Answer: _______________________</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm print:fixed print:bottom-4 print:left-0 print:w-full">
                            Generated by AntiGravity Kids Math • Practice makes progress!
                        </div>
                    </div>
                ) : (
                    !generating && (
                        <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400 print:hidden">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>No worksheet generated yet.</p>
                            <p className="text-sm">Click "Generate" above to create one!</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};


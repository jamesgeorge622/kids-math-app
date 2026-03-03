
import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Kid } from '../../types';

interface DeleteKidModalProps {
    kid: Kid;
    onClose: () => void;
    onDelete: (kidId: string) => void;
}

export const DeleteKidModal: React.FC<DeleteKidModalProps> = ({ kid, onClose, onDelete }) => {
    const [confirmText, setConfirmText] = useState('');
    const EXPECTED_TEXT = 'DELETE';

    const handleDelete = () => {
        if (confirmText === EXPECTED_TEXT) {
            onDelete(kid.id);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header - Danger Zone Style */}
                <div className="bg-red-50 p-6 border-b border-red-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-red-900">Delete Profile?</h2>
                        <p className="text-sm text-red-700">This action cannot be undone.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-600 mb-6">
                        You are about to delete <span className="font-bold text-gray-900">{kid.name}'s</span> profile.
                        All progress, coins, pets, and rewards will be <span className="font-bold text-red-600">permanently erased</span>.
                    </p>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Type "{EXPECTED_TEXT}" to confirm:
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                            placeholder="DELETE"
                            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 font-mono text-center text-xl tracking-widest uppercase focus:border-red-500 focus:outline-none"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={confirmText !== EXPECTED_TEXT}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${confirmText === EXPECTED_TEXT
                                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg cursor-pointer'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Trash2 className="w-5 h-5" />
                            Delete Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            // Default avatar '👤' used as placeholder, real visual comes from Pet
            const kid = db.createKid(userId, name.trim(), ageNum, '👤');
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

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
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
                            {loading ? 'Creating...' : 'Create Profile'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

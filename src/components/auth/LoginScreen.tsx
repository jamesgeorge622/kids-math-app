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

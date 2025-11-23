import React, { useState, useEffect } from 'react';

const Signup = ({ onNavigate }) => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', terms: false });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [passwordStrength, setPasswordStrength] = useState({ strength: 0, checks: {} });

    useEffect(() => {
        createLaserLines();
    }, []);

    const createLaserLines = () => {
        const laserBg = document.querySelector('.laser-bg');
        if (!laserBg) return;
        laserBg.querySelectorAll('.laser-line, .particle').forEach(el => el.remove());

        for (let i = 0; i < 5; i++) {
            const laser = document.createElement('div');
            laser.className = 'laser-line';
            laser.style.top = `${Math.random() * 100}%`;
            laser.style.animationDelay = `${i * 2}s`;
            laserBg.appendChild(laser);
        }
        for (let i = 0; i < 3; i++) {
            const laser = document.createElement('div');
            laser.className = 'laser-line vertical';
            laser.style.left = `${Math.random() * 100}%`;
            laser.style.animationDelay = `${i * 3}s`;
            laserBg.appendChild(laser);
        }
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 15}s`;
            laserBg.appendChild(particle);
        }
    };

    const validatePassword = (password) => {
        const checks = {
            length: password.length >= 8 && password.length <= 128,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        const strength = Object.values(checks).filter(Boolean).length;
        return { checks, strength, valid: strength === 5 };
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setFormData(prev => ({ ...prev, password }));
        setPasswordStrength(validatePassword(password));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setMessage({ text: 'Please fill in all required fields', type: 'error' });
            return;
        }

        if (!passwordStrength.valid) {
            setMessage({ text: 'Password does not meet security requirements', type: 'error' });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage({ text: 'Passwords do not match', type: 'error' });
            return;
        }

        if (!formData.terms) {
            setMessage({ text: 'Please accept the Terms of Service and Privacy Policy', type: 'error' });
            return;
        }

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Save user credentials to localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const newUser = {
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        setMessage({ text: 'Account created successfully! Redirecting to login...', type: 'success' });
        setTimeout(() => onNavigate('login'), 2000);
        setLoading(false);
    };

    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

    return (
        <>
            <style>{`
                body { background: #0a0e27; overflow-x: hidden; }
                .laser-bg { position: fixed; inset: 0; background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1629 100%); overflow: hidden; z-index: 0; }
                .laser-line { position: absolute; height: 2px; background: linear-gradient(90deg, transparent, #00f0ff, transparent); box-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff; animation: laserMove 8s linear infinite; opacity: 0.6; }
                .laser-line.vertical { width: 2px; height: 100%; background: linear-gradient(180deg, transparent, #00f0ff, transparent); animation: laserMoveVertical 10s linear infinite; }
                @keyframes laserMove { 0% { left: -100%; width: 100%; } 100% { left: 100%; width: 100%; } }
                @keyframes laserMoveVertical { 0% { top: -100%; height: 100%; } 100% { top: 100%; height: 100%; } }
                .grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px); background-size: 50px 50px; opacity: 0.3; }
                .particle { position: absolute; width: 4px; height: 4px; background: #00f0ff; border-radius: 50%; box-shadow: 0 0 10px #00f0ff; animation: particleFloat 15s infinite ease-in-out; }
                @keyframes particleFloat { 0%, 100% { transform: translate(0, 0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translate(100vw, -100vh); opacity: 0; } }
                .glass-card { background: rgba(15, 25, 50, 0.6); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border: 1px solid rgba(0, 240, 255, 0.2); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 50px rgba(0, 240, 255, 0.1); }
                .btn-gradient { background: linear-gradient(90deg, #00f0ff 0%, #0080ff 100%); transition: all 0.3s ease; }
                .btn-gradient:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0, 240, 255, 0.5); }
                .btn-gradient:disabled { opacity: 0.6; cursor: not-allowed; }
            `}</style>

            <div className="laser-bg"><div className="grid-overlay"></div></div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-8">
                <div className="glass-card rounded-3xl p-10 w-full max-w-md my-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-gray-400 text-sm">Join EduPlan AI and start your journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Full Name *</label>
                            <input type="text" value={formData.fullName} onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))} placeholder="Enter your full name" className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" maxLength="50" required />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Email Address *</label>
                            <input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} placeholder="Enter your email" className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" maxLength="254" required />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Password *</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handlePasswordChange} placeholder="Create a strong password" className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition pr-12" minLength="8" maxLength="128" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{showPassword ? (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><line x1="1" y1="1" x2="23" y2="23"></line></>) : (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>)}</svg>
                                </button>
                            </div>
                            <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-400">Password Strength:</span>
                                    <span className="text-xs text-gray-400">{strengthLabels[passwordStrength.strength - 1] || ''}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-300 ${strengthColors[passwordStrength.strength - 1] || 'bg-gray-500'}`} style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1 text-xs">
                                <p className={passwordStrength.checks.length ? 'text-green-400' : 'text-gray-400'}>✓ At least 8 characters</p>
                                <p className={passwordStrength.checks.lowercase ? 'text-green-400' : 'text-gray-400'}>✓ Contains lowercase letter</p>
                                <p className={passwordStrength.checks.uppercase ? 'text-green-400' : 'text-gray-400'}>✓ Contains uppercase letter</p>
                                <p className={passwordStrength.checks.number ? 'text-green-400' : 'text-gray-400'}>✓ Contains number</p>
                                <p className={passwordStrength.checks.special ? 'text-green-400' : 'text-gray-400'}>✓ Contains special character</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Confirm Password *</label>
                            <div className="relative">
                                <input type={showConfirm ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))} placeholder="Re-enter your password" className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition pr-12" minLength="8" maxLength="128" required />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{showConfirm ? (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><line x1="1" y1="1" x2="23" y2="23"></line></>) : (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>)}</svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 pt-2">
                            <input type="checkbox" id="terms" checked={formData.terms} onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.checked }))} className="mt-1 w-4 h-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-400" required />
                            <label htmlFor="terms" className="text-xs text-gray-300">I agree to the <a href="#" className="text-cyan-400 hover:text-cyan-300">Terms of Service</a> and <a href="#" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</a></label>
                        </div>

                        {message.text && (<div className={`text-sm text-center ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{message.text}</div>)}

                        <button type="submit" disabled={loading} className="btn-gradient w-full py-3 rounded-full text-white font-semibold text-base mt-4">{loading ? 'Creating Account...' : 'Create Account'}</button>

                        <div className="text-center pt-4">
                            <p className="text-sm text-gray-400">Already have an account? <button type="button" onClick={() => onNavigate('login')} className="text-cyan-400 hover:text-cyan-300 font-semibold">Log In</button></p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Signup;

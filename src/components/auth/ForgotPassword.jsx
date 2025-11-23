import React, { useState, useEffect } from 'react';

const ForgotPassword = ({ onNavigate }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [passwordStrength, setPasswordStrength] = useState({ strength: 0, checks: {} });
    const [countdown, setCountdown] = useState(900); // 15 minutes
    const [demoCode, setDemoCode] = useState('');

    useEffect(() => {
        createLaserLines();
    }, []);

    useEffect(() => {
        if (step === 2 && countdown > 0) {
            const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [step, countdown]);

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
        setNewPassword(password);
        setPasswordStrength(validatePassword(password));
    };

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1500));
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setDemoCode(code);
        setMessage({ text: `Reset code sent! Demo Code: ${code}`, type: 'success' });
        
        setTimeout(() => {
            setStep(2);
            setCountdown(900);
        }, 1500);
        
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (!resetCode || !newPassword || !confirmPassword) {
            setMessage({ text: 'Please fill in all fields', type: 'error' });
            return;
        }

        if (!passwordStrength.valid) {
            setMessage({ text: 'Password does not meet security requirements', type: 'error' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ text: 'Passwords do not match', type: 'error' });
            return;
        }

        if (countdown <= 0) {
            setMessage({ text: 'Reset code has expired. Please request a new one.', type: 'error' });
            setTimeout(() => setStep(1), 2000);
            return;
        }

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMessage({ text: 'Password reset successfully! Redirecting to login...', type: 'success' });
        setTimeout(() => onNavigate('login'), 2000);
        setLoading(false);
    };

    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    return (
        <>
            <style>{`
                body { background: #0a0e27; overflow: hidden; }
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
                .btn-secondary { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); transition: all 0.3s ease; }
                .btn-secondary:hover { background: rgba(255, 255, 255, 0.15); }
            `}</style>

            <div className="laser-bg"><div className="grid-overlay"></div></div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="glass-card rounded-3xl p-10 w-full max-w-md">
                    {step === 1 ? (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                                <p className="text-gray-400 text-sm">Enter your email to receive a reset code</p>
                            </div>

                            <form onSubmit={handleRequestCode} className="space-y-5">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email" className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" maxLength="254" required />
                                </div>

                                {message.text && (<div className={`text-sm text-center ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{message.text}</div>)}

                                <button type="submit" disabled={loading} className="btn-gradient w-full py-3 rounded-full text-white font-semibold text-base">{loading ? 'Sending Code...' : 'Send Reset Code'}</button>

                                <div className="text-center pt-4">
                                    <button type="button" onClick={() => onNavigate('login')} className="text-sm text-cyan-400 hover:text-cyan-300">← Back to Login</button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-white mb-2">Enter Reset Code</h1>
                                <p className="text-gray-400 text-sm">Check your email for the 6-digit code</p>
                                <p className={`text-xs mt-2 ${countdown <= 0 ? 'text-red-400' : 'text-cyan-400'}`}>
                                    {countdown > 0 ? `Code expires in ${minutes}:${seconds.toString().padStart(2, '0')}` : 'Code expired'}
                                </p>
                            </div>

                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Reset Code</label>
                                    <input type="text" value={resetCode} onChange={(e) => setResetCode(e.target.value)} placeholder="Enter 6-digit code" className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-center text-2xl tracking-widest" maxLength="6" pattern="\d{6}" required />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">New Password</label>
                                    <div className="relative">
                                        <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={handlePasswordChange} placeholder="Create a strong password" className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition pr-12" minLength="8" maxLength="128" required />
                                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{showNewPassword ? (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><line x1="1" y1="1" x2="23" y2="23"></line></>) : (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>)}</svg>
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
                                    <div className="mt-2 space-y-1 text-xs">
                                        <p className={passwordStrength.checks.length ? 'text-green-400' : 'text-gray-400'}>✓ At least 8 characters</p>
                                        <p className={passwordStrength.checks.lowercase ? 'text-green-400' : 'text-gray-400'}>✓ Contains lowercase letter</p>
                                        <p className={passwordStrength.checks.uppercase ? 'text-green-400' : 'text-gray-400'}>✓ Contains uppercase letter</p>
                                        <p className={passwordStrength.checks.number ? 'text-green-400' : 'text-gray-400'}>✓ Contains number</p>
                                        <p className={passwordStrength.checks.special ? 'text-green-400' : 'text-gray-400'}>✓ Contains special character</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition pr-12" minLength="8" maxLength="128" required />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{showConfirm ? (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><line x1="1" y1="1" x2="23" y2="23"></line></>) : (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>)}</svg>
                                        </button>
                                    </div>
                                </div>

                                {message.text && (<div className={`text-sm text-center ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{message.text}</div>)}

                                <button type="submit" disabled={loading} className="btn-gradient w-full py-3 rounded-full text-white font-semibold text-base">{loading ? 'Resetting Password...' : 'Reset Password'}</button>

                                <button type="button" onClick={() => setStep(1)} className="btn-secondary w-full py-3 rounded-full text-white font-semibold text-base">Request New Code</button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;

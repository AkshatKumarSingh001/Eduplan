import React, { useState, useEffect } from 'react';

const Login = ({ onLogin, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loginAttempts, setLoginAttempts] = useState(0);

    const MAX_ATTEMPTS = 5;

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

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email) && email.length <= 254;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (!email || !password) {
            setMessage({ text: 'Please enter both email and password', type: 'error' });
            return;
        }

        if (!validateEmail(email)) {
            setMessage({ text: 'Please enter a valid email address', type: 'error' });
            return;
        }

        if (loginAttempts >= MAX_ATTEMPTS) {
            setMessage({ text: 'Too many failed attempts. Please try again later.', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check demo account first
            if (email === 'demo@eduplan.ai' && password === 'Demo@123') {
                const user = { email, name: 'Demo User' };
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('authToken', 'demo_jwt_token_' + Date.now());
                
                setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
                setLoginAttempts(0);
                
                setTimeout(() => {
                    onLogin(user);
                }, 1500);
            } else {
                // Check registered users
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const foundUser = users.find(u => u.email === email && u.password === password);
                
                if (foundUser) {
                    const user = { email: foundUser.email, name: foundUser.fullName };
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('authToken', 'user_jwt_token_' + Date.now());
                    
                    setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
                    setLoginAttempts(0);
                    
                    setTimeout(() => {
                        onLogin(user);
                    }, 1500);
                } else {
                    throw new Error('Invalid email or password');
                }
            }
        } catch (error) {
            setLoginAttempts(prev => prev + 1);
            const remainingAttempts = MAX_ATTEMPTS - (loginAttempts + 1);
            setMessage({ 
                text: `${error.message}. ${remainingAttempts} attempts remaining.`, 
                type: 'error' 
            });
            setPassword('');
        } finally {
            setLoading(false);
        }
    };

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
                .floating-icon { position: absolute; font-size: 2.5rem; opacity: 0.4; transition: opacity 0.3s; }
                .floating-icon:hover { opacity: 0.9; }
            `}</style>

            <div className="laser-bg"><div className="grid-overlay"></div></div>

            <FloatingIcon icon="📚" className="top-[8%] left-[8%]" delay="0s" />
            <FloatingIcon icon="🎓" className="top-[15%] right-[10%]" delay="2s" />
            <FloatingIcon icon="💡" className="bottom-[12%] left-[12%]" delay="1s" />
            <FloatingIcon icon="🎯" className="top-[45%] right-[5%]" delay="5s" />
            <FloatingIcon icon="⚛️" className="bottom-[25%] right-[15%]" delay="3s" />
            <FloatingIcon icon="⭐" className="bottom-[8%] right-[25%]" delay="6s" />
            <FloatingIcon icon="✏️" className="top-[30%] left-[5%]" delay="7s" />
            <FloatingIcon icon="🗂️" className="top-[70%] left-[8%]" delay="2.5s" />

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="glass-card rounded-3xl p-10 w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">EduPlan AI</h1>
                        <p className="text-gray-400 text-sm">Smart Education Planning Platform</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm text-gray-300 mb-2">Email Address</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" maxLength="254" required />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition pr-12" minLength="8" maxLength="128" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        {showPassword ? (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><line x1="1" y1="1" x2="23" y2="23"></line></>) : (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>)}
                                    </svg>
                                </button>
                            </div>
                            <div className="text-right mt-2">
                                <button type="button" onClick={() => onNavigate && onNavigate('forgot-password')} className="text-sm text-cyan-400 hover:text-cyan-300">Forgot Password?</button>
                            </div>
                        </div>

                        {message.text && (<div className={`text-sm text-center ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{message.text}</div>)}

                        <button type="submit" disabled={loading} className="btn-gradient w-full py-3 rounded-full text-white font-semibold text-base">{loading ? 'Authenticating...' : 'Log In'}</button>

                        <div className="mt-6 p-3 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                            <p className="text-xs text-cyan-300 text-center font-semibold mb-1">Demo Credentials</p>
                            <p className="text-xs text-gray-300 text-center">Email: demo@eduplan.ai</p>
                            <p className="text-xs text-gray-300 text-center">Password: Demo@123</p>
                        </div>

                        <div className="text-center pt-4">
                            <p className="text-sm text-gray-400">Don't have an account? <button type="button" onClick={() => onNavigate && onNavigate('signup')} className="text-cyan-400 hover:text-cyan-300 font-semibold">Sign Up</button></p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

const FloatingIcon = ({ icon, className, delay }) => (
    <div className={`floating-icon ${className}`} style={{ animation: `floatIcon 6s ease-in-out infinite`, animationDelay: delay }}>{icon}</div>
);

export default Login;

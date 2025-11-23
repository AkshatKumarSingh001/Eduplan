import React from 'react';
import { Sparkles, X } from 'lucide-react';

const WelcomeModal = ({ user, onStartTour, onSkip }) => {
    return (
        <div className="fixed inset-0 bg-black/80 z-[10001] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 border-2 border-blue-500/50 rounded-3xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
                
                {/* Content */}
                <div className="relative z-10">
                    <button
                        onClick={onSkip}
                        className="absolute top-0 right-0 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce">
                            <Sparkles size={40} className="text-white" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Welcome to EduPlanner!
                    </h2>
                    
                    <p className="text-slate-300 text-center mb-2">
                        Hey {user?.name || user?.email?.split('@')[0] || 'there'}! 👋
                    </p>

                    <p className="text-slate-400 text-center mb-8 leading-relaxed">
                        We're excited to help you on your learning journey. Would you like a quick tour of the key features to get started?
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={onStartTour}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <Sparkles size={20} />
                            Start Tour (2 minutes)
                        </button>
                        
                        <button
                            onClick={onSkip}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium rounded-xl transition-all"
                        >
                            Skip - I'll explore on my own
                        </button>
                    </div>

                    <p className="text-xs text-slate-500 text-center mt-4">
                        You can restart the tour anytime from the "🎓 Tour" button in the top right
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;

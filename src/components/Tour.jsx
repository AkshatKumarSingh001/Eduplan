import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

const Tour = ({ onComplete, onSkip }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const steps = [
        {
            target: 'nav-map',
            title: '🗺️ Knowledge Map',
            description: 'Visualize your study sets as an interactive 3D graph. See connections between related topics and navigate your learning journey.',
            position: 'bottom'
        },
        {
            target: 'nav-content',
            title: '🔍 Content Finder',
            description: 'Search the internet for curated educational resources. Get AI-powered recommendations from Khan Academy, Coursera, YouTube, and more!',
            position: 'bottom'
        },
        {
            target: 'nav-progress',
            title: '📊 Progress Analytics',
            description: 'Track your learning progress with AI-powered gap analysis. Get personalized recommendations to improve your understanding.',
            position: 'bottom'
        },
        {
            target: 'nav-brainstorm',
            title: '⚡ Brainstorm',
            description: 'Create study sets, upload documents, and ask questions. Our AI will analyze your materials and generate smart study plans.',
            position: 'bottom'
        },
        {
            target: 'brainstorm-create',
            title: '✨ Create Your First Set',
            description: 'Click here to create a study set! Upload documents, and the AI will process them to help you learn more effectively.',
            position: 'left',
            action: () => {
                // Switch to brainstorm tab
                const brainstormTab = document.querySelector('[data-tab="rag-test"]');
                if (brainstormTab) brainstormTab.click();
            }
        }
    ];

    useEffect(() => {
        // Small delay before showing the tour
        setTimeout(() => setIsVisible(true), 500);
    }, []);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            const nextStep = currentStep + 1;
            if (steps[nextStep].action) {
                steps[nextStep].action();
            }
            setCurrentStep(nextStep);
        } else {
            completeTour();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onSkip) onSkip();
        }, 300);
    };

    const completeTour = () => {
        setIsVisible(false);
        // Return to map tab when tour completes
        const mapTab = document.querySelector('[data-tab="map"]');
        if (mapTab) mapTab.click();
        setTimeout(() => {
            if (onComplete) onComplete();
        }, 300);
    };

    const getTargetPosition = () => {
        const step = steps[currentStep];
        const target = document.querySelector(`[data-tour="${step.target}"]`);
        
        if (!target) return null;

        const rect = target.getBoundingClientRect();
        const position = { top: 0, left: 0 };

        switch (step.position) {
            case 'bottom':
                position.top = rect.bottom + 20;
                position.left = rect.left + (rect.width / 2);
                break;
            case 'top':
                position.top = rect.top - 20;
                position.left = rect.left + (rect.width / 2);
                break;
            case 'left':
                position.top = rect.top + (rect.height / 2);
                position.left = rect.left - 20;
                break;
            case 'right':
                position.top = rect.top + (rect.height / 2);
                position.left = rect.right + 20;
                break;
            default:
                position.top = rect.bottom + 20;
                position.left = rect.left + (rect.width / 2);
        }

        return position;
    };

    const getSpotlightPosition = () => {
        const step = steps[currentStep];
        const target = document.querySelector(`[data-tour="${step.target}"]`);
        
        if (!target) return null;

        const rect = target.getBoundingClientRect();
        return {
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16
        };
    };

    if (!isVisible) return null;

    const position = getTargetPosition();
    const spotlight = getSpotlightPosition();
    const step = steps[currentStep];

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/70 z-[9998] transition-opacity duration-300"
                style={{ opacity: isVisible ? 1 : 0 }}
            />

            {/* Spotlight */}
            {spotlight && (
                <div
                    className="fixed z-[9999] transition-all duration-300 rounded-lg"
                    style={{
                        top: `${spotlight.top}px`,
                        left: `${spotlight.left}px`,
                        width: `${spotlight.width}px`,
                        height: `${spotlight.height}px`,
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 20px rgba(59, 130, 246, 0.5)',
                        pointerEvents: 'none'
                    }}
                />
            )}

            {/* Tour Card */}
            {position && (
                <div
                    className="fixed z-[10000] transition-all duration-300"
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        transform: step.position === 'bottom' || step.position === 'top' 
                            ? 'translateX(-50%)' 
                            : step.position === 'left' 
                                ? 'translate(-100%, -50%)' 
                                : 'translate(0, -50%)',
                        opacity: isVisible ? 1 : 0
                    }}
                >
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-500/50 rounded-2xl shadow-2xl p-6 max-w-md backdrop-blur-xl">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">
                                    {step.title}
                                </h3>
                                <div className="text-xs text-blue-300">
                                    Step {currentStep + 1} of {steps.length}
                                </div>
                            </div>
                            <button
                                onClick={handleSkip}
                                className="text-slate-400 hover:text-white transition-colors p-1"
                                title="Skip tour"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <p className="text-slate-300 mb-6 leading-relaxed">
                            {step.description}
                        </p>

                        {/* Progress Dots */}
                        <div className="flex gap-2 mb-6 justify-center">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        index === currentStep
                                            ? 'w-8 bg-blue-500'
                                            : index < currentStep
                                                ? 'w-2 bg-green-500'
                                                : 'w-2 bg-slate-600'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            {currentStep > 0 && (
                                <button
                                    onClick={handlePrevious}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                                >
                                    <ArrowLeft size={16} />
                                    Previous
                                </button>
                            )}
                            
                            <button
                                onClick={handleSkip}
                                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                            >
                                Skip Tour
                            </button>

                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all ml-auto font-semibold"
                            >
                                {currentStep === steps.length - 1 ? (
                                    <>
                                        <Check size={16} />
                                        Finish
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Arrow pointing to target */}
                    {step.position === 'bottom' && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-blue-500/50" />
                    )}
                    {step.position === 'top' && (
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-blue-500/50" />
                    )}
                    {step.position === 'left' && (
                        <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[12px] border-l-blue-500/50" />
                    )}
                    {step.position === 'right' && (
                        <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] border-r-blue-500/50" />
                    )}
                </div>
            )}
        </>
    );
};

export default Tour;

import React, { useState } from 'react';
import { BookOpen, Calendar, Edit3, Save, X } from 'lucide-react';

const SetDetailView = ({ node, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(node.content || "No content available for this set yet. AI is generating study materials...");

    return (
        <div className="absolute top-20 right-4 bottom-4 w-[500px] bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40 transition-all duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-700 flex justify-between items-start bg-gradient-to-b from-slate-800/50 to-transparent">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{node.name}</h2>
                    <div className="flex gap-2 text-xs text-blue-300">
                        <span className="px-2 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">Study Set</span>
                        <span className="px-2 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">AI Optimized</span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-600 hover:border-slate-500"
                >
                    <X size={20} />
                    <span className="font-medium">Back</span>
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* AI Planner Section */}
                <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-3 text-emerald-400">
                        <Calendar size={18} />
                        <h3 className="font-semibold">AI Study Plan</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex gap-3 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                            <span>Review core concepts (15 mins)</span>
                        </li>
                        <li className="flex gap-3 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                            <span>Practice problem set A (30 mins)</span>
                        </li>
                        <li className="flex gap-3 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                            <span>Take quiz for gap analysis (10 mins)</span>
                        </li>
                    </ul>
                </div>

                {/* Content Finder / Editor Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-blue-400">
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} />
                            <h3 className="font-semibold">Learning Materials</h3>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-xs flex items-center gap-1 hover:text-blue-300 transition-colors"
                        >
                            {isEditing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit</>}
                        </button>
                    </div>

                    {isEditing ? (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-64 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none font-mono text-sm"
                        />
                    ) : (
                        <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
                            {content}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SetDetailView;

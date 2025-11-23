import React, { useState, useEffect } from 'react';
import { Newspaper, ArrowRight, Loader, Sparkles } from 'lucide-react';
import { ragAPI } from '../services/api';

const HeadlineSidebar = () => {
    const [headlines, setHeadlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadHeadlines();
    }, []);

    const loadHeadlines = async () => {
        try {
            setLoading(true);
            const response = await ragAPI.getAllHeadlines(8);
            setHeadlines(response.data || []);
            setError(null);
        } catch (err) {
            console.error('Error loading headlines:', err);
            setError(err.message);
            // Fallback to demo headlines
            setHeadlines([
                { title: "Upload documents to see AI-generated insights", source: "Get Started", set_name: "Demo" },
                { title: "Create a set and add documents in Brainstorm", source: "Quick Tip", set_name: "Guide" },
                { title: "Headlines are generated from your study materials", source: "Info", set_name: "Help" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="absolute top-20 left-4 bottom-4 w-80 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl flex flex-col overflow-hidden z-30 pointer-events-auto">
            <div className="p-5 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                    <Sparkles size={18} />
                    <h3 className="font-bold">AI-Generated Insights</h3>
                </div>
                <p className="text-xs text-slate-500">Key topics from your study materials</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader className="animate-spin text-purple-400" size={24} />
                    </div>
                ) : headlines.length === 0 ? (
                    <div className="text-center py-8 px-4">
                        <Newspaper size={32} className="mx-auto text-slate-600 mb-2" />
                        <p className="text-sm text-slate-400">No headlines yet</p>
                        <p className="text-xs text-slate-500 mt-1">Upload documents to generate insights</p>
                    </div>
                ) : (
                    headlines.map((item, idx) => (
                        <div key={idx} className="group p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/30 hover:border-purple-500/30 transition-all cursor-pointer">
                            <h4 className="text-sm font-medium text-slate-200 group-hover:text-purple-300 transition-colors mb-2 leading-snug">
                                {item.title}
                            </h4>
                            <div className="flex justify-between items-center text-[10px] text-slate-500">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-purple-400/70">{item.set_name}</span>
                                    {item.subject && (
                                        <>
                                            <span>•</span>
                                            <span>{item.subject}</span>
                                        </>
                                    )}
                                </div>
                                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {!loading && headlines.length > 0 && (
                <div className="p-3 border-t border-slate-800 bg-slate-900/50">
                    <button
                        onClick={loadHeadlines}
                        className="w-full py-2 text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-center gap-2"
                    >
                        <Sparkles size={14} />
                        Refresh Insights
                    </button>
                </div>
            )}
        </div>
    );
};

export default HeadlineSidebar;

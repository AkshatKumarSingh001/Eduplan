import React from 'react';
import { Newspaper, ArrowRight } from 'lucide-react';

const HeadlineSidebar = () => {
    const headlines = [
        { id: 1, title: "New AI Learning Models Released", source: "TechDaily", time: "2h ago" },
        { id: 2, title: "Effective Study Techniques for 2024", source: "EduBlog", time: "5h ago" },
        { id: 3, title: "Understanding Graph Theory in React", source: "Dev.to", time: "1d ago" },
    ];

    return (
        <div className="absolute top-20 left-4 bottom-4 w-80 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl flex flex-col overflow-hidden z-30 pointer-events-auto">
            <div className="p-5 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                    <Newspaper size={18} />
                    <h3 className="font-bold">Related Headlines</h3>
                </div>
                <p className="text-xs text-slate-500">Context from your previous topics</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {headlines.map(item => (
                    <div key={item.id} className="group p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/30 hover:border-purple-500/30 transition-all cursor-pointer">
                        <h4 className="text-sm font-medium text-slate-200 group-hover:text-purple-300 transition-colors mb-2">
                            {item.title}
                        </h4>
                        <div className="flex justify-between items-center text-[10px] text-slate-500">
                            <span>{item.source} • {item.time}</span>
                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeadlineSidebar;

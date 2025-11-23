import React, { useState, useEffect } from 'react';
import { Brain, Search, BarChart3, Zap, LogOut } from 'lucide-react';
import GraphView from './components/GraphView';
import SetDetailView from './components/SetDetailView';
import HeadlineSidebar from './components/HeadlineSidebar';
import ProgressView from './components/ProgressView';
import ContentFinder from './components/ContentFinder';
import RAGTestUI from './components/RAGTestUI';
import AuthContainer from './components/auth/AuthContainer';

function App() {
    const [activeTab, setActiveTab] = useState('map');
    const [selectedNode, setSelectedNode] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // Check for existing authentication
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const authToken = localStorage.getItem('authToken');
        
        if (storedUser && authToken) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
        setActiveTab('map');
    };

    const handleNodeClick = (node) => {
        setSelectedNode(node);
    };

    // Show authentication pages if not authenticated
    if (!isAuthenticated) {
        return <AuthContainer onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            {/* Top Navigation Bar */}
            <nav className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md fixed w-full z-50">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    EduPlanner
                </div>

                <div className="flex gap-8 items-center">
                    <NavIcon
                        icon={<Brain size={24} />}
                        label="Planner & Map"
                        active={activeTab === 'map'}
                        onClick={() => setActiveTab('map')}
                    />
                    <NavIcon
                        icon={<Search size={24} />}
                        label="Content Finder"
                        active={activeTab === 'content'}
                        onClick={() => setActiveTab('content')}
                    />
                    <NavIcon
                        icon={<BarChart3 size={24} />}
                        label="Progress"
                        active={activeTab === 'progress'}
                        onClick={() => setActiveTab('progress')}
                    />
                    <NavIcon
                        icon={<Zap size={24} />}
                        label="Brainstorm"
                        active={activeTab === 'rag-test'}
                        onClick={() => setActiveTab('rag-test')}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">{user?.email}</span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={18} />
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 pt-16 relative h-screen overflow-hidden flex flex-col">
                {activeTab === 'map' && (
                    <div className="flex flex-1 overflow-hidden">
                        <GraphView onNodeClick={handleNodeClick} />
                        <HeadlineSidebar />
                        {selectedNode && (
                            <SetDetailView
                                node={selectedNode}
                                onClose={() => setSelectedNode(null)}
                            />
                        )}
                    </div>
                )}
                {activeTab === 'content' && <ContentFinder />}
                {activeTab === 'progress' && <ProgressView />}
                {activeTab === 'rag-test' && (
                    <div className="w-full h-full">
                        <RAGTestUI />
                    </div>
                )}
            </main>
        </div>
    );
}

function NavIcon({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
}

export default App;

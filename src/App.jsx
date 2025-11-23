import React, { useState, useEffect } from 'react';
import { Brain, Search, BarChart3, Zap, LogOut } from 'lucide-react';
import GraphView from './components/GraphView';
import SetDetailView from './components/SetDetailView';
import HeadlineSidebar from './components/HeadlineSidebar';
import ProgressView from './components/ProgressView';
import ContentFinder from './components/ContentFinder';
import RAGTestUI from './components/RAGTestUI';
import AuthContainer from './components/auth/AuthContainer';
import Tour from './components/Tour';
import WelcomeModal from './components/WelcomeModal';

function App() {
    const [activeTab, setActiveTab] = useState('map');
    const [selectedNode, setSelectedNode] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [showTour, setShowTour] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    // Check for existing authentication
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const authToken = localStorage.getItem('authToken');
        
        if (storedUser && authToken) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []);

    // Check if user is new and should see welcome/tour
    useEffect(() => {
        if (isAuthenticated) {
            const hasSeenTour = localStorage.getItem('hasSeenTour');
            if (!hasSeenTour) {
                // Small delay before showing welcome
                setTimeout(() => setShowWelcome(true), 800);
            }
        }
    }, [isAuthenticated]);

    const handleLogin = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const handleStartTour = () => {
        setShowWelcome(false);
        setTimeout(() => setShowTour(true), 300);
    };

    const handleWelcomeSkip = () => {
        setShowWelcome(false);
        localStorage.setItem('hasSeenTour', 'true');
    };

    const handleTourComplete = () => {
        setShowTour(false);
        localStorage.setItem('hasSeenTour', 'true');
    };

    const handleTourSkip = () => {
        setShowTour(false);
        localStorage.setItem('hasSeenTour', 'true');
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
        setActiveTab('map');
    };

    const handleNodeClick = async (node) => {
        // Fetch complete set data from backend
        try {
            const response = await fetch(`https://eduplanai.onrender.com/api/sets/${node.id}`);
            if (response.ok) {
                const setData = await response.json();
                setSelectedNode(setData);
            } else {
                // Fallback to node data if fetch fails
                setSelectedNode(node);
            }
        } catch (error) {
            console.error('Error fetching set details:', error);
            // Fallback to node data
            setSelectedNode(node);
        }
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
                        dataTour="nav-map"
                        dataTab="map"
                    />
                    <NavIcon
                        icon={<Search size={24} />}
                        label="Content Finder"
                        active={activeTab === 'content'}
                        onClick={() => setActiveTab('content')}
                        dataTour="nav-content"
                    />
                    <NavIcon
                        icon={<BarChart3 size={24} />}
                        label="Progress"
                        active={activeTab === 'progress'}
                        onClick={() => setActiveTab('progress')}
                        dataTour="nav-progress"
                    />
                    <NavIcon
                        icon={<Zap size={24} />}
                        label="Brainstorm"
                        active={activeTab === 'rag-test'}
                        onClick={() => setActiveTab('rag-test')}
                        dataTour="nav-brainstorm"
                        dataTab="rag-test"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">{user?.email}</span>
                    <button
                        onClick={() => {
                            setShowWelcome(false);
                            setShowTour(true);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm"
                        title="Restart Tour"
                    >
                        🎓 Tour
                    </button>
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

            {/* Welcome Modal */}
            {showWelcome && (
                <WelcomeModal 
                    user={user}
                    onStartTour={handleStartTour}
                    onSkip={handleWelcomeSkip}
                />
            )}

            {/* Tour Component */}
            {showTour && (
                <Tour 
                    onComplete={handleTourComplete}
                    onSkip={handleTourSkip}
                />
            )}
        </div>
    );
}

function NavIcon({ icon, label, active, onClick, dataTour, dataTab }) {
    return (
        <button
            onClick={onClick}
            data-tour={dataTour}
            data-tab={dataTab}
            className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
}

export default App;

// Force rebuild after UI changes

import React, { useState } from 'react';
import { useRAG } from '../contexts/RAGContext';
import DocumentUpload from './DocumentUpload';
import { Search, BookOpen, Loader, CheckCircle, AlertCircle, FileText, Brain, Trash2, Edit2, Save, X } from 'lucide-react';

const RAGTestUI = () => {
    const {
        sets,
        createSet,
        updateSet,
        deleteSet,
        queryDocuments,
        generateStudyPlan,
        loading
    } = useRAG();

    const [activeTab, setActiveTab] = useState('create');
    const [newSet, setNewSet] = useState({
        name: '',
        subject: '',
        grade: '',
        difficulty: 'medium'
    });
    const [selectedSet, setSelectedSet] = useState(null);
    const [query, setQuery] = useState('');
    const [queryResults, setQueryResults] = useState(null);
    const [studyPlan, setStudyPlan] = useState(null);
    const [status, setStatus] = useState(null);
    const [editingSet, setEditingSet] = useState(null);
    const [editForm, setEditForm] = useState({});

    const handleCreateSet = async (e) => {
        e.preventDefault();
        try {
            setStatus({ type: 'loading', message: 'Creating set...' });
            const result = await createSet(newSet);
            setStatus({ type: 'success', message: `Set "${result.name}" created successfully!` });
            setNewSet({ name: '', subject: '', grade: '', difficulty: 'medium' });
            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    const handleQuery = async (e) => {
        e.preventDefault();
        if (!query) {
            setStatus({ type: 'error', message: 'Please enter a query.' });
            return;
        }
        try {
            setStatus({ type: 'loading', message: 'Searching documents...' });
            setQueryResults(null); // Clear previous results
            const results = await queryDocuments(query, selectedSet);
            setQueryResults(results);

            if (results && results.answer) {
                setStatus({ type: 'success', message: 'AI answer generated successfully!' });
            } else if (results && results.results && results.results.length > 0) {
                setStatus({ type: 'success', message: `Found ${results.results.length} relevant document chunks.` });
            } else {
                setStatus({ type: 'success', message: 'No direct results found, but the AI may still provide an answer.' });
            }
        } catch (error) {
            console.error("Frontend query error:", error);
            setStatus({ type: 'error', message: `Search failed: ${error.message}` });
            setQueryResults(null);
        }
    };

    const handleGeneratePlan = async () => {
        if (!selectedSet) {
            setStatus({ type: 'error', message: 'Please select a set first' });
            return;
        }
        try {
            setStatus({ type: 'loading', message: 'Generating study plan...' });
            const plan = await generateStudyPlan(selectedSet, 7, 2);
            setStudyPlan(plan);
            setStatus({ type: 'success', message: 'Study plan generated!' });
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
            setStudyPlan(null);
        }
    };

    const handleEditSet = (set) => {
        setEditingSet(set.id);
        setEditForm({
            name: set.name,
            subject: set.subject,
            grade: set.grade,
            difficulty: set.difficulty
        });
    };

    const handleSaveEdit = async (setId) => {
        try {
            setStatus({ type: 'loading', message: 'Updating set...' });
            await updateSet(setId, editForm);
            setEditingSet(null);
            setEditForm({});
            setStatus({ type: 'success', message: 'Set updated successfully!' });
            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    const handleCancelEdit = () => {
        setEditingSet(null);
        setEditForm({});
    };

    const handleDeleteSet = async (setId) => {
        if (!confirm('Are you sure you want to delete this set? This will also delete all associated documents and data.')) {
            return;
        }
        try {
            setStatus({ type: 'loading', message: 'Deleting set...' });
            await deleteSet(setId);
            if (selectedSet === setId) {
                setSelectedSet(null);
            }
            setStatus({ type: 'success', message: 'Set deleted successfully!' });
            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    return (
        <div className="h-full w-full p-8 overflow-y-auto bg-slate-950">
            <div className="w-full space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Brainstorm
                    </h1>
                    <p className="text-slate-400">Upload documents, query knowledge, and generate study plans with AI</p>
                </div>

                {/* Status Message */}
                {status && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 border border-green-500/30' :
                        status.type === 'error' ? 'bg-red-500/10 border border-red-500/30' :
                            'bg-blue-500/10 border border-blue-500/30'
                        }`}>
                        {status.type === 'loading' && <Loader className="animate-spin text-blue-400" size={20} />}
                        {status.type === 'success' && <CheckCircle className="text-green-400" size={20} />}
                        {status.type === 'error' && <AlertCircle className="text-red-400" size={20} />}
                        <p className={`text-sm ${status.type === 'success' ? 'text-green-300' :
                            status.type === 'error' ? 'text-red-300' :
                                'text-blue-300'
                            }`}>
                            {status.message}
                        </p>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-slate-800">
                    {[
                        { id: 'create', label: 'Create Set', icon: BookOpen },
                        { id: 'upload', label: 'Upload Document', icon: FileText },
                        { id: 'query', label: 'Query Documents', icon: Search },
                        { id: 'plan', label: 'Generate Plan', icon: Brain }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    {/* Create Set Tab */}
                    {activeTab === 'create' && (
                        <div className="w-full">
                            <h2 className="text-2xl font-bold mb-4">Create New Set</h2>
                            <form onSubmit={handleCreateSet} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Set Name</label>
                                    <input
                                        type="text"
                                        value={newSet.name}
                                        onChange={(e) => setNewSet({ ...newSet, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Calculus Integration"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                                        <input
                                            type="text"
                                            value={newSet.subject}
                                            onChange={(e) => setNewSet({ ...newSet, subject: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., Mathematics"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Grade</label>
                                        <input
                                            type="text"
                                            value={newSet.grade}
                                            onChange={(e) => setNewSet({ ...newSet, grade: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., 12"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                                    <select
                                        value={newSet.difficulty}
                                        onChange={(e) => setNewSet({ ...newSet, difficulty: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                                >
                                    {loading ? 'Creating...' : 'Create Set'}
                                </button>
                            </form>

                            {/* Existing Sets */}
                            {sets.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4">Existing Sets ({sets.length})</h3>
                                    <div className="space-y-2">
                                        {sets.map(set => (
                                            <div
                                                key={set.id}
                                                className={`p-4 rounded-lg border transition-all ${selectedSet === set.id
                                                    ? 'bg-blue-500/20 border-blue-500'
                                                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                                                    }`}
                                            >
                                                {editingSet === set.id ? (
                                                    /* Edit Mode */
                                                    <div className="space-y-3">
                                                        <input
                                                            type="text"
                                                            value={editForm.name}
                                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                                                            placeholder="Set Name"
                                                        />
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <input
                                                                type="text"
                                                                value={editForm.subject}
                                                                onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                                                                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                                                                placeholder="Subject"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editForm.grade}
                                                                onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })}
                                                                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                                                                placeholder="Grade"
                                                            />
                                                        </div>
                                                        <select
                                                            value={editForm.difficulty}
                                                            onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                                                        >
                                                            <option value="easy">Easy</option>
                                                            <option value="medium">Medium</option>
                                                            <option value="hard">Hard</option>
                                                        </select>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleSaveEdit(set.id)}
                                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 rounded text-sm font-medium transition-colors"
                                                            >
                                                                <Save size={16} />
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-700 rounded text-sm font-medium transition-colors"
                                                            >
                                                                <X size={16} />
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* View Mode */
                                                    <div>
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div
                                                                onClick={() => setSelectedSet(set.id)}
                                                                className="flex-1 cursor-pointer"
                                                            >
                                                                <h4 className="font-semibold">{set.name}</h4>
                                                                <p className="text-sm text-slate-400">{set.subject} • Grade {set.grade}</p>
                                                            </div>
                                                            <span className={`px-2 py-1 rounded text-xs ${set.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                                                                set.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                                                    'bg-red-500/20 text-red-300'
                                                                }`}>
                                                                {set.difficulty}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleEditSet(set)}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded text-xs font-medium transition-colors"
                                                            >
                                                                <Edit2 size={14} />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteSet(set.id)}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-xs font-medium transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Upload Document Tab */}
                    {activeTab === 'upload' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Upload Document</h2>
                            {selectedSet ? (
                                <div>
                                    <p className="text-slate-400 mb-4">
                                        Uploading to: <span className="text-white font-semibold">
                                            {sets.find(s => s.id === selectedSet)?.name}
                                        </span>
                                    </p>
                                    <DocumentUpload
                                        setId={selectedSet}
                                        onUploadComplete={() => setStatus({ type: 'success', message: 'Document processed!' })}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FileText size={48} className="mx-auto text-slate-600 mb-4" />
                                    <p className="text-slate-400">Please select a set first from the "Create Set" tab</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Query Documents Tab */}
                    {activeTab === 'query' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Query Documents</h2>
                            <form onSubmit={handleQuery} className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Search Query</label>
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., integration by parts"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                                >
                                    {loading ? 'Searching...' : 'Search'}
                                </button>
                            </form>

                            {/* Query Results */}
                            {queryResults && (
                                <div className="space-y-6">
                                    {/* AI Answer */}
                                    {queryResults.answer && (
                                        <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Brain className="text-blue-400" size={24} />
                                                <h3 className="text-xl font-semibold text-blue-300">AI Answer</h3>
                                            </div>
                                            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{queryResults.answer}</p>

                                            {/* Confidence & Search Type */}
                                            <div className="flex gap-4 mt-4 pt-4 border-t border-slate-700">
                                                <span className="text-xs text-slate-400">
                                                    Confidence: <span className="text-blue-400">{(queryResults.confidence * 100).toFixed(0)}%</span>
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    Search: <span className="text-purple-400">{queryResults.search_type || 'AI-powered'}</span>
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sources */}
                                    {queryResults.sources && queryResults.sources.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                <FileText size={20} className="text-slate-400" />
                                                Sources ({queryResults.sources.length})
                                            </h3>
                                            <div className="space-y-3">
                                                {queryResults.sources.map((source, idx) => (
                                                    <div key={idx} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-sm text-blue-400">{source.citation || `Source ${idx + 1}`}</span>
                                                            {source.relevance && (
                                                                <span className="text-xs text-slate-500">
                                                                    Relevance: {(source.relevance * 100).toFixed(0)}%
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            Source: {source.source}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Fallback for keyword search results */}
                                    {queryResults.results && queryResults.results.length > 0 && !queryResults.answer && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Keyword Search Results ({queryResults.results.length})</h3>
                                            <div className="space-y-3">
                                                {queryResults.results.map((result, idx) => (
                                                    <div key={idx} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                                                        <p className="text-sm text-slate-300">{result.chunk}</p>
                                                        <div className="text-xs text-slate-500 mt-2">
                                                            Source: {result.document.filename}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Generate Plan Tab */}
                    {activeTab === 'plan' && (
                        <div className="w-full">
                            <h2 className="text-2xl font-bold mb-4">Generate Study Plan</h2>
                            {selectedSet ? (
                                <div>
                                    <p className="text-slate-400 mb-4">
                                        Generating plan for: <span className="text-white font-semibold">
                                            {sets.find(s => s.id === selectedSet)?.name}
                                        </span>
                                    </p>
                                    <button
                                        onClick={handleGeneratePlan}
                                        disabled={loading}
                                        className="w-full py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors mb-6"
                                    >
                                        {loading ? 'Generating...' : 'Generate 7-Day Study Plan'}
                                    </button>

                                    {/* Study Plan Display */}
                                    {studyPlan && (
                                        <div className="space-y-4">
                                            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                                <h3 className="font-semibold mb-2">{studyPlan.set_name}</h3>
                                                <p className="text-sm text-slate-400">
                                                    {studyPlan.duration_days} days • {studyPlan.hours_per_day} hours/day • {studyPlan.total_hours} total hours
                                                </p>
                                            </div>

                                            {studyPlan.study_plan.map((day, idx) => (
                                                <div key={idx} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h4 className="font-semibold">Day {day.day} - {day.date}</h4>
                                                        <span className={`px-2 py-1 rounded text-xs ${day.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                                                            day.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                                                'bg-red-500/20 text-red-300'
                                                            }`}>
                                                            {day.difficulty}
                                                        </span>
                                                    </div>

                                                    <div className="mb-3">
                                                        <h5 className="text-sm font-medium text-slate-300 mb-2">Objectives:</h5>
                                                        <ul className="text-sm text-slate-400 space-y-1">
                                                            {day.objectives.map((obj, i) => (
                                                                <li key={i}>• {obj}</li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div>
                                                        <h5 className="text-sm font-medium text-slate-300 mb-2">Tasks:</h5>
                                                        <div className="space-y-2">
                                                            {day.tasks.map((task, i) => (
                                                                <div key={i} className="flex justify-between items-center text-sm">
                                                                    <span className="text-slate-400">{task.task}</span>
                                                                    <span className="text-slate-500">{task.duration}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Brain size={48} className="mx-auto text-slate-600 mb-4" />
                                    <p className="text-slate-400">Please select a set first from the "Create Set" tab</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RAGTestUI;

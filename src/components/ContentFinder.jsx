import React, { useState } from 'react';
import { Search, BookOpen, Video, FileText, ExternalLink, Star, Clock, Filter, Loader, Brain, Globe } from 'lucide-react';
import { useRAG } from '../contexts/RAGContext';
import { searchAPI } from '../services/api';

const ContentFinder = () => {
    const { queryDocuments, sets, loading } = useRAG();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchResults, setSearchResults] = useState(null);
    const [searching, setSearching] = useState(false);

    // Mock content data (fallback when no RAG results)
    const mockContentItems = [
        {
            id: 1,
            title: 'Introduction to Calculus - Khan Academy',
            type: 'video',
            source: 'Khan Academy',
            duration: '15 min',
            rating: 4.8,
            topic: 'Calculus',
            url: 'https://khanacademy.org',
            description: 'Comprehensive introduction to calculus concepts including limits and derivatives.'
        },
        {
            id: 2,
            title: 'React Hooks Complete Guide',
            type: 'article',
            source: 'Dev.to',
            duration: '10 min read',
            rating: 4.5,
            topic: 'React JS',
            url: 'https://dev.to',
            description: 'Deep dive into React Hooks with practical examples and best practices.'
        },
        {
            id: 3,
            title: 'Linear Algebra MIT OpenCourseWare',
            type: 'course',
            source: 'MIT OCW',
            duration: '12 weeks',
            rating: 4.9,
            topic: 'Linear Algebra',
            url: 'https://ocw.mit.edu',
            description: 'Complete linear algebra course from MIT with lectures and problem sets.'
        },
    ];

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setSearching(true);
            console.log('Searching for:', searchQuery);
            
            // Use the internet search API instead of RAG
            const response = await searchAPI.search(searchQuery, 10);
            console.log('Search response:', response.data);
            
            if (response.data && response.data.resources && response.data.resources.length > 0) {
                setSearchResults(response.data);
            } else {
                console.warn('No resources found in response');
                setSearchResults({ resources: [] });
            }
        } catch (error) {
            console.error('Search error:', error);
            console.error('Error details:', error.response?.data || error.message);
            // Set empty results instead of null to show "no results" message
            setSearchResults({ resources: [] });
        } finally {
            setSearching(false);
        }
    };

    // Determine what content to display
    const displayContent = searchResults && searchResults.resources && searchResults.resources.length > 0
        ? searchResults.resources.map((resource, idx) => ({
            id: `resource-${idx}`,
            title: resource.title,
            type: resource.type,
            source: resource.source,
            duration: resource.duration,
            rating: resource.rating,
            topic: searchQuery,
            url: resource.url,
            description: resource.description,
            difficulty: resource.difficulty
        }))
        : mockContentItems.filter(item => {
            const matchesSearch = searchQuery ? (
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.topic.toLowerCase().includes(searchQuery.toLowerCase())
            ) : true;
            const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
            return matchesSearch && matchesFilter;
        });

    const getTypeColor = (type) => {
        const colors = {
            'ai-answer': 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30',
            video: 'bg-red-500/20 text-red-300 border-red-500/30',
            article: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
            course: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
            interactive: 'bg-green-500/20 text-green-300 border-green-500/30',
            document: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        };
        return colors[type] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    };

    return (
        <div className="h-full w-full p-8 overflow-y-auto bg-slate-950">
            <div className="w-full space-y-6">

                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Content Finder</h2>
                    <p className="text-slate-400">
                        {searchResults
                            ? 'AI-curated educational resources from across the internet'
                            : 'Discover the best learning resources from Khan Academy, Coursera, YouTube & more'}
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for topics, resources, or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {searching && (
                        <Loader className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 animate-spin" size={20} />
                    )}
                </form>

                {/* Search Status */}
                {searchResults && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2">
                        <Globe className="text-blue-400" size={20} />
                        <p className="text-sm text-blue-300">
                            🌐 Showing curated educational resources from the internet
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {searching && (
                    <div className="text-center py-16">
                        <Loader size={48} className="mx-auto text-blue-400 mb-4 animate-spin" />
                        <h3 className="text-xl font-semibold text-slate-300 mb-2">Searching the web...</h3>
                        <p className="text-slate-500">
                            AI is curating the best educational resources for "{searchQuery}"
                        </p>
                    </div>
                )}

                {/* Results Count */}
                {!searching && displayContent.length > 0 && (
                    <div className="text-sm text-slate-400">
                        Found <span className="text-white font-semibold">{displayContent.length}</span> resources
                        {searchResults && searchResults.resources && searchResults.resources.length > 0 && (
                            <span className="ml-2 text-blue-400">(AI-curated from the web)</span>
                        )}
                    </div>
                )}

                {/* Content Grid */}
                {!searching && displayContent.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayContent.map(item => (
                            <ContentCard key={item.id} item={item} getTypeColor={getTypeColor} />
                        ))}
                    </div>
                )}

                {/* Empty State - No Results */}
                {!searching && searchResults && displayContent.length === 0 && (
                    <div className="text-center py-16">
                        <Globe size={48} className="mx-auto text-slate-600 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-400 mb-2">No resources found</h3>
                        <p className="text-slate-500">
                            Try searching for a different topic or check your connection
                        </p>
                    </div>
                )}

                {/* Empty State - Initial */}
                {!searching && !searchResults && displayContent.length === 0 && (
                    <div className="text-center py-16">
                        <Globe size={48} className="mx-auto text-slate-600 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-400 mb-2">Search for educational resources</h3>
                        <p className="text-slate-500">
                            Enter a topic above to discover curated learning materials from the internet
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

// Reusable Content Card Component
const ContentCard = ({ item, getTypeColor }) => {
    const getDifficultyColor = (difficulty) => {
        const colors = {
            beginner: 'bg-green-500/20 text-green-300',
            intermediate: 'bg-yellow-500/20 text-yellow-300',
            advanced: 'bg-red-500/20 text-red-300'
        };
        return colors[difficulty] || 'bg-slate-500/20 text-slate-300';
    };

    return (
        <div className="group bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-blue-500/10">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">
                        {item.title}
                    </h3>
                    <p className="text-sm text-slate-400">{item.source}</p>
                </div>
                {item.url !== '#' && (
                    <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-800 hover:bg-blue-500 rounded-lg transition-colors"
                    >
                        <ExternalLink size={16} className="text-slate-300" />
                    </a>
                )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 mb-4 leading-relaxed line-clamp-3">
                {item.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.type)}`}>
                        {item.type}
                    </span>
                    {item.difficulty && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                            {item.difficulty}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-medium">{item.rating.toFixed(1)}</span>
                </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock size={12} />
                <span>{item.duration}</span>
            </div>
        </div>
    );
};

export default ContentFinder;

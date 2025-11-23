import React, { useRef, useCallback, useState, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { useRAG } from '../contexts/RAGContext';

const GraphView = ({ onNodeClick }) => {
    const fgRef = useRef();
    const { sets, loadSets } = useRAG();
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });

    // Load sets when component mounts
    useEffect(() => {
        loadSets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Convert sets to graph data
    useEffect(() => {
        if (!sets || sets.length === 0) {
            setGraphData({ nodes: [], links: [] });
            return;
        }

        // Create nodes from sets
        const nodes = sets.map(set => ({
            id: set.id,
            name: set.name,
            val: 10,
            color: getColorBySubject(set.subject),
            subject: set.subject,
            grade: set.grade,
            difficulty: set.difficulty
        }));

        // Create links between related sets (same subject or grade)
        const links = [];
        for (let i = 0; i < sets.length; i++) {
            for (let j = i + 1; j < sets.length; j++) {
                if (sets[i].subject === sets[j].subject || sets[i].grade === sets[j].grade) {
                    links.push({
                        source: sets[i].id,
                        target: sets[j].id
                    });
                }
            }
        }

        setGraphData({ nodes, links });
    }, [sets]);

    // Helper function to assign colors based on subject
    const getColorBySubject = (subject) => {
        const colors = {
            'Mathematics': '#4f46e5',
            'Science': '#0ea5e9',
            'Computer Science': '#8b5cf6',
            'Physics': '#ec4899',
            'Chemistry': '#14b8a6',
            'Biology': '#10b981',
            'History': '#f59e0b',
            'Geography': '#06b6d4',
            'English': '#ef4444',
            'Languages': '#f97316'
        };
        return colors[subject] || '#22d3ee';
    };

    const handleClick = useCallback(node => {
        // Aim at node from outside it
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        fgRef.current.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            node, // lookAt ({ x, y, z })
            3000  // ms transition duration
        );

        if (onNodeClick) {
            onNodeClick(node);
        }
    }, [fgRef, onNodeClick]);

    return (
        <div className="h-full w-full bg-slate-950 relative">
            {graphData.nodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h3 className="text-xl font-semibold mb-2">No Sets Created Yet</h3>
                    <p className="text-sm">Go to Brainstorm tab to create your first study set!</p>
                </div>
            ) : (
                <ForceGraph3D
                    ref={fgRef}
                    graphData={graphData}
                    nodeLabel="name"
                    nodeColor="color"
                    nodeVal="val"
                    backgroundColor="#020617" // slate-950
                    linkColor={() => '#94a3b8'} // slate-400
                    onNodeClick={handleClick}
                    nodeResolution={8}
                />
            )}
        </div>
    );
};

export default GraphView;

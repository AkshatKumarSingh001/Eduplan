import React, { useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

// Mock Data for initial visualization
const MOCK_DATA = {
    nodes: [
        { id: 'root', name: 'My Learning Path', val: 20, color: '#4f46e5' },
        { id: 'math', name: 'Mathematics', val: 10, color: '#0ea5e9' },
        { id: 'cs', name: 'Computer Science', val: 10, color: '#0ea5e9' },
        { id: 'calc', name: 'Calculus', val: 5, color: '#22d3ee' },
        { id: 'alg', name: 'Algebra', val: 5, color: '#22d3ee' },
        { id: 'react', name: 'React JS', val: 5, color: '#22d3ee' },
        { id: 'algo', name: 'Algorithms', val: 5, color: '#22d3ee' },
    ],
    links: [
        { source: 'root', target: 'math' },
        { source: 'root', target: 'cs' },
        { source: 'math', target: 'calc' },
        { source: 'math', target: 'alg' },
        { source: 'cs', target: 'react' },
        { source: 'cs', target: 'algo' },
    ]
};

const GraphView = ({ onNodeClick }) => {
    const fgRef = useRef();

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
        <div className="h-full w-full bg-slate-950">
            <ForceGraph3D
                ref={fgRef}
                graphData={MOCK_DATA}
                nodeLabel="name"
                nodeColor="color"
                nodeVal="val"
                backgroundColor="#020617" // slate-950
                linkColor={() => '#94a3b8'} // slate-400
                onNodeClick={handleClick}
                nodeResolution={8}
            />
        </div>
    );
};

export default GraphView;

const express = require('express');
const router = express.Router();
const ragEngine = require('../services/ragEngine');
const planGenerator = require('../services/planGenerator');
const knowledgeGraph = require('../services/knowledgeGraph');

// Query documents with AI-generated answer (Content Finder)
router.post('/query', async (req, res) => {
    try {
        const { query, setId } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        // AI-generated answer
        const answer = await ragEngine.generateAnswer(query, setId);
        res.json(answer);
    } catch (err) {
        console.error('RAG query error:', err);
        // Send a more structured error response
        res.status(500).json({ 
            error: 'Failed to generate AI answer.',
            details: err.message 
        });
    }
});

// Generate study plan
router.post('/generate-plan/:setId', async (req, res) => {
    try {
        const { setId } = req.params;
        const { duration = 7, hoursPerDay = 2 } = req.body;

        const studyPlan = await planGenerator.generateStudyPlan(setId, duration, hoursPerDay);
        res.json(studyPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Set connections
router.get('/connections/:setId', async (req, res) => {
    try {
        const { setId } = req.params;

        const connections = await knowledgeGraph.getSetConnections(setId);
        res.json(connections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all headlines from recent sets
router.get('/headlines', async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const headlines = await ragEngine.getAllHeadlines(parseInt(limit));
        res.json(headlines);
    } catch (error) {
        console.error('Error fetching headlines:', error);
        res.status(500).json({ error: error.message });
    }
});

// Generate headlines for a set
router.post('/headlines/:setId', async (req, res) => {
    try {
        const { setId } = req.params;
        const { limit = 5 } = req.body;

        const headlines = await ragEngine.generateHeadlines(setId, limit);
        res.json(headlines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Analyze knowledge gaps
router.post('/gap-analysis/:setId', async (req, res) => {
    try {
        const { setId } = req.params;

        const gapAnalysis = await ragEngine.analyzeKnowledgeGaps(setId);
        res.json(gapAnalysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

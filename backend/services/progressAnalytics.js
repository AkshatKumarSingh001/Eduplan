// Progress Analytics Service - AI-powered learning analytics
const db = require('../config/database');
const { generateGeminiResponse } = require('../utils/geminiClient');

class ProgressAnalytics {
    /**
     * Get comprehensive progress data for all sets
     */
    async getProgressOverview() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    s.id,
                    s.name as topic,
                    s.subject,
                    s.difficulty,
                    COALESCE(SUM(ss.duration_minutes), 0) / 60.0 as time_hours,
                    COALESCE(AVG(qr.score), 0) as avg_score,
                    COUNT(DISTINCT ss.id) as session_count,
                    COUNT(DISTINCT qr.id) as quiz_count,
                    MAX(ss.session_date) as last_studied
                FROM sets s
                LEFT JOIN study_sessions ss ON s.id = ss.set_id
                LEFT JOIN quiz_results qr ON s.id = qr.set_id
                GROUP BY s.id, s.name, s.subject, s.difficulty
                HAVING time_hours > 0 OR quiz_count > 0
                ORDER BY time_hours DESC
            `;

            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Calculate status based on time vs performance
                const enrichedData = rows.map(row => {
                    let status = 'learning';
                    
                    if (row.avg_score >= 80) {
                        status = 'mastered';
                    } else if (row.time_hours > 10 && row.avg_score < 50) {
                        status = 'struggling';
                    } else if (row.time_hours > 5 && row.avg_score < 60) {
                        status = 'struggling';
                    }

                    return {
                        ...row,
                        status,
                        time: Math.round(row.time_hours * 10) / 10,
                        score: Math.round(row.avg_score)
                    };
                });

                resolve(enrichedData);
            });
        });
    }

    /**
     * Get detailed gap analysis for a specific set
     */
    async getSetGapAnalysis(setId) {
        return new Promise((resolve, reject) => {
            // Get quiz results to identify weak areas
            const quizSql = `
                SELECT topic, score, weak_areas, completed_at
                FROM quiz_results
                WHERE set_id = ?
                ORDER BY completed_at DESC
            `;

            db.all(quizSql, [setId], async (err, quizResults) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Get study sessions
                const sessionSql = `
                    SELECT duration_minutes, activities, session_date
                    FROM study_sessions
                    WHERE set_id = ?
                    ORDER BY session_date DESC
                `;

                db.all(sessionSql, [setId], async (err2, sessions) => {
                    if (err2) {
                        reject(err2);
                        return;
                    }

                    // Get set info
                    db.get('SELECT * FROM sets WHERE id = ?', [setId], async (err3, set) => {
                        if (err3 || !set) {
                            reject(err3 || new Error('Set not found'));
                            return;
                        }

                        // Parse weak areas from quiz results
                        const weakAreasMap = {};
                        const allWeakAreas = [];

                        quizResults.forEach(quiz => {
                            if (quiz.weak_areas) {
                                try {
                                    const areas = JSON.parse(quiz.weak_areas);
                                    areas.forEach(area => {
                                        weakAreasMap[area] = (weakAreasMap[area] || 0) + 1;
                                        allWeakAreas.push(area);
                                    });
                                } catch (e) {
                                    // Handle plain text weak areas
                                    const areas = quiz.weak_areas.split(',').map(a => a.trim());
                                    areas.forEach(area => {
                                        weakAreasMap[area] = (weakAreasMap[area] || 0) + 1;
                                        allWeakAreas.push(area);
                                    });
                                }
                            }
                        });

                        // Get most common weak areas
                        const sortedWeakAreas = Object.entries(weakAreasMap)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 5)
                            .map(([area]) => area);

                        // Calculate gap details (simulate subtopic scores)
                        const gapDetails = {};
                        if (sortedWeakAreas.length > 0) {
                            sortedWeakAreas.forEach(area => {
                                gapDetails[area] = Math.round(Math.random() * 30 + 20); // Low score for weak areas
                            });
                        }

                        resolve({
                            setId,
                            setName: set.name,
                            weakAreas: sortedWeakAreas,
                            strengths: [], // Can be enhanced with good performance areas
                            gapDetails,
                            totalSessions: sessions.length,
                            totalQuizzes: quizResults.length,
                            averageScore: quizResults.length > 0 
                                ? quizResults.reduce((sum, q) => sum + q.score, 0) / quizResults.length 
                                : 0
                        });
                    });
                });
            });
        });
    }

    /**
     * Generate AI-powered recommendations based on progress data
     */
    async generateRecommendations(progressData) {
        const strugglingTopics = progressData.filter(d => d.status === 'struggling');
        
        if (strugglingTopics.length === 0) {
            return {
                recommendation: "Great job! You're making steady progress across all your topics. Keep up the consistent study routine.",
                strugglingTopics: []
            };
        }

        const prompt = `You are an AI learning coach analyzing a student's study progress. Based on the data below, provide personalized recommendations.

Struggling Topics (High time spent, Low performance):
${strugglingTopics.map(t => `- ${t.topic}: ${t.time} hours spent, ${t.score}% average score`).join('\n')}

Provide:
1. A brief analysis (2-3 sentences) of why these topics might be challenging
2. Specific, actionable study strategies for improvement
3. Suggested approach for breaking down complex topics

Keep your response concise and encouraging (max 150 words).`;

        try {
            const aiRecommendation = await generateGeminiResponse(prompt, { 
                temperature: 0.7, 
                maxTokens: 300 
            });

            return {
                recommendation: aiRecommendation,
                strugglingTopics: strugglingTopics.map(t => t.topic)
            };
        } catch (error) {
            console.error('Error generating AI recommendations:', error);
            return {
                recommendation: `You are spending significant time on ${strugglingTopics[0].topic} with suboptimal results. Consider switching from passive reading to active recall techniques. Break down complex topics into smaller, manageable chunks and practice regularly.`,
                strugglingTopics: strugglingTopics.map(t => t.topic)
            };
        }
    }

    /**
     * Log a study session
     */
    async logStudySession(setId, durationMinutes, activities = '', notes = '') {
        return new Promise((resolve, reject) => {
            const { v4: uuidv4 } = require('uuid');
            const id = uuidv4();

            const sql = `
                INSERT INTO study_sessions (id, set_id, duration_minutes, activities, notes)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.run(sql, [id, setId, durationMinutes, activities, notes], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ id, setId, durationMinutes });
            });
        });
    }

    /**
     * Log a quiz result
     */
    async logQuizResult(setId, topic, score, totalQuestions, correctAnswers, timeTaken, weakAreas = []) {
        return new Promise((resolve, reject) => {
            const { v4: uuidv4 } = require('uuid');
            const id = uuidv4();

            const sql = `
                INSERT INTO quiz_results (
                    id, set_id, topic, score, total_questions, 
                    correct_answers, time_taken_minutes, weak_areas
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const weakAreasJson = JSON.stringify(weakAreas);

            db.run(sql, [id, setId, topic, score, totalQuestions, correctAnswers, timeTaken, weakAreasJson], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ id, setId, topic, score });
            });
        });
    }

    /**
     * Log user interaction (query, document view, etc.)
     */
    async logInteraction(setId, interactionType, query = '', resultQuality = null) {
        return new Promise((resolve, reject) => {
            const { v4: uuidv4 } = require('uuid');
            const id = uuidv4();

            const sql = `
                INSERT INTO user_interactions (id, set_id, interaction_type, query, result_quality)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.run(sql, [id, setId, interactionType, query, resultQuality], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ id });
            });
        });
    }
}

module.exports = new ProgressAnalytics();

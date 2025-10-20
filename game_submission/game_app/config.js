/**
 * Configuration file for Maze of Choices game
 * 
 * IMPORTANT: For production, use environment variables or a secure backend.
 * This file is for demonstration purposes only.
 */

const CONFIG = {
    // Gemini API Configuration
    // Get your API key from: https://makersuite.google.com/app/apikey
    GEMINI_API_KEY: '', // Add your Gemini API key here
    
    // Quiz Generation Settings
    QUIZ: {
        USE_AI_GENERATION: false, // Set to true to use AI-generated questions
        DEFAULT_TOPIC: 'sex education and mental health for teenagers',
        QUESTION_COUNT: 12,
        FALLBACK_TO_CURATED: true // Use curated questions if AI fails
    },
    
    // API Endpoints
    API: {
        GEMINI_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
    },
    
    // Content Moderation Settings
    MODERATION: {
        ENABLED: true,
        STRICT_MODE: true // Extra filtering for educational content
    }
};

// Validate configuration on load
(function validateConfig() {
    if (CONFIG.QUIZ.USE_AI_GENERATION && !CONFIG.GEMINI_API_KEY) {
        console.warn('⚠️ AI quiz generation is enabled but GEMINI_API_KEY is not set!');
        console.warn('📝 Get your API key from: https://makersuite.google.com/app/apikey');
        console.warn('🔄 Falling back to curated questions...');
        CONFIG.QUIZ.USE_AI_GENERATION = false;
    }
})();

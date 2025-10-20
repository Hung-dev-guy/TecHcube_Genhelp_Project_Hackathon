/**
 * GenHelp Game Configuration
 *
 * Central configuration file for the GenHelp sexual health education game.
 * Configure API keys, game settings, and behavior here.
 */

const CONFIG = {
    // ===== API KEYS =====
    /**
     * Google Gemini API Key for AI-generated quiz questions
     * Get your key at: https://aistudio.google.com/app/apikey
     */
    GEMINI_API_KEY: "YOUR_API_KEY_HERE",

    // ===== API ENDPOINTS =====
    API: {
        GEMINI_ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    },

    // ===== QUIZ CONFIGURATION =====
    QUIZ: {
        /**
         * Enable AI-generated questions using Gemini API
         * Set to false to use only curated questions
         */
        USE_AI_GENERATION: false,
        DEFAULT_TOPIC: "sexual health education for teenagers",
        QUESTION_COUNT: 24,
        FALLBACK_TO_CURATED: true,
        WRONG_POINTS: -5
    },

    // ===== CONTENT MODERATION =====
    MODERATION: {
        /**
         * Enable content filtering for AI-generated questions
         */
        ENABLED: true,

        /**
         * Maximum attempts to generate appropriate content
         */
        MAX_RETRIES: 3
    },

    // ===== GAME SETTINGS =====
    GAME: {
        /**
         * Maze dimensions
         */
        MAZE_WIDTH: 15,
        MAZE_HEIGHT: 8,

        /**
         * Dice settings
         */
        DICE_MIN: 1,
        DICE_MAX: 6,

        /**
         * Minimum score (score never goes below this)
         */
        MIN_SCORE: 0,

        /**
         * Wheel of Fortune outcomes
         */
        WHEEL_OUTCOMES: [
            { label: "+25", points: 25, color: "#FFD700" },
            { label: "+15", points: 15, color: "#FFA500" },
            { label: "+10", points: 10, color: "#90EE90" },
            { label: "+5", points: 5, color: "#87CEEB" },
            { label: "SAFE", points: 0, color: "#DDA0DD" },
            { label: "-5", points: -5, color: "#FFC0CB" },
            { label: "-10", points: -10, color: "#FFB6C1" },
            { label: "-15", points: -15, color: "#FF6B6B" }
        ]
    },

    // ===== AUDIO SETTINGS =====
    AUDIO: {
        /**
         * Enable sound effects
         */
        ENABLED: true,

        /**
         * Global volume (0.0 to 1.0)
         */
        VOLUME: 0.3
    },

    // ===== LEADERBOARD SETTINGS =====
    LEADERBOARD: {
        /**
         * Maximum number of entries to display
         */
        MAX_ENTRIES: 20,

        /**
         * Storage key for localStorage
         */
        STORAGE_KEY: "genhelp_leaderboard"
    }
};

// Freeze the config object to prevent accidental modifications
Object.freeze(CONFIG);

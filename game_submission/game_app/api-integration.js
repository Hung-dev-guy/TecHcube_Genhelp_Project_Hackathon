// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// ===== API UTILITIES =====
const API = {
    // Helper to make API calls
    async call(endpoint, options = {}) {
        const token = localStorage.getItem('authToken');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ detail: 'Request failed' }));
                throw new Error(error.detail || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    },

    // Auth endpoints
    async register(username, email, password) {
        return this.call('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
    },

    async login(username, password) {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await this.call('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });

        if (response.access_token) {
            localStorage.setItem('authToken', response.access_token);
            localStorage.setItem('username', username);
        }

        return response;
    },

    async getMe() {
        return this.call('/auth/me');
    },

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('currentSessionId');
    },

    // Game endpoints
    async startGameSession(playerName) {
        const response = await this.call('/game/start', {
            method: 'POST',
            body: JSON.stringify({ player_name: playerName })
        });
        
        if (response.session_id) {
            localStorage.setItem('currentSessionId', response.session_id);
        }
        
        return response;
    },

    async updateGameSession(sessionId, data) {
        return this.call(`/game/${sessionId}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },

    async completeGameSession(sessionId, finalData) {
        return this.call(`/game/${sessionId}/complete`, {
            method: 'POST',
            body: JSON.stringify(finalData)
        });
    },

    // Leaderboard endpoints
    async getLeaderboard(limit = 20) {
        return this.call(`/leaderboard/?limit=${limit}`);
    },

    async clearLeaderboard() {
        return this.call('/leaderboard/clear', { method: 'DELETE' });
    },

    // Quiz endpoints
    async getQuizQuestions() {
        return this.call('/quiz/questions');
    }
};

// ===== MODIFIED GAME STATE =====
const gameState = {
    currentScreen: 'menu',
    player: { row: 0, col: 0, score: 0, name: 'Anonymous' },
    timerStart: 0,
    timerInterval: null,
    gameActive: false,
    questionUsed: new Set(),
    currentQuestion: null,
    sessionId: null,  // NEW: Track current session
    quizQuestions: [] // NEW: Questions from API
};

// ===== LOAD QUIZ QUESTIONS FROM API =====
async function loadQuizQuestions() {
    try {
        const response = await API.getQuizQuestions();
        gameState.quizQuestions = response.questions;
        console.log(`Loaded ${gameState.quizQuestions.length} questions from API`);
    } catch (error) {
        console.error('Failed to load quiz questions from API, using local fallback');
        // Fallback to local questions if API fails
        gameState.quizQuestions = quizQuestions;
    }
}

// ===== LOAD LEADERBOARD FROM API =====
async function loadLeaderboard() {
    try {
        const leaderboard = await API.getLeaderboard(20);
        const tbody = document.getElementById('leaderboard-body');

        if (leaderboard.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="no-data">No scores yet. Be the first to play!</td></tr>';
            return;
        }

        tbody.innerHTML = '';

        leaderboard.forEach((entry) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.rank}</td>
                <td>${entry.player_name}</td>
                <td>${entry.score}</td>
                <td>${entry.time}</td>
                <td>${entry.date}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to load leaderboard from API:', error);
        document.getElementById('leaderboard-body').innerHTML = 
            '<tr><td colspan="5" class="no-data">Failed to load leaderboard. Please try again.</td></tr>';
    }
}

// ===== MODIFIED START GAME =====
async function startGame() {
    try {
        // Start game session via API
        const response = await API.startGameSession(gameState.player.name);
        gameState.sessionId = response.session_id;
        console.log(`Game session started: ${gameState.sessionId}`);
    } catch (error) {
        console.error('Failed to start game session:', error);
        // Continue with offline mode
        gameState.sessionId = null;
    }

    // Reset game state
    gameState.player.row = 0;
    gameState.player.col = 0;
    gameState.player.score = 0;
    gameState.questionUsed = new Set();
    gameState.gameActive = true;

    // Reset timer
    gameState.timerStart = Date.now();
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(updateTimer, 1000);

    // Update UI
    document.getElementById('current-player-name').textContent = gameState.player.name;
    updateScore();
    buildMaze();
    showScreen('game');
}

// ===== MODIFIED END GAME =====
async function endGame() {
    gameState.gameActive = false;
    clearInterval(gameState.timerInterval);

    // Play goal sound
    sounds.goal();

    const elapsed = Math.floor((Date.now() - gameState.timerStart) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Calculate final score: correctAnswers * 100 - timeInSeconds
    const finalScore = (gameState.player.score * 100) - elapsed;

    // Update result screen
    document.getElementById('result-player-name').textContent = gameState.player.name;
    document.getElementById('final-score').textContent = gameState.player.score;
    document.getElementById('final-time').textContent = timeString;
    document.getElementById('total-score').textContent = finalScore;

    // Complete game session via API
    if (gameState.sessionId) {
        try {
            await API.completeGameSession(gameState.sessionId, {
                score: gameState.player.score,
                time_seconds: elapsed,
                final_score: finalScore,
                completed: true
            });
            console.log('Game session completed successfully');
            
            // Show new record badge (API adds to leaderboard automatically)
            document.getElementById('new-record-badge').classList.add('show');
        } catch (error) {
            console.error('Failed to complete game session:', error);
            // Fallback to local storage
            saveScoreLocal({
                name: gameState.player.name,
                score: finalScore,
                correctAnswers: gameState.player.score,
                time: timeString,
                timeInSeconds: elapsed,
                date: new Date().toLocaleDateString()
            });
        }
    } else {
        // Offline mode - use local storage
        const isNewRecord = saveScoreLocal({
            name: gameState.player.name,
            score: finalScore,
            correctAnswers: gameState.player.score,
            time: timeString,
            timeInSeconds: elapsed,
            date: new Date().toLocaleDateString()
        });

        const badge = document.getElementById('new-record-badge');
        if (isNewRecord) {
            badge.classList.add('show');
        } else {
            badge.classList.remove('show');
        }
    }

    setTimeout(() => {
        showScreen('result');
    }, 1000);
}

// ===== LOCAL STORAGE FALLBACK (for offline mode) =====
function saveScoreLocal(scoreData) {
    let leaderboard = JSON.parse(localStorage.getItem('mazeLeaderboard') || '[]');
    leaderboard.push(scoreData);
    leaderboard.sort((a, b) => b.score - a.score);
    const isNewRecord = leaderboard.indexOf(scoreData) < 10;
    leaderboard = leaderboard.slice(0, 50);
    localStorage.setItem('mazeLeaderboard', JSON.stringify(leaderboard));
    return isNewRecord;
}

// ===== CLEAR LEADERBOARD (API + Local) =====
document.getElementById('clear-leaderboard-button').addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear the leaderboard? This cannot be undone.')) {
        try {
            await API.clearLeaderboard();
            console.log('Leaderboard cleared via API');
        } catch (error) {
            console.error('Failed to clear API leaderboard:', error);
        }
        
        // Also clear local
        localStorage.removeItem('mazeLeaderboard');
        loadLeaderboard();
    }
});

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', async () => {
    // Load quiz questions from API
    await loadQuizQuestions();
    
    // Initialize screen
    showScreen('menu');
});

// Export for use in original script.js
window.gameAPI = API;
window.gameState = gameState;
window.loadLeaderboard = loadLeaderboard;
window.startGame = startGame;

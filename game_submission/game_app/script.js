// ===== GAME STATE =====
const gameState = {
    currentScreen: 'menu',
    player: { row: 0, col: 0, score: 0, name: 'Anonymous' },
    timerStart: 0,
    timerInterval: null,
    gameActive: false,
    questionUsed: new Set(),
    currentQuestion: null,
    quizQuestions: [] // Will be loaded from AI or fallback
};

// ===== LOAD QUIZ QUESTIONS =====
async function loadQuizQuestions() {
    try {
        if (CONFIG.QUIZ.USE_AI_GENERATION) {
            console.log('🤖 Loading AI-generated quiz questions...');
            gameState.quizQuestions = await geminiQuizService.generateQuestions(
                CONFIG.QUIZ.DEFAULT_TOPIC,
                CONFIG.QUIZ.QUESTION_COUNT
            );
            console.log(`✅ Loaded ${gameState.quizQuestions.length} AI-generated questions`);
        } else {
            console.log('📚 Using curated quiz questions');
            gameState.quizQuestions = geminiQuizService.getFallbackQuestions(CONFIG.QUIZ.QUESTION_COUNT);
        }
    } catch (error) {
        console.error('❌ Error loading quiz questions:', error);
        console.log('🔄 Falling back to curated questions');
        gameState.quizQuestions = geminiQuizService.getFallbackQuestions(CONFIG.QUIZ.QUESTION_COUNT);
    }
}

// ===== MAZE LAYOUT (10x7 grid) =====
// 0 = wall, 1 = path, 2 = quiz tile, 3 = goal
const mazeLayout = [
    [1, 1, 2, 0, 1, 0, 1, 2, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 0, 2, 0, 0, 2, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
    [2, 1, 1, 0, 2, 2, 1, 1, 1, 2],
    [1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 2, 1, 1, 1, 1, 1, 2, 1, 3]
];

// Note: Quiz questions are now loaded dynamically
// See loadQuizQuestions() function and gameState.quizQuestions

// ===== SOUND EFFECTS (Using Web Audio API) =====
const sounds = {
    correct: () => playCorrectSound(),
    wrong: () => playWrongSound(),
    move: () => playBeep(400, 0.05, 'sine', 0.1),
    goal: () => playGoalSound()
};

function playBeep(frequency, duration, type = 'sine', volume = 0.3) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playCorrectSound() {
    // Play a positive ascending chime
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

        notes.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine';

            const startTime = audioContext.currentTime + (index * 0.1);
            gainNode.gain.setValueAtTime(0.2, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.2);
        });
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playWrongSound() {
    // Play a negative descending buzz
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.3);
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playGoalSound() {
    // Play a celebratory ascending arpeggio
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'triangle';

            const startTime = audioContext.currentTime + (index * 0.08);
            gainNode.gain.setValueAtTime(0.25, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });

        // Add a final "ding"
        const finalOscillator = audioContext.createOscillator();
        const finalGain = audioContext.createGain();
        finalOscillator.connect(finalGain);
        finalGain.connect(audioContext.destination);
        finalOscillator.frequency.value = 1318.51; // E6
        finalOscillator.type = 'sine';
        const finalTime = audioContext.currentTime + 0.32;
        finalGain.gain.setValueAtTime(0.3, finalTime);
        finalGain.gain.exponentialRampToValueAtTime(0.01, finalTime + 0.5);
        finalOscillator.start(finalTime);
        finalOscillator.stop(finalTime + 0.5);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// ===== SCREEN MANAGEMENT =====
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`${screenName}-screen`).classList.add('active');
    gameState.currentScreen = screenName;
}

// ===== MENU HANDLERS =====
document.getElementById('start-button').addEventListener('click', () => showScreen('name-input'));
document.getElementById('instructions-button').addEventListener('click', () => showScreen('instructions'));
document.getElementById('leaderboard-button').addEventListener('click', () => {
    loadLeaderboard();
    showScreen('leaderboard');
});
document.getElementById('back-to-menu').addEventListener('click', () => showScreen('menu'));
document.getElementById('back-to-menu-2').addEventListener('click', () => showScreen('menu'));
document.getElementById('back-to-menu-3').addEventListener('click', () => showScreen('menu'));
document.getElementById('play-again-button').addEventListener('click', () => showScreen('name-input'));
document.getElementById('view-leaderboard-button').addEventListener('click', () => {
    loadLeaderboard();
    showScreen('leaderboard');
});

// ===== NAME INPUT =====
document.getElementById('start-game-button').addEventListener('click', () => {
    const nameInput = document.getElementById('player-name-input');
    const name = nameInput.value.trim();

    if (name.length === 0) {
        alert('Please enter your name!');
        return;
    }

    gameState.player.name = name;
    nameInput.value = '';
    startGame();
});

document.getElementById('cancel-name-button').addEventListener('click', () => {
    document.getElementById('player-name-input').value = '';
    showScreen('menu');
});

// Allow Enter key to start game
document.getElementById('player-name-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('start-game-button').click();
    }
});

// ===== GAME INITIALIZATION =====
function startGame() {
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

// ===== MAZE RENDERING =====
function buildMaze() {
    const mazeContainer = document.getElementById('maze-container');
    mazeContainer.innerHTML = '';

    for (let row = 0; row < mazeLayout.length; row++) {
        for (let col = 0; col < mazeLayout[row].length; col++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.row = row;
            tile.dataset.col = col;

            const tileType = mazeLayout[row][col];
            if (tileType === 0) tile.classList.add('wall');
            else if (tileType === 1) tile.classList.add('path');
            else if (tileType === 2) tile.classList.add('quiz');
            else if (tileType === 3) tile.classList.add('goal');

            mazeContainer.appendChild(tile);
        }
    }

    renderPlayer();
}

function renderPlayer() {
    // Remove existing player
    document.querySelectorAll('.player').forEach(p => p.remove());

    // Add player
    const playerTile = getTileElement(gameState.player.row, gameState.player.col);
    if (playerTile) {
        const playerElement = document.createElement('div');
        playerElement.className = 'player player1';
        playerTile.appendChild(playerElement);
    }
}

function getTileElement(row, col) {
    return document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
}

// ===== PLAYER MOVEMENT =====
document.addEventListener('keydown', (e) => {
    if (!gameState.gameActive || gameState.currentScreen !== 'game') return;

    const key = e.key.toLowerCase();

    // WASD controls
    if (key === 'w' || key === 'arrowup') movePlayer(-1, 0);
    else if (key === 's' || key === 'arrowdown') movePlayer(1, 0);
    else if (key === 'a' || key === 'arrowleft') movePlayer(0, -1);
    else if (key === 'd' || key === 'arrowright') movePlayer(0, 1);
});

function movePlayer(rowDelta, colDelta) {
    const newRow = gameState.player.row + rowDelta;
    const newCol = gameState.player.col + colDelta;

    // Check bounds
    if (newRow < 0 || newRow >= mazeLayout.length ||
        newCol < 0 || newCol >= mazeLayout[0].length) {
        return;
    }

    // Check if tile is walkable
    const tileType = mazeLayout[newRow][newCol];
    if (tileType === 0) return; // Wall

    // Move player
    gameState.player.row = newRow;
    gameState.player.col = newCol;
    sounds.move();
    renderPlayer();

    // Check tile type
    if (tileType === 2) {
        // Quiz tile
        showQuiz();
    } else if (tileType === 3) {
        // Goal tile - player wins!
        endGame();
    }
}

// ===== QUIZ SYSTEM =====
function showQuiz() {
    gameState.gameActive = false;

    // Get random unused question
    let questionIndex;
    const availableQuestions = quizQuestions.filter((_, i) => !gameState.questionUsed.has(i));

    if (availableQuestions.length === 0) {
        // Reset if all questions used - player has seen all 12 questions!
        gameState.questionUsed.clear();
        console.log('All 12 questions have been used. Resetting question pool.');
    }

    do {
        questionIndex = Math.floor(Math.random() * gameState.quizQuestions.length);
    } while (gameState.questionUsed.has(questionIndex));

    gameState.questionUsed.add(questionIndex);
    const question = gameState.quizQuestions[questionIndex];
    gameState.currentQuestion = question; // Store current question

    console.log(`Question ${gameState.questionUsed.size}/12: "${question.question}"`)

    // Display quiz
    document.getElementById('question-text').textContent = question.question;

    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => checkAnswer(index, question.correct, question.explanation);
        answersContainer.appendChild(button);
    });

    document.getElementById('feedback').classList.remove('show', 'correct', 'wrong');
    document.getElementById('quiz-modal').classList.add('active');
}

function checkAnswer(selected, correct, explanation) {
    const feedback = document.getElementById('feedback');
    const buttons = document.querySelectorAll('.answer-btn');

    // Disable all buttons
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === correct) btn.classList.add('correct');
        else if (index === selected) btn.classList.add('wrong');
    });

    if (selected === correct) {
        // Correct answer
        feedback.innerHTML = `<strong>✓ Correct!</strong><br>${explanation}<br><em>Moving forward...</em>`;
        feedback.className = 'feedback show correct';
        gameState.player.score++;
        updateScore();
        sounds.correct();

        setTimeout(() => {
            movePlayerAfterQuiz(1); // Move forward
        }, 2500);
    } else {
        // Wrong answer
        feedback.innerHTML = `<strong>✗ Wrong!</strong><br>${explanation}<br><em>Moving back...</em>`;
        feedback.className = 'feedback show wrong';
        sounds.wrong();

        setTimeout(() => {
            movePlayerAfterQuiz(-1); // Move back
        }, 2500);
    }
}

function movePlayerAfterQuiz(direction) {
    // Try to move in the direction toward/away from goal
    if (direction === 1) {
        // Try right, then down
        if (gameState.player.col + 1 < mazeLayout[0].length &&
            mazeLayout[gameState.player.row][gameState.player.col + 1] !== 0) {
            gameState.player.col++;
        } else if (gameState.player.row + 1 < mazeLayout.length &&
                   mazeLayout[gameState.player.row + 1][gameState.player.col] !== 0) {
            gameState.player.row++;
        }
    } else {
        // Try left, then up
        if (gameState.player.col - 1 >= 0 &&
            mazeLayout[gameState.player.row][gameState.player.col - 1] !== 0) {
            gameState.player.col--;
        } else if (gameState.player.row - 1 >= 0 &&
                   mazeLayout[gameState.player.row - 1][gameState.player.col] !== 0) {
            gameState.player.row--;
        }
    }

    renderPlayer();
    document.getElementById('quiz-modal').classList.remove('active');
    gameState.gameActive = true;

    // Check if landed on goal
    if (mazeLayout[gameState.player.row][gameState.player.col] === 3) {
        endGame();
    }
}

// ===== TIMER =====
function updateTimer() {
    const elapsed = Math.floor((Date.now() - gameState.timerStart) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('timer').textContent =
        `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ===== SCORE UPDATE =====
function updateScore() {
    document.getElementById('player-score').textContent = `Score: ${gameState.player.score}`;
}

// ===== GAME END =====
function endGame() {
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

    // Save to leaderboard
    const isNewRecord = saveScore({
        name: gameState.player.name,
        score: finalScore,
        correctAnswers: gameState.player.score,
        time: timeString,
        timeInSeconds: elapsed,
        date: new Date().toLocaleDateString()
    });

    // Show new record badge if applicable
    const badge = document.getElementById('new-record-badge');
    if (isNewRecord) {
        badge.classList.add('show');
    } else {
        badge.classList.remove('show');
    }

    setTimeout(() => {
        showScreen('result');
    }, 1000);
}

// ===== LEADERBOARD MANAGEMENT =====
function saveScore(scoreData) {
    // Get existing leaderboard from localStorage
    let leaderboard = JSON.parse(localStorage.getItem('mazeLeaderboard') || '[]');

    // Add new score
    leaderboard.push(scoreData);

    // Sort by score (descending)
    leaderboard.sort((a, b) => b.score - a.score);

    // Check if it's a top score (top 10)
    const isNewRecord = leaderboard.indexOf(scoreData) < 10;

    // Keep only top 50 scores
    leaderboard = leaderboard.slice(0, 50);

    // Save back to localStorage
    localStorage.setItem('mazeLeaderboard', JSON.stringify(leaderboard));

    return isNewRecord;
}

function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('mazeLeaderboard') || '[]');
    const tbody = document.getElementById('leaderboard-body');

    if (leaderboard.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">No scores yet. Be the first to play!</td></tr>';
        return;
    }

    tbody.innerHTML = '';

    // Show top 20
    leaderboard.slice(0, 20).forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
            <td>${entry.time}</td>
            <td>${entry.date}</td>
        `;
        tbody.appendChild(row);
    });
}

// Clear leaderboard
document.getElementById('clear-leaderboard-button').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the leaderboard? This cannot be undone.')) {
        localStorage.removeItem('mazeLeaderboard');
        loadLeaderboard();
    }
});

// ===== INITIALIZE =====
// Load quiz questions on page load
loadQuizQuestions().then(() => {
    console.log('✅ Game ready!');
    showScreen('menu');
}).catch(error => {
    console.error('❌ Failed to initialize game:', error);
    showScreen('menu'); // Still show menu with fallback questions
});

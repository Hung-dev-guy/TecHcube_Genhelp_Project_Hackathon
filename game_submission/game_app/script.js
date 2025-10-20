// ===== GAME STATE =====
const gameState = {
    currentScreen: 'menu',
    player: { row: 0, col: 0, score: 0, name: 'Anonymous', character: 'player1' },
    timerStart: 0,
    timerInterval: null,
    gameActive: false,
    questionUsed: new Set(),
    currentQuestion: null,
    quizQuestions: [], // Will be loaded from AI or fallback
    stepsRemaining: 0,
    isMoving: false,
    moveQueue: [],
    visitedTiles: new Set() // Track visited tiles to avoid backtracking
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
    
    // Always ensure we have questions
    if (!gameState.quizQuestions || gameState.quizQuestions.length === 0) {
        console.warn('⚠️ No quiz questions loaded, loading fallback');
        gameState.quizQuestions = geminiQuizService.getFallbackQuestions(12);
    }
    
    console.log(`📚 Total questions loaded: ${gameState.quizQuestions.length}`);
}

// ===== MAZE LAYOUT (15x8 grid) =====
// 0 = wall, 1 = path, 2 = quiz tile, 3 = goal, 4 = event tile (wheel of fortune)
// BEAUTIFUL SNAKE PATTERN - Balanced: 7 quiz tiles, 3 spin tiles
const mazeLayout = [
    // Row 0: Start → → → → → → → → → → → → → (to column 14)
    [1, 1, 2, 1, 1, 4, 1, 1, 2, 1, 1, 1, 2, 1, 1],
    // Row 1: Vertical connector at column 14
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    // Row 2: ← ← ← ← ← ← ← ← ← ← ← ← ← ← (from column 14 to 0)
    [1, 1, 1, 2, 1, 1, 4, 1, 1, 2, 1, 1, 1, 4, 1],
    // Row 3: Vertical connector at column 0
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // Row 4: → → → → → → → → → → → → → → (from column 0 to 14)
    [1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1],
    // Row 5: Vertical connector and path to GOAL
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
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
    showScreen('character-selection');
});

document.getElementById('cancel-name-button').addEventListener('click', () => {
    document.getElementById('player-name-input').value = '';
    showScreen('menu');
});

// ===== CHARACTER SELECTION =====
document.querySelectorAll('.character-option').forEach(option => {
    option.addEventListener('click', () => {
        // Remove selected class from all options
        document.querySelectorAll('.character-option').forEach(o => o.classList.remove('selected'));
        // Add selected class to the clicked option
        option.classList.add('selected');
        // Store the selected character
        gameState.player.character = option.dataset.character;
        // Enable the confirm button
        document.getElementById('confirm-character-button').disabled = false;
    });
});

document.getElementById('confirm-character-button').addEventListener('click', async () => {
    // Ensure quiz questions are loaded
    if (!gameState.quizQuestions || gameState.quizQuestions.length === 0) {
        console.log('⏳ Loading quiz questions...');
        const confirmButton = document.getElementById('confirm-character-button');
        confirmButton.disabled = true;
        confirmButton.textContent = 'Loading...';
        
        await loadQuizQuestions();
        
        confirmButton.disabled = false;
        confirmButton.textContent = 'Start Game';
    }

    startGame();
});

document.getElementById('back-to-name-button').addEventListener('click', () => {
    showScreen('name-input');
});


// Allow Enter key to start game
document.getElementById('player-name-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('start-game-button').click();
    }
});

// ===== IN-GAME NAVIGATION =====
document.getElementById('view-leaderboard-ingame').addEventListener('click', () => {
    if (confirm('Viewing leaderboard will pause the game. Continue?')) {
        gameState.gameActive = false;
        if (gameState.timerInterval) clearInterval(gameState.timerInterval);
        loadLeaderboard();
        showScreen('leaderboard');
    }
});

document.getElementById('back-to-menu-ingame').addEventListener('click', () => {
    if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
        gameState.gameActive = false;
        if (gameState.timerInterval) clearInterval(gameState.timerInterval);
        showScreen('menu');
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
    gameState.stepsRemaining = 0;
    gameState.isMoving = false;
    gameState.moveQueue = [];
    gameState.visitedTiles = new Set();
    gameState.visitedTiles.add('0,0'); // Mark starting position as visited

    // Reset timer
    gameState.timerStart = Date.now();
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(updateTimer, 1000);

    // Update UI
    document.getElementById('current-player-name').textContent = gameState.player.name;
    updateScore();
    updateDiceUI();
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
            else if (tileType === 4) tile.classList.add('event');

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
        playerElement.className = `player ${gameState.player.character}`;
        playerTile.appendChild(playerElement);
    }
}

function getTileElement(row, col) {
    return document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
}

// ===== DICE SYSTEM =====
function updateDiceUI() {
    const rollButton = document.getElementById('roll-dice-button');
    const stepsDisplay = document.getElementById('steps-remaining');
    
    if (gameState.stepsRemaining > 0) {
        stepsDisplay.textContent = `Steps remaining: ${gameState.stepsRemaining}`;
        rollButton.disabled = true;
    } else {
        stepsDisplay.textContent = '';
        rollButton.disabled = !gameState.gameActive;
    }
}

function rollDice() {
    if (!gameState.gameActive || gameState.stepsRemaining > 0 || gameState.isMoving) {
        return;
    }

    // Roll the dice (1-6)
    const diceValue = Math.floor(Math.random() * 6) + 1;
    
    // Update dice visual
    const diceElement = document.getElementById('dice');
    const diceResult = document.getElementById('dice-result');
    
    // Animate dice rolling
    diceElement.classList.add('rolling');
    sounds.move();
    
    // Show random numbers during animation
    let animationCount = 0;
    const animationInterval = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 6) + 1;
        diceResult.textContent = randomNum;
        diceElement.className = `dice dice-${randomNum}`;
        animationCount++;
        
        if (animationCount >= 10) {
            clearInterval(animationInterval);
            // Show final result
            diceResult.textContent = diceValue;
            diceElement.className = `dice dice-${diceValue}`;
            diceElement.classList.remove('rolling');
            
            // Set steps and start moving
            gameState.stepsRemaining = diceValue;
            updateDiceUI();
            movePlayerAutomatically();
        }
    }, 50);
}

// Add dice roll button event listener
document.getElementById('roll-dice-button').addEventListener('click', rollDice);

// ===== AUTOMATIC MOVEMENT =====
function movePlayerAutomatically() {
    if (gameState.stepsRemaining <= 0 || !gameState.gameActive || gameState.isMoving) {
        return;
    }

    gameState.isMoving = true;

    // Find the next valid move (prefer unvisited tiles to follow the linear path)
    const directions = [
        { row: 0, col: 1, name: 'right' },  // Right (primary direction)
        { row: 1, col: 0, name: 'down' },   // Down
        { row: 0, col: -1, name: 'left' },  // Left
        { row: -1, col: 0, name: 'up' }     // Up
    ];

    let moved = false;
    let bestMove = null;
    let bestMoveIsUnvisited = false;

    // First, try to find an unvisited valid tile
    for (const dir of directions) {
        const newRow = gameState.player.row + dir.row;
        const newCol = gameState.player.col + dir.col;
        const tileKey = `${newRow},${newCol}`;

        // Check if valid move
        if (newRow >= 0 && newRow < mazeLayout.length &&
            newCol >= 0 && newCol < mazeLayout[0].length &&
            mazeLayout[newRow][newCol] !== 0) {
            
            const isUnvisited = !gameState.visitedTiles.has(tileKey);
            
            // Prefer unvisited tiles
            if (!bestMove || (isUnvisited && !bestMoveIsUnvisited)) {
                bestMove = { row: newRow, col: newCol, tileKey: tileKey };
                bestMoveIsUnvisited = isUnvisited;
            }
        }
    }

    if (bestMove) {
        // Move player to best tile
        gameState.player.row = bestMove.row;
        gameState.player.col = bestMove.col;
        gameState.visitedTiles.add(bestMove.tileKey);
        gameState.stepsRemaining--;
        updateDiceUI();
        sounds.move();
        renderPlayer();
        moved = true;

        // Check tile type
        const tileType = mazeLayout[bestMove.row][bestMove.col];
        
        // Add delay before continuing
        setTimeout(() => {
            gameState.isMoving = false;
            
            if (tileType === 2) {
                // Quiz tile - stop moving and show quiz
                gameState.stepsRemaining = 0;
                updateDiceUI();
                setTimeout(() => showQuiz(), 300); // Small delay before showing quiz
            } else if (tileType === 4) {
                // Event tile - stop moving and show wheel of fortune
                gameState.stepsRemaining = 0;
                updateDiceUI();
                setTimeout(() => showWheelOfFortune(), 300);
            } else if (tileType === 3) {
                // Goal tile - player wins!
                gameState.stepsRemaining = 0;
                updateDiceUI();
                endGame();
            } else if (gameState.stepsRemaining > 0) {
                // Continue moving after delay
                setTimeout(() => movePlayerAutomatically(), 200);
            } else {
                updateDiceUI();
            }
        }, 400); // Increased delay to see each movement
    }

    if (!moved) {
        // No valid move - stop
        gameState.stepsRemaining = 0;
        gameState.isMoving = false;
        updateDiceUI();
    }
}

// ===== PLAYER MOVEMENT (DISABLED - Now using dice) =====
document.addEventListener('keydown', (e) => {
    // Keyboard controls disabled - using dice roll instead
    return;
    
    /* Original keyboard code commented out
    if (!gameState.gameActive || gameState.currentScreen !== 'game') return;

    const key = e.key.toLowerCase();

    // WASD controls
    if (key === 'w' || key === 'arrowup') movePlayer(-1, 0);
    else if (key === 's' || key === 'arrowdown') movePlayer(1, 0);
    else if (key === 'a' || key === 'arrowleft') movePlayer(0, -1);
    else if (key === 'd' || key === 'arrowright') movePlayer(0, 1);
    */
});

// ===== QUIZ SYSTEM =====
function showQuiz() {
    gameState.gameActive = false;

    // Check if quiz questions are loaded
    if (!gameState.quizQuestions || gameState.quizQuestions.length === 0) {
        console.error('No quiz questions available!');
        gameState.gameActive = true;
        return;
    }

    // Get random unused question
    let questionIndex;
    const availableQuestions = gameState.quizQuestions.filter((_, i) => !gameState.questionUsed.has(i));

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

    console.log(`Question ${gameState.questionUsed.size}/${gameState.quizQuestions.length}: "${question.question}"`)

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
        // Correct answer: +10 points
        feedback.innerHTML = `<strong>✓ Correct! +10 points</strong><br>${explanation}<br><em>Great job!</em>`;
        feedback.className = 'feedback show correct';
        gameState.player.score += 10;
        updateScore();
        sounds.correct();

        setTimeout(() => {
            closeQuizAndContinue();
        }, 2500);
    } else {
        // Wrong answer: -5 points
        feedback.innerHTML = `<strong>✗ Wrong! -5 points</strong><br>${explanation}<br><em>Better luck next time!</em>`;
        feedback.className = 'feedback show wrong';
        gameState.player.score -= 5;
        updateScore();
        sounds.wrong();

        setTimeout(() => {
            closeQuizAndContinue();
        }, 2500);
    }
}

function closeQuizAndContinue() {
    document.getElementById('quiz-modal').classList.remove('active');
    gameState.gameActive = true;
    updateDiceUI();
    
    // Check if landed on goal after quiz
    if (mazeLayout[gameState.player.row][gameState.player.col] === 3) {
        endGame();
    }
}

// ===== WHEEL OF FORTUNE SYSTEM =====
function showWheelOfFortune() {
    gameState.gameActive = false;
    
    const modal = document.getElementById('wheel-modal');
    const wheel = document.getElementById('fortune-wheel');
    const spinButton = document.getElementById('spin-wheel-button');
    const resultText = document.getElementById('wheel-result');
    
    modal.classList.add('active');
    resultText.textContent = 'Spin the wheel to see your fate!';
    resultText.className = 'wheel-result';
    spinButton.disabled = false;
    wheel.style.transform = 'rotate(0deg)';
}

function spinWheel() {
    const wheel = document.getElementById('fortune-wheel');
    const spinButton = document.getElementById('spin-wheel-button');
    const resultText = document.getElementById('wheel-result');

    spinButton.disabled = true;

    // Define wheel outcomes (8 segments) - balanced with 10-point quiz system
    const outcomes = [
        { points: 5, label: '+5', emoji: '😊', color: 'green' },
        { points: 0, label: '0', emoji: '🤔', color: 'blue' },
        { points: -3, label: '-3', emoji: '😢', color: 'red' },
        { points: 7, label: '+7', emoji: '🎉', color: 'green' },
        { points: -5, label: '-5', emoji: '😰', color: 'red' },
        { points: 10, label: '+10', emoji: '⭐', color: 'green' },
        { points: 3, label: '+3', emoji: '🎊', color: 'green' },
        { points: 5, label: '+5', emoji: '✨', color: 'green' }
    ];
    
    // Random spin (3-5 full rotations + random position)
    const randomIndex = Math.floor(Math.random() * outcomes.length);
    const segmentAngle = 360 / outcomes.length; // 45 degrees per segment
    const baseRotation = 360 * (3 + Math.random() * 2); // 3-5 full spins
    const targetRotation = baseRotation + (randomIndex * segmentAngle) + (segmentAngle / 2);
    
    // Animate wheel
    wheel.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
    wheel.style.transform = `rotate(${targetRotation}deg)`;
    
    // Play spin sound
    playSpinSound();
    
    setTimeout(() => {
        const outcome = outcomes[randomIndex];
        const oldScore = gameState.player.score;
        gameState.player.score += outcome.points;
        updateScore();

        // Show result with emoji
        let resultMessage = '';
        if (outcome.points > 0) {
            resultMessage = `${outcome.emoji} Lucky! ${outcome.label} points!`;
            resultText.className = 'wheel-result success';
            sounds.correct();
        } else if (outcome.points < 0) {
            resultMessage = `${outcome.emoji} Unlucky! ${outcome.label} points!`;
            resultText.className = 'wheel-result failure';
            sounds.wrong();
        } else {
            resultMessage = `${outcome.emoji} Safe! No change`;
            resultText.className = 'wheel-result safe';
            playBeep(500, 0.2, 'sine', 0.2);
        }

        resultText.textContent = resultMessage;

        setTimeout(() => {
            closeWheelAndContinue();
        }, 2500);
    }, 3200);
}

function closeWheelAndContinue() {
    document.getElementById('wheel-modal').classList.remove('active');
    gameState.gameActive = true;
    updateDiceUI();
    
    // Check if landed on goal after event
    if (mazeLayout[gameState.player.row][gameState.player.col] === 3) {
        endGame();
    }
}

function playSpinSound() {
    // Create a spinning sound effect
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 2);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 2.5);
    } catch (e) {
        console.log('Audio not supported');
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
    // Ensure score never goes below 0
    if (gameState.player.score < 0) {
        gameState.player.score = 0;
    }
    document.getElementById('player-score').textContent = `Score: ${gameState.player.score}`;
}

// ===== ACHIEVEMENT SYSTEM =====
function getAchievementByScore(score) {
    // Define achievement tiers based on score
    // Maximum realistic score: 7 quiz tiles × 10 points + 3 spins × ~5 = ~85 points
    // Perfect play: 70 points (all quizzes correct) + wheel bonus

    if (score >= 65) {
        return {
            title: "🏆 Sexual Health Expert",
            emoji: "🌟",
            message: "Outstanding! You have excellent knowledge of sexual health.",
            advice: "Your comprehensive understanding of sexual health is impressive! Continue being a reliable source of information for your peers. Consider volunteering for peer education programs to share your knowledge. Remember to keep learning as health information evolves."
        };
    } else if (score >= 50) {
        return {
            title: "🥇 Health Champion",
            emoji: "💪",
            message: "Great job! You have strong sexual health knowledge.",
            advice: "You're doing great! You have a solid foundation in sexual health education. To further improve, consider reading more about topics you found challenging. Stay curious and don't hesitate to ask healthcare professionals questions. Keep up the excellent work!"
        };
    } else if (score >= 35) {
        return {
            title: "🥈 Health Learner",
            emoji: "📚",
            message: "Good effort! You're building your sexual health knowledge.",
            advice: "You're on the right track! Continue learning about sexual health through trusted resources like Planned Parenthood, school counselors, or healthcare providers. Review the education section for more information. Remember, learning is a journey, and you're making progress!"
        };
    } else if (score >= 20) {
        return {
            title: "🥉 Health Beginner",
            emoji: "🌱",
            message: "Keep learning! Sexual health education is important.",
            advice: "Don't worry - everyone starts somewhere! Sexual health is an important topic to understand. We recommend reviewing the education materials in the game and talking to trusted adults like parents, teachers, or doctors. Play again to reinforce your learning!"
        };
    } else {
        return {
            title: "🎯 Health Explorer",
            emoji: "🔍",
            message: "Every expert was once a beginner. Keep exploring!",
            advice: "Thank you for taking the first step in learning about sexual health! This is a crucial topic that affects your wellbeing. Please take time to read through the educational resources, talk to healthcare professionals, and don't be afraid to ask questions. Knowledge is power - keep learning!"
        };
    }
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

    // Get achievement based on score
    const achievement = getAchievementByScore(gameState.player.score);

    // Calculate final score: score points × 10 - timeInSeconds
    const finalScore = (gameState.player.score * 10) - elapsed;

    // Update result screen
    document.getElementById('result-player-name').textContent = gameState.player.name;
    document.getElementById('final-score').textContent = gameState.player.score;
    document.getElementById('final-time').textContent = timeString;
    document.getElementById('total-score').textContent = finalScore;

    // Update achievement display
    const achievementSection = document.getElementById('achievement-section');
    if (achievementSection) {
        achievementSection.innerHTML = `
            <div class="achievement-card">
                <div class="achievement-emoji">${achievement.emoji}</div>
                <h3 class="achievement-title">${achievement.title}</h3>
                <p class="achievement-message">${achievement.message}</p>
                <div class="achievement-advice">
                    <strong>💡 Advice:</strong>
                    <p>${achievement.advice}</p>
                </div>
            </div>
        `;
    }

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

// ===== INFO BADGES FUNCTIONALITY =====
// Education badge - Show sexual health education
document.getElementById('education-badge').addEventListener('click', () => {
    document.getElementById('education-modal').classList.add('active');
});

// Close education modal
document.getElementById('close-education').addEventListener('click', () => {
    document.getElementById('education-modal').classList.remove('active');
});

document.getElementById('close-education-btn').addEventListener('click', () => {
    document.getElementById('education-modal').classList.remove('active');
});

// Leaderboard badge - Show leaderboard
document.getElementById('leaderboard-badge').addEventListener('click', () => {
    showScreen('leaderboard');
});

// Progress badge - Show info alert
document.getElementById('progress-badge').addEventListener('click', () => {
    alert('🎯 Track Your Progress\n\nYour scores are automatically saved to the leaderboard!\n\nEach game you play is recorded with:\n• Your score (based on correct answers)\n• Completion time\n• Date played\n\nTry to beat your best score and climb to the top!');
});

// Close education modal when clicking outside
document.getElementById('education-modal').addEventListener('click', (e) => {
    if (e.target.id === 'education-modal') {
        document.getElementById('education-modal').classList.remove('active');
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

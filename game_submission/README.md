<<<<<<< HEAD
# Maze of Choices - AI-Powered Educational Game

## Overview
"Maze of Choices" is an interactive, educational game designed to teach teenagers about sexual health, relationships, consent, and mental wellbeing. It uses a dynamic AI-powered quiz system (Google Gemini) to deliver engaging, judgment-free content. Players navigate a maze, answer questions, and learn important life skills in a fun, private environment.

This project is a **frontend-only application**. It runs entirely in the browser with no backend server required.
=======
# GenHelp - Sexual Health Education Game

## Overview
"GenHelp" is an interactive, educational game designed to teach teenagers about sexual health, relationships, consent, and mental wellbeing through engaging quiz-based gameplay. Players navigate a maze, answer questions, test their luck with the Wheel of Fortune, and learn important life skills in a fun, judgment-free environment.
>>>>>>> efe161c6fa359a8089ca76b451ad6262e3a3794f

## 🎮 How to Run the Game

1.  **Get a Gemini API Key**:
    *   Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create an API key.

2.  **Configure the Game**:
    *   In the `game_app/` directory, open `config.js`.
    *   Paste your API key into the `GEMINI_API_KEY` placeholder.
    ```javascript
    // game_app/config.js
    const CONFIG = {
        GEMINI_API_KEY: "YOUR_API_KEY_HERE",
        // ...
    };
    ```

3.  **Run a Local Server**:
    *   You need to run the game from a local web server for the AI features to work.
    *   Navigate to the `game_app/` directory in your terminal.
    *   Run the following command:
    ```bash
    # Requires Python 3
    python3 -m http.server
    ```

4.  **Play the Game**:
    *   Open your web browser and go to `http://localhost:8000`.
    *   Enter your name and start playing! Use WASD or Arrow keys to move.

## 🎯 Project Summary

### Theme
Sexual health education for teenagers (ages 13-18) focused on:
- Pregnancy prevention and contraception
- STI awareness and prevention
- Consent and healthy relationships
- Mental health and wellbeing
- Body autonomy and peer pressure

### Gameplay Mechanics
<<<<<<< HEAD
1. **Maze Navigation**: Move through a 10x7 grid maze.
2. **Quiz Encounters**: Step on quiz tiles to trigger a question from the AI.
3. **Reward/Penalty System**:
   - Correct answers → Move forward.
   - Wrong answers → Move back.
4. **Goal**: Reach the trophy tile as fast as possible.
5. **Scoring**: Based on correct answers and completion time.
6. **Leaderboard**: Tracks the top 20 scores using your browser's `localStorage`.

### Key Features
- 🤖 **AI-Powered Quiz Generation** using the Google Gemini API for a virtually endless supply of questions.
- 🔒 **Client-Side Content Moderation** to ensure AI-generated questions are safe and age-appropriate.
-  fallback to high-quality curated questions if the AI service is unavailable.
- Real-time timer and scoring system.
- Persistent leaderboard using `localStorage`.
- Colorful, cartoonish graphics suitable for teens.
- Interactive sound effects generated dynamically with the Web Audio API.
- Fully responsive design for both desktop and mobile.
=======
1. **Maze Navigation**: Automatic movement along a linear path through a 15x8 grid maze
2. **Dice Rolling**: Click "Roll Dice" to get a random number (1-6) and move that many steps
3. **Quiz Tiles**: Step on yellow glowing tiles to answer sexual health education questions
4. **Event Tiles**: Step on purple glowing tiles to spin the Wheel of Fortune for bonus/penalty points
5. **Reward/Penalty System**: 
   - Correct quiz answers → +10 points
   - Wrong quiz answers → -5 points
   - Wheel of Fortune → -15 to +25 points (or SAFE)
   - **Score never goes below 0**
6. **Goal**: Reach the trophy tile as fast as possible
7. **Scoring**: Based on correct answers, wheel outcomes, and completion time
8. **Leaderboard**: Track and compare performance
9. **In-Game Navigation**: Access menu or leaderboard anytime with navigation buttons

### Key Features
- 12 carefully crafted educational questions
- 🤖 **AI-Powered Quiz Generation** using Gemini API
- 🔒 **Age-appropriate content moderation** for AI questions
- 🎡 **Wheel of Fortune** - Spin for bonus/penalty points with beautiful animations
- 🛡️ **Score Protection** - Score never goes below 0
- Real-time timer and scoring system
- Persistent leaderboard (localStorage or MongoDB)
- Colorful, cartoonish graphics suitable for teens
- Interactive sound effects for engagement
- Fully responsive design (desktop and mobile)
- Educational explanations for each answer
>>>>>>> efe161c6fa359a8089ca76b451ad6262e3a3794f

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Structure and semantic markup.
- **CSS3** - Styling, animations, and responsive design (CSS Grid for the maze).
- **JavaScript (ES6+)** - All game logic, state management, and interactivity.

### AI Tools & Services
- **Google Gemini API**: The core of the dynamic content system. Generates educational quiz questions on the fly directly from the user's browser.
- **GitHub Copilot**: Utilized for code generation, debugging, and documentation throughout the development process.

<<<<<<< HEAD
### Web Libraries & APIs
- **Fetch API**: Used to communicate directly with the Google Gemini API from the frontend.
- **Web Audio API**: Generates all in-game sound effects dynamically without requiring audio files.
- **localStorage**: Provides client-side storage for the leaderboard, enabling persistence between game sessions.
=======
### AI Tools Utilized
- **GitHub Copilot** - Code generation and optimization
- **AI-assisted design** - Asset creation concepts
- Prompt engineering for educational content

### APIs & Storage
- **REST API** - Backend communication (NEW!)
- **Gemini API** - AI quiz generation (NEW!)
- **localStorage** - Offline fallback
- **Web Audio API** - Real-time sound synthesis
- **CSS Grid** - Maze layout system

## ✨ Game Features

### Gameplay
- ✅ Dice-based movement system with auto-pathfinding
- ✅ Linear path maze (no branching decisions)
- ✅ 24 curated sexual health education quiz questions with explanations
- ✅ 🤖 AI-generated dynamic quiz questions
- ✅ 🔒 Age-appropriate content filtering
- ✅ 🎡 Wheel of Fortune event tiles with 8 possible outcomes
- ✅ 🛡️ Score protection - never goes below 0
- ✅ Question randomization for replay value
- ✅ Real-time timer and score tracking
- ✅ In-game navigation buttons (menu/leaderboard access)
- ✅ Goal-oriented progression system

### Visuals
- ✅ Custom kawaii-style player characters (cute bunny design)
- ✅ Modern soft UI with pastel gradients
- ✅ Glassmorphism effects and glowing animations
- ✅ Colorful quiz tiles (yellow) and event tiles (purple)
- ✅ Beautiful Wheel of Fortune with gradient segments
- ✅ Goal icon with shine animation
- ✅ Textured floor and wall tiles
- ✅ Smooth dice rolling animations
- ✅ Responsive design with beautiful transitions
- ✅ Friendly, approachable art style for teenagers

### Audio
- ✅ Correct answer chime (ascending)
- ✅ Wrong answer buzz (descending)
- ✅ Victory celebration sound
- ✅ Movement feedback beeps
- ✅ Wheel spinning sound effect

### UI/UX
- ✅ Multiple screens (menu, game, results, leaderboard)
- ✅ Player name customization
- ✅ Character selection (male/female)
- ✅ Instructions screen with gameplay guide
- ✅ Dice rolling interface with visual feedback
- ✅ Wheel of Fortune modal with spinning animation
- ✅ In-game navigation buttons (🏆 leaderboard, 🏠 menu)
- ✅ Results summary with detailed stats
- ✅ Top 20 leaderboard display
- ✅ New record badge notification
- ✅ Modern pastel color scheme with soft shadows

### Educational Content
- ✅ Age-appropriate questions (13-18 years)
- ✅ Evidence-based information
- ✅ Comprehensive explanations
- ✅ Non-judgmental approach
- ✅ Topics: contraception, STIs, consent, mental health
>>>>>>> efe161c6fa359a8089ca76b451ad6262e3a3794f

## 📁 Project Structure

```
game_submission/
├── README.md                    # This file (project overview)
├── project_report.txt           # Detailed project documentation
├── youtube_link.txt             # Video demonstration link
├── game_app/                    # Frontend Application
│   ├── index.html              # Main game file
<<<<<<< HEAD
│   ├── style.css               # Styling (650+ lines)
│   ├── script.js               # Main game logic (600+ lines)
│   ├── gemini-quiz.js          # AI quiz generation and moderation service
│   ├── config.js               # API key configuration
=======
│   ├── script.js               # Game logic (850+ lines)
│   ├── api-integration.js      # API client
│   ├── gemini-quiz.js          # Quiz questions (24 Vietnamese questions)
│   ├── config.js               # Game configuration
│   ├── style.css               # Modern UI styling (1100+ lines)
│   ├── asset_preview.html      # Asset testing page
>>>>>>> efe161c6fa359a8089ca76b451ad6262e3a3794f
│   └── assets/
│       ├── README.md           # Asset documentation
│       ├── images/             # 6 SVG visual assets
│       │   ├── player1.svg
│       │   ├── player2.svg
│       │   ├── quiz.svg
│       │   ├── goal.svg
│       │   ├── tile_floor.svg
│       │   └── tile_wall.svg
│       └── sounds/
│           └── README.md       # Web Audio API guide
├── prompts/
│   ├── concept_prompts.txt
│   ├── code_generation_prompts.txt
│   ├── asset_generation_prompts.txt
│   └── refinement_prompts.txt
└── screenshots/
    ├── menu_screen.png
    ├── play_screen1.png
    ├── play_screen2.png
    ├── play_screen3.png
    └── results_screen.png
```

## 🎨 Asset Details

### Visual Assets (Total: < 15 KB)
- 6 SVG files (scalable, crisp at any size).
- Cartoonish, colorful, and student-friendly design.
- High contrast for better accessibility.

### Sound Effects
<<<<<<< HEAD
- 4 dynamic sounds generated using the Web Audio API.
- No external audio files are needed, ensuring instant loading and zero latency.
=======
- 5 dynamic sounds using Web Audio API
- No external files needed
- Instant loading, zero latency
- Cross-browser compatible
- Includes: correct/wrong answer, movement, victory, and wheel spinning sounds
>>>>>>> efe161c6fa359a8089ca76b451ad6262e3a3794f

## 🧪 Testing

### Browser Compatibility
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS/Android)

### Feature Testing
<<<<<<< HEAD
- ✅ Maze navigation and controls.
- ✅ AI quiz generation and display.
- ✅ Scoring, timer, and feedback system.
- ✅ Leaderboard persistence in `localStorage`.
- ✅ Dynamic sound effects.
- ✅ Responsive design on various screen sizes.
=======
- ✅ Dice rolling and auto-movement
- ✅ Linear path navigation
- ✅ Quiz system with feedback and randomization
- ✅ Wheel of Fortune with spinning animation
- ✅ Score protection (never below 0)
- ✅ Scoring and timer accuracy
- ✅ Leaderboard persistence (localStorage)
- ✅ In-game navigation buttons
- ✅ Sound effects (including wheel spin)
- ✅ Responsive design (desktop + mobile)
- ✅ Modern UI animations and transitions

## 📊 Game Statistics

- **Game Name**: GenHelp
- **Lines of Code**: ~2,200+ (HTML, CSS, JS, Python)
- **Curated Questions**: 24 comprehensive sexual health questions (Vietnamese)
- **AI-Generated Questions**: Unlimited via Gemini API
- **Maze Size**: 15×8 grid (120 tiles)
- **Path Length**: ~41 tiles in linear path
- **Quiz Tiles**: 5 positioned along the path
- **Event Tiles**: 6 Wheel of Fortune tiles
- **Wheel Outcomes**: 8 possible results (-15 to +25 points, plus SAFE)
- **Load Time**: < 1 second (all assets < 20 KB)
- **Platforms**: Web (desktop + mobile)
- **Backend Endpoints**: 12+ REST API endpoints
- **UI Design**: Modern soft UI with pastel gradients and glassmorphism
>>>>>>> efe161c6fa359a8089ca76b451ad6262e3a3794f

## 🏆 Educational Impact

### Learning Outcomes
Students will learn about:
1. ✅ Pregnancy prevention methods
2. ✅ STI transmission and protection
3. ✅ Consent and boundaries
4. ✅ Healthy relationship characteristics
5. ✅ Mental health awareness and resources
6. ✅ Body autonomy and resisting peer pressure

### Pedagogical Approach
- **Gamification**: Makes learning engaging and reduces stigma.
- **Immediate Feedback**: Reinforces correct knowledge with instant explanations.
- **Dynamic Content**: AI ensures a fresh experience with new questions each time.
- **Safe Environment**: A non-judgmental, private space to learn.
- **Repeatable**: Players can replay to improve their score and understanding.

## 🚀 Future Enhancements
<<<<<<< HEAD
1. **Difficulty Levels**: Easy, Medium, and Hard modes that adjust question complexity.
2. **Multiplayer Mode**: A competitive mode where two players race through the maze.
3. **Achievement System**: Award badges for milestones (e.g., "10 correct answers in a row").
4. **Localization**: Translate the game into multiple languages.
5. **Background Music**: Add an ambient soundtrack to enhance the experience.
=======

### Potential Additions
1. ~~**More Questions**: Expand to 50+ questions~~ ✅ **DONE** (AI generation)
2. ~~**Dynamic Content**: AI-generated questions~~ ✅ **DONE** (Gemini API)
3. ~~**Game Events**: Random events for excitement~~ ✅ **DONE** (Wheel of Fortune)
4. **Difficulty Levels**: Easy, Medium, Hard modes
5. **Multiplayer Mode**: Competitive or cooperative play
6. **Achievement System**: Badges for milestones
7. **Progress Tracking**: Save player progress (partially done with backend)
8. **Localization**: Multiple languages
9. **Professional Assets**: Commission artwork
10. **Background Music**: Ambient soundtracks
11. **Mobile App**: Native iOS/Android versions
12. **Analytics**: Track learning outcomes
13. **Admin Dashboard**: Manage questions and users
>>>>>>> efe161c6fa359a8089ca76b451ad6262e3a3794f

## 🙏 Acknowledgments
- The power of generative AI for creating dynamic educational content.
- The flexibility of the Web Audio API for file-less sound design.
- The efficiency of SVG for creating lightweight, scalable graphics.
- GitHub Copilot for accelerating development and providing solutions.

## 📄 License
Created for RMIT Hackathon 2025 - For Educational Purposes.

---

**🎮 Ready to Play!**  
<<<<<<< HEAD
Follow the instructions in the "How to Run the Game" section to start your educational journey!
=======
Open `game_app/index.html` and start your educational journey through GenHelp!

**🎡 Features:**
- Educational quiz questions about sexual health
- Wheel of Fortune for exciting gameplay
- Beautiful modern UI with smooth animations
- Score protection - never goes below 0!

**📱 Asset Preview:**  
Open `game_app/asset_preview.html` to view all visual assets and test sound effects!

>>>>>>> efe161c6fa359a8089ca76b451ad6262e3a3794f

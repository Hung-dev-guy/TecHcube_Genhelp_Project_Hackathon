# Maze of Choices - AI-Powered Educational Game

## Overview
"Maze of Choices" is an interactive, educational game designed to teach teenagers about sexual health, relationships, consent, and mental wellbeing. It uses a dynamic AI-powered quiz system (Google Gemini) to deliver engaging, judgment-free content. Players navigate a maze, answer questions, and learn important life skills in a fun, private environment.

This project is a **frontend-only application**. It runs entirely in the browser with no backend server required.

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

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Structure and semantic markup.
- **CSS3** - Styling, animations, and responsive design (CSS Grid for the maze).
- **JavaScript (ES6+)** - All game logic, state management, and interactivity.

### AI Tools & Services
- **Google Gemini API**: The core of the dynamic content system. Generates educational quiz questions on the fly directly from the user's browser.
- **GitHub Copilot**: Utilized for code generation, debugging, and documentation throughout the development process.

### Web Libraries & APIs
- **Fetch API**: Used to communicate directly with the Google Gemini API from the frontend.
- **Web Audio API**: Generates all in-game sound effects dynamically without requiring audio files.
- **localStorage**: Provides client-side storage for the leaderboard, enabling persistence between game sessions.

## 📁 Project Structure

```
game_submission/
├── README.md                    # This file (project overview)
├── project_report.txt           # Detailed project documentation
├── youtube_link.txt             # Video demonstration link
├── game_app/                    # Frontend Application
│   ├── index.html              # Main game file
│   ├── style.css               # Styling (650+ lines)
│   ├── script.js               # Main game logic (600+ lines)
│   ├── gemini-quiz.js          # AI quiz generation and moderation service
│   ├── config.js               # API key configuration
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
- 4 dynamic sounds generated using the Web Audio API.
- No external audio files are needed, ensuring instant loading and zero latency.

## 🧪 Testing

### Browser Compatibility
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS/Android)

### Feature Testing
- ✅ Maze navigation and controls.
- ✅ AI quiz generation and display.
- ✅ Scoring, timer, and feedback system.
- ✅ Leaderboard persistence in `localStorage`.
- ✅ Dynamic sound effects.
- ✅ Responsive design on various screen sizes.

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
1. **Difficulty Levels**: Easy, Medium, and Hard modes that adjust question complexity.
2. **Multiplayer Mode**: A competitive mode where two players race through the maze.
3. **Achievement System**: Award badges for milestones (e.g., "10 correct answers in a row").
4. **Localization**: Translate the game into multiple languages.
5. **Background Music**: Add an ambient soundtrack to enhance the experience.

## 🙏 Acknowledgments
- The power of generative AI for creating dynamic educational content.
- The flexibility of the Web Audio API for file-less sound design.
- The efficiency of SVG for creating lightweight, scalable graphics.
- GitHub Copilot for accelerating development and providing solutions.

## 📄 License
Created for RMIT Hackathon 2025 - For Educational Purposes.

---

**🎮 Ready to Play!**  
Follow the instructions in the "How to Run the Game" section to start your educational journey!

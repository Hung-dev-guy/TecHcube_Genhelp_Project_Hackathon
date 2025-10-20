# GenHelp - Sexual Health Education Game

## Overview
**GenHelp** is an interactive educational game teaching teenagers (ages 13-18) about sexual health, relationships, consent, and mental wellbeing through engaging quiz-based gameplay. Players navigate a maze path, answer educational questions, and spin the Wheel of Fortune in a fun, judgment-free environment.

## 🎮 Quick Start

1. **Get a Gemini API Key** (optional, for AI-generated questions):
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and create an API key
   - Open `game_app/config.js` and paste your key into `GEMINI_API_KEY`
   - Set `USE_AI_GENERATION: true` to enable AI questions

2. **Run a Local Server**:
   ```bash
   cd game_app
   python3 -m http.server
   ```

3. **Play**:
   - Open your browser to `http://localhost:8000/', then click *game_app*
   - Enter your name, select your character, and start playing!

## 🎯 Gameplay

**How to Play:**
1. Roll the dice to move 1-6 spaces along a linear path (15x8 grid maze)
2. Land on **yellow quiz tiles** to answer sexual health questions (+10 points for correct, -5 for wrong)
3. Land on **purple event tiles** to spin the Wheel of Fortune (-15 to +25 points)
4. Reach the trophy to complete the game
5. Score never goes below 0

**Educational Topics:**
- Pregnancy prevention & contraception
- STI awareness & prevention
- Consent & healthy relationships
- Mental health & wellbeing
- Body autonomy & peer pressure

## ✨ Key Features

- 🤖 **AI-Powered Quiz Generation** using Google Gemini API
- 🎡 **Wheel of Fortune** event system with animations
- 🛡️ **Score Protection** - Score never drops below 0
- 🏆 **Persistent Leaderboard** (localStorage)
- 🎨 **Modern Pastel UI** with glassmorphism effects
- 🔊 **Web Audio API** sound effects (no external files)
- 📱 **Fully Responsive** (desktop & mobile)
- 🎓 **Educational Explanations** for every answer

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 (Grid Layout), JavaScript (ES6+)
- **AI Integration**: Google Gemini API for dynamic quiz generation
- **Storage**: localStorage for leaderboard persistence
- **Audio**: Web Audio API for sound effects
- **Development Tools**: GitHub Copilot, AI-assisted design

## 📁 Project Structure

```
game_submission/
├── README.md                   # Project overview
├── game_app/                   # Main application
│   ├── index.html             # Entry point
│   ├── script.js              # Game logic (~850 lines)
│   ├── style.css              # UI styling (~1100 lines)
│   ├── gemini-quiz.js         # Quiz questions
│   ├── config.js              # Configuration
│   ├── api-integration.js     # API client
│   └── assets/
│       ├── images/            # 6 SVG files (< 15 KB total)
│       └── sounds/            # Web Audio API (no files)
├── screenshots/               # Game screenshots
└── prompts/                   # AI prompt documentation
```

## 📊 Statistics

- **Lines of Code**: ~2,200+ (HTML, CSS, JS)
- **Curated Questions**: 24 educational questions
- **Maze Size**: 15×8 grid (120 tiles)
- **Quiz Tiles**: 5 positioned along path
- **Event Tiles**: 6 Wheel of Fortune tiles
- **Assets**: 6 SVG files (< 15 KB total)
- **Load Time**: < 1 second
- **Browser Support**: Chrome, Firefox, Safari, Edge, Mobile

## 🎓 Educational Impact

**Learning Outcomes:**
- Pregnancy prevention methods
- STI transmission & protection
- Consent & boundaries
- Healthy relationships
- Mental health resources
- Body autonomy & peer pressure

**Pedagogical Approach:**
- Gamification reduces stigma
- Immediate feedback reinforces learning
- AI-generated questions provide variety
- Non-judgmental, safe environment
- Replayable for continued learning

## 📄 License

Created for RMIT Hackathon 2025 - Educational Purposes

---

**Made with** GitHub Copilot, Google Gemini API, and Web Audio API

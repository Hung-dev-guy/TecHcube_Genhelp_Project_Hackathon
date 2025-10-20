# Maze of Choices - Sexual Health Education Game

## Overview
"Maze of Choices" is an interactive, educational game designed to teach teenagers about sexual health, relationships, consent, and mental wellbeing through engaging quiz-based gameplay. Players navigate a maze, answer questions, and learn important life skills in a fun, judgment-free environment.

## 🎮 How to Run the Game

### Option 1: Standalone Frontend (Quick Start)
1. Navigate to the `game_app/` directory
2. Open `index.html` in any modern web browser
3. Enter your name and start playing!
4. Click the "Roll Dice" button to move through the maze
5. The character will automatically move along the path based on the dice roll (1-6)

**Note**: Uses localStorage for leaderboard (offline mode)

### Option 2: Full Stack with Backend (Recommended)

**Prerequisites**: Python 3.9+, MongoDB

**Quick Setup (Automated):**
```bash
cd /home/hungdvlper/Documents/RMIT-Hackathon/game_submission
./setup-backend.sh
```

**Manual Setup:**
```bash
# 1. Install MongoDB
sudo apt-get install mongodb  # Ubuntu/Debian
brew install mongodb-community # macOS

# 2. Setup backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env and set SECRET_KEY (see backend/README.md)

# 4. Run backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Access:**
- 🌐 Game: http://localhost:8000/
- 📖 API Docs: http://localhost:8000/docs
- ✅ Health: http://localhost:8000/api/health

### Asset Preview
1. Open `game_app/asset_preview.html` to view all visual assets
2. Test sound effects by clicking the buttons
3. Review asset details and specifications

**Detailed Setup Guide**: See `BACKEND_SETUP.md`

## 🎯 Project Summary

### Theme
Sexual health education for teenagers (ages 13-18) focused on:
- Pregnancy prevention and contraception
- STI awareness and prevention
- Consent and healthy relationships
- Mental health and wellbeing
- Body autonomy and peer pressure

### Gameplay Mechanics
1. **Maze Navigation**: Automatic movement along a linear path through a 15x8 grid maze
2. **Dice Rolling**: Click "Roll Dice" to get a random number (1-6) and move that many steps
3. **Quiz Tiles**: Step on yellow glowing tiles to answer questions
4. **Reward/Penalty System**: 
   - Correct answers → +10 points
   - Wrong answers → -5 points
5. **Goal**: Reach the trophy tile as fast as possible
6. **Scoring**: Based on correct answers and completion time
7. **Leaderboard**: Track and compare performance
8. **In-Game Navigation**: Access menu or leaderboard anytime with navigation buttons

### Key Features
- 12 carefully crafted educational questions
- 🤖 **AI-Powered Quiz Generation** using Gemini API (NEW!)
- 🔒 **Age-appropriate content moderation** for AI questions
- Real-time timer and scoring system
- Persistent leaderboard (localStorage or MongoDB)
- Colorful, cartoonish graphics suitable for teens
- Interactive sound effects for engagement
- Fully responsive design (desktop and mobile)
- Educational explanations for each answer

## 🛠️ Technology Stack

### Backend (NEW!)
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Motor** - Async MongoDB driver for Python
- **JWT (python-jose)** - Token-based authentication
- **Bcrypt** - Password hashing
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server

### Backend (NEW!)
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database
- **Motor** - Async MongoDB driver
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **Google Gemini API** - AI quiz generation (NEW!)

### Frontend
- **HTML5** - Structure and semantic markup
- **CSS3** - Styling, animations, and responsive design
- **JavaScript (ES6+)** - Game logic and interactivity
- **Fetch API** - REST API integration

### Asset Technologies
- **SVG (Scalable Vector Graphics)** - All visual assets
- **Web Audio API** - Dynamic sound generation

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
- ✅ 🤖 AI-generated dynamic quiz questions (NEW!)
- ✅ 🔒 Age-appropriate content filtering (NEW!)
- ✅ Question randomization for replay value
- ✅ Real-time timer and score tracking
- ✅ In-game navigation buttons (menu/leaderboard access)
- ✅ Goal-oriented progression system

### Visuals
- ✅ Custom kawaii-style player characters (cute bunny design)
- ✅ Modern soft UI with pastel gradients
- ✅ Glassmorphism effects and glowing animations
- ✅ Colorful quiz and goal icons
- ✅ Textured floor and wall tiles
- ✅ Smooth dice rolling animations
- ✅ Responsive design with beautiful transitions
- ✅ Friendly, approachable art style for teenagers

### Audio
- ✅ Correct answer chime (ascending)
- ✅ Wrong answer buzz (descending)
- ✅ Victory celebration sound
- ✅ Movement feedback beeps

### UI/UX
- ✅ Multiple screens (menu, game, results, leaderboard)
- ✅ Player name customization
- ✅ Instructions screen with gameplay guide
- ✅ Dice rolling interface with visual feedback
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

## 📁 Project Structure

```
game_submission/
├── README.md                    # This file (project overview)
├── BACKEND_SETUP.md             # Backend setup guide (NEW!)
├── QUICKSTART.md                # Quick start guide
├── ASSET_IMPLEMENTATION.md      # Asset creation details
├── ASSETS_COMPLETE.md           # Asset completion summary
├── setup-backend.sh             # Automated backend setup (NEW!)
├── project_report.pdf           # Detailed project documentation
├── youtube_link.txt             # Video demonstration link
├── backend/                     # FastAPI Backend (NEW!)
│   ├── main.py                 # FastAPI app entry point
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment template
│   ├── .env                    # Your configuration
│   ├── README.md               # Backend documentation
│   └── app/
│       ├── config.py           # Settings management (updated)
│       ├── database.py         # MongoDB connection
│       ├── auth.py             # JWT authentication
│       ├── models/
│       │   ├── __init__.py
│       │   └── schemas.py      # Pydantic data models (updated)
│       ├── services/           # (NEW!)
│       │   ├── __init__.py
│       │   └── gemini_service.py  # AI quiz generation service
│       └── routers/
│           ├── __init__.py
│           ├── auth.py         # Authentication endpoints
│           ├── game.py         # Game session endpoints
│           ├── leaderboard.py  # Leaderboard endpoints
│           └── quiz.py         # Quiz endpoints (updated with AI)
├── game_app/                    # Frontend
│   ├── index.html              # Main game file
│   ├── script.js               # Game logic (700+ lines)
│   ├── api-integration.js      # API client (NEW!)
│   ├── gemini-quiz.js          # Quiz questions (24 Vietnamese questions)
│   ├── config.js               # Game configuration
│   ├── style.css               # Modern UI styling (900+ lines)
│   ├── asset_preview.html      # Asset testing page
│   └── assets/
│       ├── README.md           # Asset documentation
│       ├── images/             # 8 SVG visual assets
│       │   ├── player1.svg     # Cute pink bunny character
│       │   ├── player2.svg     # Cute blue bunny character
│       │   ├── dice.svg        # Dice graphic
│       │   ├── quiz.svg        # Question mark icon
│       │   ├── goal.svg        # Trophy icon
│       │   ├── tile_floor.svg  # Floor texture
│       │   └── tile_wall.svg   # Wall texture
│       └── sounds/             # Audio documentation
│           └── README.md       # Web Audio API guide
├── prompts/
│   ├── concept_prompts.txt         # Initial game concept
│   ├── code_generation_prompts.txt # Code development prompts
│   ├── asset_generation_prompts.txt # Visual asset prompts
│   └── refinement_prompts.txt      # Iteration prompts
└── screenshots/
    ├── menu_screen.png
    ├── play_screen1.png
    ├── play_screen2.png
    ├── play_screen3.png
    └── results_screen.png
```

## 🎨 Asset Details

### Visual Assets (Total: < 20 KB)
- 8 SVG files (scalable, crisp at any size)
- Kawaii-style cute characters (pink bunny, blue bunny)
- Modern dice graphic with animations
- Pastel gradient design system
- Quiz and goal icons
- Textured tiles for maze
- High contrast for accessibility

### Sound Effects
- 4 dynamic sounds using Web Audio API
- No external files needed
- Instant loading, zero latency
- Cross-browser compatible

## 🧪 Testing

### Browser Compatibility
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS/Android)

### Feature Testing
- ✅ Dice rolling and auto-movement
- ✅ Linear path navigation
- ✅ Quiz system with feedback and randomization
- ✅ Scoring and timer accuracy
- ✅ Leaderboard persistence (localStorage)
- ✅ In-game navigation buttons
- ✅ Sound effects
- ✅ Responsive design (desktop + mobile)
- ✅ Modern UI animations and transitions

## 📊 Game Statistics

- **Lines of Code**: ~2,000+ (HTML, CSS, JS, Python)
- **Curated Questions**: 24 comprehensive sexual health questions (Vietnamese)
- **AI-Generated Questions**: Unlimited via Gemini API (NEW!)
- **Maze Size**: 15×8 grid (120 tiles)
- **Path Length**: ~41 tiles in linear path
- **Quiz Tiles**: 9 positioned along the path
- **Load Time**: < 1 second (all assets < 20 KB)
- **Platforms**: Web (desktop + mobile)
- **Backend Endpoints**: 12+ REST API endpoints (NEW!)
- **UI Design**: Modern soft UI with pastel gradients and glassmorphism

## 🏆 Educational Impact

### Learning Outcomes
Students will learn about:
1. ✅ Pregnancy prevention methods
2. ✅ STI transmission and protection
3. ✅ Consent and boundaries
4. ✅ Healthy relationship characteristics
5. ✅ Mental health awareness
6. ✅ Body autonomy rights
7. ✅ Peer pressure resistance
8. ✅ Puberty and development

### Pedagogical Approach
- **Gamification**: Makes learning engaging
- **Immediate Feedback**: Reinforces correct knowledge
- **Explanations**: Every answer includes educational context
- **Non-judgmental**: Safe, welcoming environment
- **Repeatable**: Players can replay to improve understanding

## 🚀 Future Enhancements

### Potential Additions
1. ~~**More Questions**: Expand to 50+ questions~~ ✅ **DONE** (AI generation)
2. ~~**Dynamic Content**: AI-generated questions~~ ✅ **DONE** (Gemini API)
3. **Difficulty Levels**: Easy, Medium, Hard modes
4. **Multiplayer Mode**: Competitive or cooperative play
5. **Achievement System**: Badges for milestones
6. **Progress Tracking**: Save player progress (partially done with backend)
7. **Localization**: Multiple languages
8. **Professional Assets**: Commission artwork
9. **Background Music**: Ambient soundtracks
10. **Mobile App**: Native iOS/Android versions
11. **Analytics**: Track learning outcomes
12. **Admin Dashboard**: Manage questions and users

## 🙏 Acknowledgments

- Prompt engineering techniques for educational content
- Web Audio API for dynamic sound generation
- SVG graphics for scalable visuals
- GitHub Copilot for code assistance

## 📄 License

Created for RMIT Hackathon 2025 - Educational purposes

---

**🎮 Ready to Play!**  
Open `game_app/index.html` and start your educational journey through the Maze of Choices!

**📱 Asset Preview:**  
Open `game_app/asset_preview.html` to view all visual assets and test sound effects!


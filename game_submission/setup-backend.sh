#!/bin/bash

# Maze of Choices - Backend Setup Script
# This script automates the backend setup process

set -e  # Exit on error

echo "🎮 Maze of Choices - Backend Setup Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MongoDB is installed
echo "📦 Checking MongoDB installation..."
if command -v mongosh &> /dev/null || command -v mongo &> /dev/null; then
    echo -e "${GREEN}✓${NC} MongoDB is installed"
else
    echo -e "${RED}✗${NC} MongoDB is not installed"
    echo "Please install MongoDB first:"
    echo "  Ubuntu/Debian: sudo apt-get install mongodb"
    echo "  macOS: brew install mongodb-community"
    exit 1
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB status..."
if mongosh --eval "db.version()" &> /dev/null || mongo --eval "db.version()" &> /dev/null; then
    echo -e "${GREEN}✓${NC} MongoDB is running"
else
    echo -e "${YELLOW}⚠${NC} MongoDB is not running. Attempting to start..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo systemctl start mongodb || sudo service mongodb start
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start mongodb-community
    fi
    sleep 2
    echo -e "${GREEN}✓${NC} MongoDB started"
fi

# Navigate to backend directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"

cd "$BACKEND_DIR"
echo "📂 Working directory: $BACKEND_DIR"

# Create virtual environment
echo "🐍 Creating Python virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✓${NC} Virtual environment created"
else
    echo -e "${YELLOW}⚠${NC} Virtual environment already exists"
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing Python dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo -e "${GREEN}✓${NC} Dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    
    # Generate a secure secret key
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
    
    # Update SECRET_KEY in .env
    sed -i.bak "s/your-secret-key-change-this-in-production/$SECRET_KEY/" .env
    rm .env.bak 2>/dev/null || true
    
    echo -e "${GREEN}✓${NC} .env file created with secure SECRET_KEY"
else
    echo -e "${YELLOW}⚠${NC} .env file already exists"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Backend setup complete!${NC}"
echo "=========================================="
echo ""
echo "🚀 To start the backend server:"
echo "   cd $BACKEND_DIR"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "📖 Then visit:"
echo "   - Game: http://localhost:8000/"
echo "   - API Docs: http://localhost:8000/docs"
echo "   - Health: http://localhost:8000/api/health"
echo ""

# Ask if user wants to start the server now
read -p "Would you like to start the backend server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting backend server..."
    echo "Press Ctrl+C to stop"
    echo ""
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
fi

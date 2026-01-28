#!/bin/bash

# Backend + Frontend Setup Script
# This script sets up both backend and frontend for development

echo "🚀 Setting up Portfolio Backend & Frontend..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

echo "  Installing dependencies..."
npm install

if [ ! -f .env.local ]; then
    echo ""
    echo "  ⚠️  .env.local not found!"
    echo "  Create backend/.env.local with your API keys:"
    echo ""
    echo "  PORT=5000"
    echo "  NODE_ENV=development"
    echo "  MISTRAL_API_KEY=your_key_here"
    echo "  OPENROUTER_API_KEY=your_key_here"
    echo ""
fi

cd ..

# Setup Frontend
echo "📚 Setting up Frontend..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To run your application:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend"
echo "    npm run dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    ng serve"
echo ""
echo "Then open: http://localhost:4200"
echo ""
echo "📖 For more info, see BACKEND_FRONTEND_INTEGRATION.md"

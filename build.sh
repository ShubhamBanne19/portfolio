#!/bin/bash
# Portfolio Build Script for macOS/Linux
# This script builds the Angular portfolio application

echo ""
echo "========================================"
echo "  Portfolio Build Script"
echo "========================================"
echo ""

cd portfolioWork

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[1/3] Installing dependencies..."
    npm ci
    if [ $? -ne 0 ]; then
        echo "Error: npm install failed"
        exit 1
    fi
else
    echo "[1/3] Dependencies already installed (skipping npm ci)"
fi

echo ""
echo "[2/3] Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Build failed"
    exit 1
fi

echo ""
echo "[3/3] Verifying build output..."
if [ -d "dist/portfolio-work/browser" ]; then
    echo ""
    echo "========================================"
    echo "✓ BUILD SUCCESSFUL!"
    echo "========================================"
    echo ""
    echo "Build artifacts location:"
    du -sh dist/portfolio-work/browser
    echo ""
    echo "Next steps:"
    echo "  1. Review your changes locally"
    echo "  2. git add ."
    echo "  3. git commit -m \"Your message\""
    echo "  4. git push origin feature"
    echo "  5. Create PR on GitHub (feature → main)"
    echo ""
else
    echo "Error: Build output directory not found"
    exit 1
fi

cd ..

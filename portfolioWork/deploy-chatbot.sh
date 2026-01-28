#!/bin/bash

# Chatbot Deployment Script for GitHub Pages

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Portfolio Chatbot Deployment ===${NC}"

# Step 1: Build
echo -e "\n${YELLOW}Step 1: Building project...${NC}"
ng build --configuration production --base-href=/portfolio/

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Build failed${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Build successful${NC}"

# Step 2: Test production build
echo -e "\n${YELLOW}Step 2: Starting local server for testing...${NC}"
echo -e "${YELLOW}Visit http://localhost:8080 to test${NC}"
npx http-server dist/portfolioWork -p 8080 -c-1

echo -e "\n${YELLOW}Step 3: Deploy to gh-pages${NC}"
echo -e "When ready, run: angular-cli-ghpages"

echo -e "\n${GREEN}✅ Ready to deploy!${NC}"

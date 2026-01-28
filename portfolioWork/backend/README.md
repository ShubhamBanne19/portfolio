# Portfolio Backend - API Proxy Server

A secure Node.js/Express backend server that acts as a proxy for your AI chatbot APIs (Mistral, OpenRouter, etc.). This ensures your API keys never get exposed in frontend code.

## 🎯 Purpose

- ✅ Keeps API keys SECRET (only on backend)
- ✅ Provides secure proxy endpoints for frontend
- ✅ Prevents exposure in GitHub/public code
- ✅ Enables rate limiting and request validation
- ✅ Handles CORS properly for GitHub Pages hosting

## 📋 Architecture

```
Frontend (Angular) → Backend (Node.js) → Third-party APIs
    (Public)            (Private)          (Mistral, etc)
  No secrets here    Has .env keys      API keys used here
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create Environment File

```bash
# Copy the example
cp .env.example .env.local

# Edit and add your API keys
# .env.local (never commit this!)
MISTRAL_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
```

### 3. Run Locally

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

### 4. Test the Server

```bash
# Health check
curl http://localhost:5000/health

# Test Mistral endpoint
curl -X POST http://localhost:5000/api/mistral \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}],
    "model": "mistral-small-latest"
  }'
```

## 📡 API Endpoints

### Health Check
```
GET /health
Response: { status: "OK", timestamp, uptime }
```

### Mistral Chat Completion
```
POST /api/mistral
Body: {
  "messages": [{ "role": "user", "content": "Your message" }],
  "model": "mistral-small-latest",
  "temperature": 0.2
}
```

### OpenRouter Chat Completion
```
POST /api/openrouter
Body: {
  "messages": [{ "role": "user", "content": "Your message" }],
  "model": "openai/gpt-3.5-turbo",
  "temperature": 0.7
}
```

## 🔐 Security Features

- ✅ **Helmet**: Sets secure HTTP headers
- ✅ **Rate Limiting**: Max 100 requests per 15 minutes per IP
- ✅ **CORS**: Restricted to your portfolio domain
- ✅ **Input Validation**: Checks required fields
- ✅ **Error Handling**: Doesn't leak sensitive info
- ✅ **Timeouts**: 30 second timeout on API calls

## 🌐 CORS Configuration

The server allows requests from:
- `http://localhost:4200` (local Angular dev)
- `http://localhost:3000` (alternative local)
- `https://shubhambanne19.github.io` (GitHub Pages)
- `https://shubhambanne19.github.io/portfolio` (with /portfolio path)

Edit `corsOptions` in `src/server.ts` to add more origins.

## 📦 Deployment Options

### Option 1: Railway (Recommended - Easiest)

```bash
# 1. Sign up at https://railway.app
# 2. Install Railway CLI
npm install -g @railway/cli

# 3. Login
railway login

# 4. Initialize project in backend folder
cd backend
railway init

# 5. Add environment variables
railway variables set MISTRAL_API_KEY=your_key
railway variables set OPENROUTER_API_KEY=your_key

# 6. Deploy
railway up
```

### Option 2: Render

```bash
# 1. Sign up at https://render.com
# 2. Create new Web Service
# 3. Connect GitHub repository
# 4. Build command: npm install && npm run build
# 5. Start command: npm start
# 6. Add environment variables in Render dashboard
```

### Option 3: Vercel Functions (Serverless)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel deploy --prod

# 3. Add environment variables in Vercel dashboard
```

### Option 4: Self-hosted (VPS/Heroku Classic)

```bash
# Add Procfile for Heroku
echo "web: npm start" > Procfile

# Deploy to Heroku
heroku create portfolio-backend
heroku config:set MISTRAL_API_KEY=your_key
git push heroku main
```

## 🔗 Integration with Angular Frontend

### Update Frontend Service

```typescript
// src/app/services/chatbot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  // In development: http://localhost:5000
  // In production: https://your-backend-url.railway.app
  private apiUrl = environment.production 
    ? 'https://your-backend-url.railway.app'
    : 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  sendMessageToMistral(messages: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/mistral`, {
      messages,
      model: 'mistral-small-latest',
      temperature: 0.2
    });
  }

  sendMessageToOpenRouter(messages: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/openrouter`, {
      messages,
      model: 'openai/gpt-3.5-turbo',
      temperature: 0.7
    });
  }
}
```

### Update Environment Configuration

In `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  backendUrl: 'http://localhost:5000'
};
```

In `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  backendUrl: 'https://your-backend-url.railway.app'
};
```

## 🚨 Environment Variables

**Never commit `.env` or `.env.local`!**

The `.gitignore` should include:
```
backend/.env
backend/.env.local
backend/.env.*.local
```

## 📝 Available Scripts

```bash
npm run dev      # Development with ts-node (hot reload)
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled server
npm run lint     # Lint code with ESLint
```

## 🐛 Troubleshooting

### "API key not configured"
- Create `.env.local` in backend folder
- Add `MISTRAL_API_KEY` and `OPENROUTER_API_KEY`
- Restart server

### "CORS error in frontend"
- Check that your domain is in `corsOptions` 
- Add your GitHub Pages URL if missing
- Clear browser cache and hard refresh

### "Port already in use"
```bash
# Change PORT in .env.local
PORT=5001

# Or kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### "Cannot find module" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📊 Monitoring & Logging

Add monitoring in production:
```typescript
// Example with Winston logger
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy-backend.yml`:
```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm install && npm run build
      - run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## 🎓 Best Practices

✅ **DO**
- Store API keys in backend `.env` only
- Use HTTPS in production
- Implement request signing/authentication
- Log API usage for monitoring
- Rotate keys regularly
- Use different keys for dev/prod

❌ **DON'T**
- Commit `.env` files
- Expose API keys in logs
- Trust client-sent data without validation
- Use same key for multiple environments
- Leave old keys active

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [Railway Deployment](https://docs.railway.app/)
- [Mistral API Docs](https://docs.mistral.ai/)
- [OpenRouter API Docs](https://openrouter.io/docs)

## 📄 License

MIT

---

**Need help?** Check the frontend Angular service documentation or create an issue.

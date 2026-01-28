# Environment Setup Guide

## Quick Start

### Step 1: Create `.env.local` file
```bash
# portfolioWork/.env.local
OPENROUTER_API_KEY=your_key_here
MISTRAL_API_KEY=your_key_here
```

### Step 2: Configure Angular to read environment variables

For **development**, modify `src/main.ts`:

```typescript
import { environment } from './environments/environment';

// In development, load from .env if available
if (!environment.production) {
  const overrides = {
    chatbot: {
      apiKey: (process.env['OPENROUTER_API_KEY'] || environment.chatbot.apiKey)
    },
    mistral: {
      apiKey: (process.env['MISTRAL_API_KEY'] || environment.mistral.apiKey)
    }
  };
  
  Object.assign(environment.chatbot, overrides.chatbot);
  Object.assign(environment.mistral, overrides.mistral);
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

### Step 3: Use in your services

```typescript
// src/app/services/chatbot.service.ts
import { environment } from '../../environments/environment';

@Injectable()
export class ChatbotService {
  private apiKey = environment.chatbot.apiKey;
  
  constructor(private http: HttpClient) {
    if (!this.apiKey) {
      throw new Error('API key not configured. Check environment variables.');
    }
  }
}
```

---

## Production Deployment (GitHub Pages + Backend)

Since GitHub Pages is static-only, you need a **backend server** for API calls:

### Recommended Architecture:

```
┌─────────────────┐
│  Angular App    │ (GitHub Pages)
│  /portfolio     │
└────────┬────────┘
         │ API Calls
         ▼
┌─────────────────┐
│  Backend Server │ (Railway/Render/Heroku)
│  /api/chat      │
└────────┬────────┘
         │ Uses MISTRAL_API_KEY from .env
         ▼
┌─────────────────┐
│ Third-party API │
│ (Mistral, etc)  │
└─────────────────┘
```

### Example Backend Setup (Express.js)

Create `backend/src/routes/chat.ts`:

```typescript
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { messages, model } = req.body;
    
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || 'mistral-small-latest',
        messages,
        temperature: 0.2,
        max_tokens: 300
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Update Frontend Service:

```typescript
@Injectable()
export class ChatbotService {
  private apiUrl = '/api'; // Backend URL
  
  sendMessage(messages: any[]): Observable<any> {
    // Call backend instead of third-party API directly
    return this.http.post(`${this.apiUrl}/chat`, { messages });
  }
}
```

### Deploy Backend to Railway

```powershell
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
railway init

# 4. Add environment variables
railway variables set MISTRAL_API_KEY=your_key_here

# 5. Deploy
railway up
```

---

## Verification Checklist

- [ ] `.env.local` created with API keys
- [ ] `.env.local` added to `.gitignore` ✅
- [ ] Environment variables working in development (`ng serve`)
- [ ] No hardcoded secrets in `environment.ts` ✅
- [ ] Backend service created (for production)
- [ ] Backend deployed with environment variables
- [ ] Frontend updated to call backend `/api/*` endpoints
- [ ] CORS configured on backend
- [ ] Tests passing with environment variable setup

---

## Troubleshooting

### "API key is empty"
```bash
# Check if .env file exists
ls -la .env.local

# Verify it's not in .gitignore
git check-ignore .env.local
```

### "process.env is undefined"
Ensure you're in a Node.js environment or using a build tool that supports env vars.

For Angular, use `@angular-builders/custom-webpack` to inject environment variables:

```bash
npm install --save-dev @angular-builders/custom-webpack
```

Update `angular.json`:
```json
{
  "projects": {
    "portfolioWork": {
      "architect": {
        "build": {
          "builder": "@angular-builders/custom-webpack:browser",
          "options": {
            "customWebpackConfig": {
              "path": "./webpack.config.js"
            }
          }
        }
      }
    }
  }
}
```

Create `webpack.config.js`:
```javascript
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.OPENROUTER_API_KEY': JSON.stringify(process.env.OPENROUTER_API_KEY),
      'process.env.MISTRAL_API_KEY': JSON.stringify(process.env.MISTRAL_API_KEY)
    })
  ]
};
```

---

## Security Best Practices

✅ **DO**
- [ ] Store all API keys in `.env.local` (never commit)
- [ ] Use backend proxy for production (don't expose keys in frontend)
- [ ] Rotate keys regularly
- [ ] Use environment-specific configurations
- [ ] Implement rate limiting on backend
- [ ] Log and monitor API usage
- [ ] Use HTTPS for all API calls

❌ **DON'T**
- [ ] Commit `.env` files to Git
- [ ] Hardcode secrets in source code
- [ ] Expose API keys in frontend code
- [ ] Share API keys in Slack/Email
- [ ] Use same key for dev and production
- [ ] Leave old keys active after rotation


# Chatbot Integration Guide

## Overview

A production-ready, portfolio-aware AI chatbot for your Angular website. No backend server required - pure frontend with API-based AI integration.

## Features

✅ Floating chat icon (bottom-right)
✅ Smooth animations (slide-up, fade-in)
✅ Chat window with header, messages, typing indicator
✅ Mobile responsive (fully functional on mobile)
✅ Keyboard support (Enter to send)
✅ Auto-scroll on new messages
✅ Portfolio-aware system prompt
✅ Chat history with token limiting
✅ Graceful error handling
✅ Glassmorphism UI with dark theme
✅ CSS-only styling (no external libraries)
✅ Environment-based configuration
✅ Production optimizations

## Setup Instructions

### 1. Get an API Key

Choose one of these providers:

#### Option A: OpenRouter (Recommended)
- **Pros:** Supports multiple models, no need to switch providers, good rate limiting
- **Setup:**
  1. Go to https://openrouter.ai/keys
  2. Sign up and create an API key
  3. Set a monthly budget limit in dashboard (prevents abuse)
  4. Copy your API key

#### Option B: OpenAI
- **Setup:**
  1. Go to https://platform.openai.com/api-keys
  2. Sign up and create an API key
  3. Set usage limits in dashboard
  4. Copy your API key

#### Option C: Google Gemini
- **Setup:**
  1. Go to https://makersuite.google.com/app/apikey
  2. Click "Create API Key" in new project
  3. Copy your API key

#### Option D: Groq (Fast & Free)
- **Setup:**
  1. Go to https://console.groq.com
  2. Sign up and create an API key
  3. Copy your API key

### 2. Configure Environment Files

#### Development (`src/environments/environment.ts`)

```typescript
export const environment = {
  production: false,
  chatbot: {
    provider: 'openrouter',  // or 'openai', 'gemini', 'groq'
    apiKey: 'YOUR_API_KEY_HERE',
    model: 'openai/gpt-3.5-turbo',  // Change based on provider
    maxTokens: 1000,
    temperature: 0.7,
    maxHistoryLength: 10
  }
};
```

#### Production (`src/environments/environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  chatbot: {
    provider: 'openrouter',
    apiKey: 'YOUR_API_KEY_HERE',
    model: 'openai/gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7,
    maxHistoryLength: 10
  }
};
```

### 3. Verify Integration

Files already added to your project:
- ✅ `src/app/shared/components/chatbot/chatbot.component.ts`
- ✅ `src/app/shared/components/chatbot/chatbot.component.html`
- ✅ `src/app/shared/components/chatbot/chatbot.component.scss`
- ✅ `src/app/shared/services/chatbot.service.ts`
- ✅ `src/app/shared/models/chatbot.model.ts`
- ✅ `src/environments/environment.ts`
- ✅ `src/environments/environment.prod.ts`
- ✅ Updated `src/app/app.module.ts` (added HttpClientModule & ChatbotComponent)
- ✅ Updated `src/app/app.component.html` (added `<app-chatbot></app-chatbot>`)

### 4. Test Locally

```bash
cd portfolioWork
npm install  # if you added new dependencies (already included)
ng serve
```

Visit `http://localhost:4200` and click the chat icon (💬) at bottom-right.

### 5. Build for Production

```bash
ng build --configuration production
```

The build will:
- Replace `environment.ts` with `environment.prod.ts`
- Bundle the chatbot component
- Optimize CSS and JavaScript
- Generate optimized dist/

### 6. Deploy to GitHub Pages

```bash
ng build --configuration production --base-href=/portfolio/
# Then push to gh-pages branch
```

## API Configuration by Provider

### OpenRouter (Recommended)

```typescript
export const environment = {
  production: true,
  chatbot: {
    provider: 'openrouter',
    apiKey: 'sk-or-YOUR_KEY',
    model: 'openai/gpt-3.5-turbo',
    // Alternative models:
    // 'mistralai/mistral-7b-instruct'
    // 'meta-llama/llama-2-70b-chat'
    // 'anthropic/claude-2'
  }
};
```

### OpenAI

```typescript
export const environment = {
  production: true,
  chatbot: {
    provider: 'openai',
    apiKey: 'sk-YOUR_KEY',
    model: 'gpt-3.5-turbo',
    // Alternative models:
    // 'gpt-4' (more expensive)
    // 'gpt-3.5-turbo-16k'
  }
};
```

### Google Gemini

```typescript
export const environment = {
  production: true,
  chatbot: {
    provider: 'gemini',
    apiKey: 'YOUR_KEY',
    model: 'gemini-pro'
  }
};
```

### Groq

```typescript
export const environment = {
  production: true,
  chatbot: {
    provider: 'groq',
    apiKey: 'YOUR_KEY',
    model: 'mixtral-8x7b-32768'
    // Alternative models:
    // 'llama2-70b-4096'
  }
};
```

## Security Considerations

⚠️ **GitHub Pages Limitation:** Since you're hosting on GitHub Pages (static site), your API key will be visible in the browser. This is inherent to the architecture.

### Mitigation Strategies:

1. **Use a Provider with Rate Limiting**
   - OpenRouter: Set monthly budget in dashboard
   - OpenAI: Enable usage limits
   - Groq: Free tier with rate limits
   - All providers: Monitor API usage regularly

2. **API Key Rotation**
   - Regenerate your key regularly
   - Keep old keys disabled

3. **Monitor Usage**
   - Check your provider's dashboard daily
   - Set up usage alerts if available
   - Monitor costs

4. **Alternative: Proxy Backend**
   - If abuse becomes a problem, create a simple backend:
     - Node.js/Express proxy server
     - Store API key on server
     - Frontend calls your proxy instead
   - Deploy to Vercel, Netlify, or Railway (free tier available)

## Customization

### Customize System Prompt

Edit `src/app/shared/services/chatbot.service.ts`:

```typescript
private generateSystemPrompt(): string {
  // Modify the template to match your portfolio
  return `You are a professional AI assistant for [Your Name]...`;
}
```

The system prompt automatically pulls:
- Profile from `src/app/data/profile.data.ts`
- Skills from `src/app/data/skills.data.ts`
- Projects from `src/app/data/project.data.ts`
- Experience from `src/app/data/experience.data.ts`

Update these data files to personalize responses.

### Change Colors/Styling

Edit `src/app/shared/components/chatbot/chatbot.component.scss`:

```scss
$primary-color: #1f2937;        // Dark background
$accent-color: #3b82f6;         // Button color
$text-primary: #f3f4f6;         // Main text
$success-color: #10b981;        // Online badge
```

### Adjust Chat Behavior

Edit `src/app/shared/services/chatbot.service.ts`:

```typescript
private config: ChatbotConfig = environment.chatbot as ChatbotConfig;

// Properties you can tweak:
// - maxTokens: 1000 (response length)
// - temperature: 0.7 (creativity: 0=factual, 1=creative)
// - maxHistoryLength: 10 (conversation context)
// - DEBOUNCE_TIME: 500 (throttle requests)
```

### Customize Initial Message

In `chatbot.service.ts`, update `initializeChat()`:

```typescript
const greeting: ChatMessage = {
  id: this.generateId(),
  role: 'assistant',
  content: `Your custom greeting message here`,
  timestamp: new Date()
};
```

## TypeScript Models

The chatbot uses strong typing:

```typescript
// src/app/shared/models/chatbot.model.ts
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
}

export interface ChatbotConfig {
  provider: 'openai' | 'openrouter' | 'gemini' | 'groq';
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  maxHistoryLength: number;
}
```

## Performance Optimizations

### Included:
- Lazy loading with `OnPush` detection strategy
- Debounced API requests (500ms throttle)
- Viewport-aware scrolling
- CSS animations optimized (transform + opacity)
- Reduced motion support (prefers-reduced-motion)
- TrackBy function for message lists
- Memory-efficient history trimming

### Additional Tips:
- Use `gpt-3.5-turbo` (faster, cheaper than gpt-4)
- Set `maxTokens` to 500-1000 (shorter responses = faster)
- Use `maxHistoryLength: 10` (balances context vs performance)

## Troubleshooting

### API Key Not Working
- Check the key is copied correctly (no spaces)
- Verify the provider is set correctly
- Check that the key is still active in your provider's dashboard
- Ensure the HTTP/CORS headers are correct

### Chat Not Opening
- Check browser console for errors (F12)
- Verify `ChatbotComponent` is imported in `app.module.ts`
- Verify `<app-chatbot></app-chatbot>` is in `app.component.html`
- Clear browser cache and reload

### Slow Responses
- Check internet connection
- Use a faster model (gpt-3.5-turbo vs gpt-4)
- Reduce `maxTokens` value
- Check provider's status page for outages

### Build Errors
- Run `npm install` to ensure all dependencies
- Clear `node_modules` and reinstall if issues persist
- Check TypeScript compilation: `ng build`

### CORS Errors
- This shouldn't happen as API calls go directly to provider
- If you see CORS errors, you may need to implement a proxy backend

## Deployment Checklist

- [ ] Update `src/environments/environment.prod.ts` with production API key
- [ ] Test chatbot locally with `ng serve`
- [ ] Run `ng build --configuration production`
- [ ] Test production build locally: `npx http-server dist/portfolioWork`
- [ ] Verify chatbot works in production build
- [ ] Deploy to GitHub Pages
- [ ] Test on GitHub Pages domain
- [ ] Monitor API usage in provider dashboard
- [ ] Set up alerts if available

## Cost Estimation

### Monthly Costs (Typical)

- **OpenRouter:** $0-10 (depends on model and usage)
- **OpenAI:** $0.50-5 (gpt-3.5-turbo is cheap)
- **Gemini:** Free tier available
- **Groq:** Free (rate limited)

Assuming ~100 visitors/month with 2-3 messages each:
- **Budget:** $1-10/month max
- **Peak:** $50/month if viral (thousands of visitors)

## Architecture

```
src/app/
├── shared/
│   ├── components/
│   │   └── chatbot/
│   │       ├── chatbot.component.ts       (Component logic)
│   │       ├── chatbot.component.html     (Template)
│   │       └── chatbot.component.scss     (Styling)
│   ├── services/
│   │   └── chatbot.service.ts             (API integration)
│   └── models/
│       └── chatbot.model.ts               (TypeScript interfaces)
├── data/
│   ├── profile.data.ts                    (Portfolio data)
│   ├── skills.data.ts
│   ├── projects.data.ts
│   └── experience.data.ts
└── app.module.ts                          (ChatbotComponent imported)

environments/
├── environment.ts                          (Dev config)
└── environment.prod.ts                     (Prod config)
```

## Advanced: Custom Backend Proxy

If you want to hide your API key, create a simple backend:

```javascript
// Example: Node.js/Express (optional)
const express = require('express');
const axios = require('axios');

app.post('/api/chat', async (req, res) => {
  const response = await axios.post('https://api.openai.com/v1/chat/completions', 
    req.body, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
  res.json(response.data);
});
```

Then in `chatbot.service.ts`, change the URL to your backend:

```typescript
const url = '/api/chat'; // Your backend endpoint
```

Deploy backend to: Vercel, Netlify, Railway, Heroku, etc.

## Support

For issues:
1. Check browser console (F12)
2. Verify API key is correct
3. Test with curl/Postman to isolate issues
4. Check provider's documentation
5. Review this guide's troubleshooting section

## License

Production-ready code. Use freely in your portfolio.

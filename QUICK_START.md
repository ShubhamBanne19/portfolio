# Quick Start Guide - Chatbot on Feature Branch

## Current Status ✅

```
Active Branch: feature
Commit: e8c2464 "feat: add production-ready portfolio chatbot"
Main Branch: Safe and unchanged (build v4)
Feature Branch: Ready for testing and iteration
```

---

## 🎯 What You Need to Do (5 minutes)

### Step 1: Verify You're on Feature Branch
```bash
cd portfolioWork
git branch
# Should show: * feature
```

### Step 2: Get API Key
Pick ONE provider and get an API key:
- **OpenRouter** (Recommended): https://openrouter.ai/keys
- **OpenAI**: https://platform.openai.com/api-keys
- **Google Gemini**: https://makersuite.google.com/app/apikey
- **Groq**: https://console.groq.com

### Step 3: Configure (2 minutes)
Edit `portfolioWork/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  chatbot: {
    provider: 'openrouter',              // Your chosen provider
    apiKey: 'YOUR_API_KEY_HERE',         // Paste your key
    model: 'openai/gpt-3.5-turbo',       // For OpenRouter
    maxTokens: 1000,
    temperature: 0.7,
    maxHistoryLength: 10
  }
};
```

Also update `portfolioWork/src/environments/environment.prod.ts` with same settings.

### Step 4: Test Locally (3 minutes)
```bash
npm install
ng serve
# Visit http://localhost:4200
# Click the 💬 chat icon in bottom-right corner
# Type a message and send
```

---

## 📁 Important Files

### Configuration
- `portfolioWork/src/environments/environment.ts` ← **Edit this first**
- `portfolioWork/src/environments/environment.prod.ts` ← **Also edit this**

### Component Code
- `portfolioWork/src/app/shared/components/chatbot/` (Component files)
- `portfolioWork/src/app/shared/services/chatbot.service.ts` (API calls)

### Documentation
- `CHATBOT_CHECKLIST.md` ← **Start here for verification**
- `CHATBOT_SETUP.md` ← **Complete reference**
- `CHATBOT_CUSTOMIZATION.md` ← **Advanced features**

### Integration Points
- `portfolioWork/src/app/app.module.ts` (Imports ChatbotComponent)
- `portfolioWork/src/app/app.component.html` (Has `<app-chatbot>` tag)

---

## 🧪 Quick Verification

```bash
# 1. Install dependencies
npm install

# 2. Build to check for TypeScript errors
ng build

# 3. Start dev server
ng serve

# 4. Open browser
# http://localhost:4200

# 5. Check:
# ✓ Chat icon visible (bottom-right)
# ✓ Click opens chat window
# ✓ Can type message
# ✓ Can send with Enter key
# ✓ Bot responds (if API key is correct)
```

---

## 🔑 API Provider Setup

### OpenRouter (Recommended - Easiest)
1. Go to https://openrouter.ai/keys
2. Sign up / Login
3. Copy your API key starting with `sk-or-`
4. Paste in environment.ts as `apiKey`
5. Set model to `openai/gpt-3.5-turbo`

### OpenAI
1. Go to https://platform.openai.com/api-keys
2. Sign up / Login
3. Create API key (starts with `sk-`)
4. Paste in environment.ts
5. Set model to `gpt-3.5-turbo`

### Gemini
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Set provider to `gemini`
5. Set model to `gemini-pro`

### Groq (Free)
1. Go to https://console.groq.com
2. Sign up / Login
3. Create API key
4. Set provider to `groq`
5. Set model to `mixtral-8x7b-32768`

---

## 📝 Example Configuration

### OpenRouter Setup
```typescript
export const environment = {
  production: false,
  chatbot: {
    provider: 'openrouter',
    apiKey: 'sk-or-YOUR_KEY_HERE',
    model: 'openai/gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7,
    maxHistoryLength: 10
  }
};
```

### OpenAI Setup
```typescript
export const environment = {
  production: false,
  chatbot: {
    provider: 'openai',
    apiKey: 'sk-YOUR_KEY_HERE',
    model: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7,
    maxHistoryLength: 10
  }
};
```

---

## 🐛 Troubleshooting

### Chat Icon Doesn't Show
```bash
# 1. Clear browser cache (Ctrl+Shift+Del)
# 2. Restart dev server (Ctrl+C, then ng serve)
# 3. Check browser console (F12)
```

### API Returns Error
```
Check:
1. API key is copied correctly (no spaces)
2. Provider name is spelled correctly
3. API key is still active in provider dashboard
4. You have API credits/quota available
```

### Build Fails
```bash
# Delete node_modules and reinstall
rm -r node_modules
npm install
ng build
```

### Slow Responses
- Use `maxTokens: 500` instead of 1000
- Use `gpt-3.5-turbo` (faster than gpt-4)
- Reduce `temperature` to 0.5

---

## 📊 File Structure

```
portfolioWork/
├── src/
│   ├── app/
│   │   ├── app.component.html          (✏️ Modified - added <app-chatbot>)
│   │   ├── app.module.ts               (✏️ Modified - added imports)
│   │   └── shared/
│   │       ├── components/
│   │       │   └── chatbot/
│   │       │       ├── chatbot.component.ts     (🆕)
│   │       │       ├── chatbot.component.html   (🆕)
│   │       │       └── chatbot.component.scss   (🆕)
│   │       ├── services/
│   │       │   └── chatbot.service.ts           (🆕)
│   │       └── models/
│   │           └── chatbot.model.ts             (🆕)
│   └── environments/
│       ├── environment.ts               (🆕 - Dev config)
│       └── environment.prod.ts          (🆕 - Prod config)
├── CHATBOT_SETUP.md                     (🆕 - Setup guide)
├── CHATBOT_CUSTOMIZATION.md             (🆕 - Examples)
├── CHATBOT_CHECKLIST.md                 (🆕 - Verification)
├── deploy-chatbot.bat                   (🆕 - Windows script)
└── deploy-chatbot.sh                    (🆕 - Unix script)
```

---

## 🚀 Deployment Timeline

When you're ready to deploy:

### Test Production Build (5 min)
```bash
ng build --configuration production
npx http-server dist/portfolioWork -p 8080
# Visit http://localhost:8080
```

### Deploy to GitHub Pages (5 min)
```bash
# Deploy with CLI
angular-cli-ghpages

# Or manual:
# Push dist/ to gh-pages branch
```

### Full Timeline
- Get API key: 5 min
- Configure: 2 min
- Test local: 5 min
- Build: 2 min
- Deploy: 5 min
- **Total: ~20 minutes**

---

## ✨ What Works Out of the Box

✅ Chat window opens/closes with animation
✅ Messages appear instantly
✅ Typing indicator shows while waiting
✅ Auto-scrolls to latest message
✅ Mobile responsive
✅ Keyboard support (Enter to send)
✅ Clean dark theme
✅ Error handling
✅ Portfolio-aware system prompt

Just need to add your API key!

---

## 🔄 Git Workflow

### Current State
```
main (production) - Unchanged, safe
  ↓
feature (working) - All chatbot code committed
```

### If You Want to Test on Main
```bash
# Merge feature into main when ready
git checkout main
git merge feature

# Or revert changes
git checkout main
```

### To Keep Branches Separate
```bash
# Work on feature
git checkout feature
# Make changes, test, commit

# When ready for production
git checkout main
git merge feature
```

---

## 📚 Documentation Reading Order

1. **This file** (Quick Start) - 5 min read
2. **CHATBOT_CHECKLIST.md** - Feature verification - 10 min
3. **CHATBOT_SETUP.md** - Complete reference - 20 min
4. **CHATBOT_CUSTOMIZATION.md** - Advanced options - 15 min

---

## ✅ Checklist Before Deploying

- [ ] API key obtained from chosen provider
- [ ] environment.ts updated with API key
- [ ] environment.prod.ts updated with API key
- [ ] `npm install` completed
- [ ] `ng serve` works without errors
- [ ] Chat icon visible and clickable
- [ ] Messages can be sent and received
- [ ] `ng build` succeeds
- [ ] Production build tested locally
- [ ] Mobile responsiveness verified
- [ ] No console errors in DevTools

---

## 💡 Pro Tips

1. **Save API Key Safely** - Don't share your actual key
2. **Monitor Usage** - Check provider dashboard daily
3. **Set Alerts** - Enable spending alerts in provider dashboard
4. **Test First** - Always test locally before deploying
5. **Rotate Keys** - Change API key monthly

---

## 🎉 You're All Set!

Your chatbot is production-ready. 

**Next Step:** Add your API key to environment.ts and run `ng serve`

Good luck! 🚀

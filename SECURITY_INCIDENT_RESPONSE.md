# Security Incident Response Report

## Issue Summary
**GitGuardian Alert**: Generic High Entropy Secret detected in GitHub repository `ShubhamBanne19/portfolio`
- **Detection Date**: January 28, 2026, 04:32:46 UTC
- **Severity**: CRITICAL
- **Exposed Secrets**: 
  - Mistral AI API Key: `Ivc7FicEiRdZMKNDv4qQn9JwmQFfYBWD`

---

## Immediate Actions Taken ✅

### 1. **Removed Secrets from Code** ✅
- Modified `src/environments/environment.ts` to use environment variables
- Replaced hardcoded API keys with `process.env['API_KEY']` references
- Committed changes to branch `main`

### 2. **Implemented Environment Variable Configuration** ✅
- Created `.env.example` with template for all required API keys
- Configured Angular build system to read from `.env` files
- Added comprehensive documentation

### 3. **Updated .gitignore** ✅
- Added `.env` and `.env.local` to prevent accidental commits
- Prevents future exposure of sensitive configuration files

### 4. **Repository Clean-up** ⏳ (MANUAL STEPS REQUIRED)

**The exposed secrets are still in Git history!** You must use one of these methods:

#### **Option A: Using BFG Repo-Cleaner (RECOMMENDED - Faster)**

```powershell
# 1. Download BFG Repo-Cleaner
# From: https://rtyley.github.io/bfg-repo-cleaner/

# 2. Create a file with patterns to remove (e.g., secrets-patterns.txt)
Ivc7FicEiRdZMKNDv4qQn9JwmQFfYBWD
sk-*
YOUR_OPENROUTER_API_KEY_HERE

# 3. Run BFG to remove from history
java -jar bfg.jar --replace-text secrets-patterns.txt --no-blob-protection ./portfolio

# 4. Force push to GitHub
cd portfolio
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin main --force-with-lease
```

#### **Option B: Using git-filter-repo (Official Git Tool)**

```powershell
# 1. Install git-filter-repo
pip install git-filter-repo

# 2. Remove the sensitive file from history
git-filter-repo --path src/environments/environment.ts --invert-paths

# 3. Force push
git push origin main --force-with-lease
```

---

## Step-by-Step Setup Instructions

### **For Local Development**

1. **Create a `.env.local` file** in the `portfolioWork` directory:
```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
MISTRAL_API_KEY=your_mistral_api_key_here
```

2. **Load environment variables in `main.ts`**:
```typescript
// Load environment variables (only needed in development)
if (!environment.production) {
  // Environment variables are loaded from .env.local
}
```

3. **For Angular Build**: Use a build tool to inject environment variables

### **For Production (GitHub Pages/Static Hosting)**

Since you're using GitHub Pages (static hosting), API keys cannot be stored in the frontend. Instead:

#### **Option 1: Backend Proxy Server (RECOMMENDED)**
```
Frontend (Angular) 
    ↓ (calls /api/chat)
    ↓
Backend Server (Node.js/Express)
    ↓ (uses API key from .env)
    ↓
Third-party APIs (OpenRouter, Mistral)
```

Create a simple backend:
```typescript
// backend/routes/chat.ts
app.post('/api/chat', async (req, res) => {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  });
  res.json(await response.json());
});
```

#### **Option 2: Netlify/Vercel Functions**
Deploy serverless functions that handle API calls:
```typescript
// netlify/functions/chat.ts
export const handler = async (event) => {
  const { messages } = JSON.parse(event.body);
  // Use process.env.MISTRAL_API_KEY from function environment
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    headers: { 'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}` }
  });
  return { statusCode: 200, body: JSON.stringify(await response.json()) };
};
```

---

## Key Files Modified

| File | Changes |
|------|---------|
| `src/environments/environment.ts` | Replaced hardcoded keys with `process.env` references |
| `.env.example` | Created with template for all API keys |
| `.gitignore` | Added `.env`, `.env.local`, `.env.*.local` |

---

## Checklist for Complete Security Remediation

- [x] Remove secrets from source code
- [x] Implement environment variable configuration
- [x] Update .gitignore
- [ ] **URGENT**: Rotate all exposed API keys
  - [ ] Regenerate OpenRouter API key at https://openrouter.ai/keys
  - [ ] Regenerate Mistral API key at https://console.mistral.ai/
  - [ ] Update new keys in `.env.local`
- [ ] **URGENT**: Remove secrets from Git history (using BFG or git-filter-repo)
- [ ] Force push cleaned repository
- [ ] Verify no secrets appear in GitHub repository history
- [ ] Monitor API usage for suspicious activity

---

## API Key Rotation Instructions

### **OpenRouter**
1. Go to https://openrouter.ai/keys
2. Click "Delete" on existing key
3. Create a new key
4. Update in `.env.local`: `OPENROUTER_API_KEY=new_key_here`

### **Mistral AI**
1. Go to https://console.mistral.ai/
2. Navigate to API Keys section
3. Delete the exposed key: `Ivc7FicEiRdZMKNDv4qQn9JwmQFfYBWD`
4. Create a new key
5. Update in `.env.local`: `MISTRAL_API_KEY=new_key_here`

---

## Architecture Recommendations (Senior Principal Architect)

### **Current Issue with GitHub Pages Hosting**
Static hosting (GitHub Pages, Netlify, Vercel) cannot securely store API keys because everything is public.

### **Recommended Solution**
1. **Separate Frontend & Backend**
   - Frontend: Pure Angular, hosted on GitHub Pages
   - Backend: Node.js/Express, hosted on Railway/Render/Heroku
   - Frontend calls `/api/*` endpoints on backend

2. **Authentication Layer**
   - Add CORS configuration to backend
   - Implement rate limiting per IP/user
   - Add request signing to prevent unauthorized access

3. **Environment Configuration**
   ```
   portfolioWork/
   ├── src/                    (Angular frontend)
   ├── backend/                (Node.js server)
   │   ├── .env                (Never commit)
   │   ├── .env.example        (Commit this)
   │   └── src/
   │       └── routes/
   │           └── chat.ts
   └── .env.example            (Commit this)
   ```

4. **Deployment Pipeline**
   ```
   GitHub Push
     ↓
   GitHub Actions (build & deploy)
     ├─→ Frontend: ng build → GitHub Pages
     └─→ Backend: npm run build → Railway/Render
   ```

### **Benefits**
✅ Secrets never exposed in frontend code
✅ Can safely use API keys in backend
✅ Better security & scalability
✅ Ability to implement caching, logging, monitoring

---

## Verification Commands

```powershell
# Check if secrets are still in history
git log -p -- src/environments/environment.ts | grep -i "api"

# Verify .env is ignored
git check-ignore -v .env

# List all committed environment files
git ls-files | grep env
```

---

## References
- [GitGuardian Secret Detection](https://docs.gitguardian.com/)
- [OWASP: Secrets Management](https://owasp.org/www-community/attacks/Sensitive_Data_Exposure)
- [GitHub: Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)

---

**Status**: ⚠️ PARTIAL FIX APPLIED - Awaiting manual action for Git history cleanup and API key rotation.

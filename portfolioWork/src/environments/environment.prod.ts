export const environment = {
  production: true,
  // IMPORTANT: Replace with your actual Railway/Render backend URL after deployment
  backendUrl: 'https://portfolio-backend-production.railway.app',
  
  chatbot: {
    // Uses backend proxy - no direct API calls from frontend
    provider: 'backend-proxy',
    apiKey: '', // NOT NEEDED - backend handles authentication
    model: 'openai/gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7,
    maxHistoryLength: 10
    
    // SECURITY: All API keys are on the backend server only
    // Frontend never has access to API keys
    // Backend is private and secure
  },

  mistral: {
    // Backend proxies to this
    apiUrl: 'https://api.mistral.ai/v1/chat/completions',
    apiType: 'mistral-official',
    apiKey: '', // NOT NEEDED - backend has actual key in .env
    model: 'mistral-small-latest',
    temperature: 0.2,
    top_p: 0.9,
    max_tokens: 300
  }
};

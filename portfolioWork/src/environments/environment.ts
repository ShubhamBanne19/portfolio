export const environment = {
  production: false,
  backendUrl: 'http://localhost:5000', // Local backend for development
  
  chatbot: {
    // Now uses backend proxy - no direct API calls from frontend
    provider: 'backend-proxy',
    apiKey: '', // API keys are on backend only
    model: 'openai/gpt-3.5-turbo',
    
    maxTokens: 1000,
    temperature: 0.7,
    maxHistoryLength: 10 // Number of previous messages to keep for context
  },

  // Mistral Inference Configuration (Backend handles this)
  mistral: {
    apiUrl: 'https://api.mistral.ai/v1/chat/completions', // Backend proxies to this
    apiType: 'mistral-official',
    apiKey: '', // Backend has actual key in .env
    model: 'mistral-small-latest',
    temperature: 0.2,
    top_p: 0.9,
    max_tokens: 300
  }
};

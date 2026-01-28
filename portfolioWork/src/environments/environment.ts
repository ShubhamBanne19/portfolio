export const environment = {
  production: false,
  chatbot: {
    // Use OpenRouter (supports multiple models without switching providers)
    provider: 'openrouter',
    apiKey: 'YOUR_OPENROUTER_API_KEY_HERE', // Get from https://openrouter.ai/keys
    model: 'openai/gpt-3.5-turbo', // Fast and cost-effective
    
    // Alternative providers (comment/uncomment as needed)
    // provider: 'openai',
    // apiKey: 'sk-YOUR_OPENAI_API_KEY',
    // model: 'gpt-3.5-turbo',
    
    // provider: 'gemini',
    // apiKey: 'YOUR_GOOGLE_GEMINI_API_KEY',
    // model: 'gemini-pro',
    
    maxTokens: 1000,
    temperature: 0.7,
    maxHistoryLength: 10 // Number of previous messages to keep for context
  },

  // Mistral Inference Configuration
  mistral: {
    // Mistral Official API (chat/completions endpoint)
    apiUrl: 'https://api.mistral.ai/v1/chat/completions',
    apiType: 'mistral-official',
    apiKey: 'Ivc7FicEiRdZMKNDv4qQn9JwmQFfYBWD',  // Get from https://console.mistral.ai/
    
    // Alternative: Local vLLM (uncomment to use)
    // apiUrl: 'http://localhost:8000/v1/completions',
    // apiType: 'completions',
    // apiKey: '',
    
    model: 'mistral-small-latest',
    temperature: 0.2, // Low for factual responses
    top_p: 0.9,
    max_tokens: 300
  }
};

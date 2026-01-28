export const environment = {
  production: true,
  chatbot: {
    // Use OpenRouter for production
    provider: 'openrouter',
    apiKey: 'YOUR_OPENROUTER_API_KEY_HERE', // ⚠️ WARNING: This will be visible in production bundle on GitHub Pages
    model: 'openai/gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7,
    maxHistoryLength: 10
    
    // SECURITY NOTE FOR GITHUB PAGES:
    // Since this is a static site on GitHub Pages, your API key will be visible in the browser.
    // Recommendations:
    // 1. Use a provider with request limits and monitoring (OpenRouter allows this)
    // 2. Implement rate limiting on your API key
    // 3. Monitor API usage in your provider dashboard
    // 4. Consider setting up a proxy backend if possible
    // 5. Rotate your API key regularly if abuse is detected
  }
};
